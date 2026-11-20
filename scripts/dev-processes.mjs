import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, renameSync, unlinkSync, realpathSync } from "node:fs";
import { basename, join, relative, isAbsolute } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

export const developmentPorts = [3000, 3001, 3002, 3003, 3004, 3005, 4337, 8545];
const registryName = ".dev-processes.json";

// Never inspect arguments: RPC URLs and signer keys can appear in them.
export function processTable() {
 const output = execFileSync("ps", ["-axo", "stat=,pid=,ppid=,pgid=,lstart=,comm="], { encoding: "utf8", env: { ...process.env, LC_ALL: "C" } });
 return new Map(output.trim().split("\n").flatMap(line => {
  if (line.trim().startsWith("Z")) return [];
  const match = line.trim().replace(/^\S+\s+/, "").match(/^(\d+)\s+(\d+)\s+(\d+)\s+(\w+\s+\w+\s+\d+\s+[\d:]+\s+\d+)\s+(.+)$/);
  return match ? [[Number(match[1]), { pid: Number(match[1]), parent: Number(match[2]), group: Number(match[3]), started: match[4].replace(/\s+/g, " "), command: match[5] }]] : [];
 }));
}
function sameProcess(a, b) { return a && b && a.pid === b.pid && a.started === b.started; }
function within(workspace, directory) {
 try {
  const path = relative(realpathSync(workspace), realpathSync(directory));
  return !isAbsolute(path) && path !== ".." && !path.startsWith("../");
 } catch { return false; }
}
function cwd(pid) {
 try { return execFileSync("lsof", ["-a", "-p", String(pid), "-d", "cwd", "-Fn"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).split("\n").find(line => line.startsWith("n"))?.slice(1); }
 catch { return undefined; }
}
function protectedPids(table) {
 const result = new Set();
 let current = table.get(process.pid);
 while (current && !result.has(current.pid)) { result.add(current.pid); current = table.get(current.parent); }
 return result;
}
function descendants(table, roots) {
 const found = new Map(roots.filter(root => sameProcess(root, table.get(root.pid))).map(root => [root.pid, root]));
 let changed = true;
 while (changed) {
  changed = false;
  for (const row of table.values()) if (found.has(row.parent) && !found.has(row.pid)) { found.set(row.pid, row); changed = true; }
 }
 return found;
}
function readRegistry(workspace) {
 try { return JSON.parse(readFileSync(join(workspace, registryName), "utf8")); }
 catch (error) { if (error.code === "ENOENT") return null; throw error; }
}
function writeRegistry(workspace, data) {
 const path = join(workspace, registryName);
 const temporary = `${path}.${process.pid}.tmp`;
 writeFileSync(temporary, JSON.stringify(data), { mode: 0o600 });
 renameSync(temporary, path);
}
function removeRegistry(workspace) {
 try { unlinkSync(join(workspace, registryName)); } catch (error) { if (error.code !== "ENOENT") throw error; }
}

export function workspacePortProcesses(workspace, ports = developmentPorts, table = processTable()) {
 if (!ports.length) return { processes: [], foreign: [] };
 let output = "";
 try { output = execFileSync("lsof", ["-nP", ...ports.map(port => `-iTCP:${port}`), "-sTCP:LISTEN", "-Fp"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }); }
 catch (error) { if (error.status !== 1) throw error; output = error.stdout ?? ""; }
 const protectedIds = protectedPids(table), roots = new Map(), foreign = [];
 for (const pid of new Set(output.split("\n").filter(line => /^p\d+$/.test(line)).map(line => Number(line.slice(1))))) {
  let row = table.get(pid);
  const directory = cwd(pid);
  if (!row || !directory || !within(workspace, directory)) { foreign.push(pid); continue; }
  // Include workspace-local launchers/watchers so they cannot respawn the listener.
  let root = row;
  while (true) {
   row = table.get(row.parent);
   if (!row || protectedIds.has(row.pid)) break;
   const name = basename(row.command);
   if (name === "sh") continue;
   if (!/^(node|pnpm|turbo|anvil|next-server)(\s|$)/.test(name)) break;
   const parentDirectory = cwd(row.pid);
   if (!parentDirectory || !within(workspace, parentDirectory)) break;
   root = row;
  }
  if (!protectedIds.has(root.pid)) roots.set(root.pid, root);
 }
 return { processes: [...descendants(table, [...roots.values()]).values()], foreign };
}

export async function stopProcesses(identities, { graceMs = 4000 } = {}) {
 const tracked = new Map(identities.map(row => [row.pid, row]));
 const deadline = Date.now() + graceMs;
 function refresh() {
  const table = processTable(), protectedIds = protectedPids(table);
  for (const row of descendants(table, [...tracked.values()]).values()) tracked.set(row.pid, row);
  return [...tracked.values()].filter(row => !protectedIds.has(row.pid) && sameProcess(row, table.get(row.pid)));
 }
 function signal(rows, value) {
  for (const row of rows.reverse()) {
   try { process.kill(row.pid, value); } catch (error) { if (error.code !== "ESRCH") throw error; }
  }
 }
 let alive = refresh();
 signal(alive, "SIGTERM");
 alive = refresh();
 while (alive.length && Date.now() < deadline) { signal(alive, "SIGTERM"); await delay(100); alive = refresh(); }
 if (alive.length) {
  signal(alive, "SIGKILL");
  for (let attempt = 0; attempt < 30 && alive.length; attempt++) { signal(alive, "SIGKILL"); await delay(100); alive = refresh(); }
 }
 if (alive.length) throw new Error(`Could not stop development processes: ${alive.map(row => row.pid).join(", ")}`);
 return tracked.size;
}

export function superviseDevelopment(workspace, child, options = {}) {
 const initial = processTable();
 const owner = initial.get(process.pid);
 const tracked = new Map();
 let stopped;
 const capture = () => {
  const table = processTable(), root = table.get(child.pid);
  const roots = [...tracked.values()];
  if (root) roots.push(root);
  for (const row of descendants(table, roots).values()) tracked.set(row.pid, row);
  writeRegistry(workspace, { owner, processes: [...tracked.values()] });
 };
 capture();
 const timer = setInterval(capture, 500);
 return function stop() {
  if (stopped) return stopped;
  stopped = (async () => {
   clearInterval(timer);
   capture();
   const leftovers = workspacePortProcesses(workspace).processes;
   await stopProcesses([...tracked.values(), ...leftovers], options);
   const current = readRegistry(workspace);
   if (sameProcess(current?.owner, owner)) removeRegistry(workspace);
  })();
  return stopped;
 };
}

export function assertNoDevelopment(workspace) {
 const existing = readRegistry(workspace), table = processTable();
 if ([...(existing?.processes ?? []), ...(existing?.owner ? [existing.owner] : [])].some(row => sameProcess(row, table.get(row.pid)))) throw new Error("A development run is still active. Run make clean before restarting.");
}

export async function cleanDevelopment(workspace, { ports = developmentPorts, ...options } = {}) {
 const table = processTable(), registry = readRegistry(workspace);
 const { processes, foreign } = workspacePortProcesses(workspace, ports, table);
 const saved = [...(registry?.processes ?? []), ...(registry?.owner ? [registry.owner] : [])].filter(row => sameProcess(row, table.get(row.pid)));
 const count = await stopProcesses([...saved, ...processes], options);
 removeRegistry(workspace);
 return { count, foreign };
}
