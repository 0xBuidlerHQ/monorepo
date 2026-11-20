import assert from "node:assert/strict";
import { test } from "node:test";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, writeFile, readFile, rm, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";
import { processTable, stopProcesses, superviseDevelopment, cleanDevelopment, assertNoDevelopment } from "./dev-processes.mjs";

async function until(check) {
 for (let attempt = 0; attempt < 80; attempt++) { if (await check()) return; await delay(50); }
 throw new Error("Timed out waiting for test processes");
}
async function server(workspace) {
 const child = spawn(process.execPath, ["--input-type=module", "-e", "import {createServer} from 'node:net'; const s=createServer(); s.listen(0,'127.0.0.1',()=>console.log(s.address().port));"], { cwd: workspace, stdio: ["ignore", "pipe", "ignore"] });
 const [data] = await once(child.stdout, "data");
 return { child, port: Number(data.toString().trim()) };
}
async function dispose(child) { if (child.exitCode === null && child.signalCode === null) { const exited = once(child, "exit"); child.kill("SIGKILL"); await exited; } }

test("shutdown kills detached descendants even after the launcher exits, including SIGTERM-resistant services", async () => {
 const workspace = await mkdtemp(join(tmpdir(), "trueorigin-shutdown-"));
 let child, grandchild;
 try {
  const fixture = join(workspace, "fixture.mjs");
  await writeFile(fixture, `import {spawn} from 'node:child_process'; import {writeFileSync} from 'node:fs';
const child=spawn(process.execPath,['-e',"process.on('SIGTERM',()=>{});setInterval(()=>{},1000)"],{detached:true,stdio:'ignore'}); child.unref();writeFileSync('child.pid',String(child.pid));setInterval(()=>{},1000);`);
  child = spawn(process.execPath, [fixture], { cwd: workspace, detached: true, stdio: "ignore" });
  const stop = superviseDevelopment(workspace, child, { graceMs: 150 });
  await until(async () => { try { grandchild = Number(await readFile(join(workspace, "child.pid"), "utf8")); return JSON.parse(await readFile(join(workspace, ".dev-processes.json"), "utf8")).processes.some(row => row.pid === grandchild); } catch { return false; } });
  assert.throws(() => assertNoDevelopment(workspace), /make clean/);
  const exited = once(child, "exit"); child.kill("SIGTERM"); await exited;
  assert(processTable().has(grandchild));
  await Promise.all([stop(), stop()]);
  assert(!processTable().has(grandchild));
  await assert.rejects(access(join(workspace, ".dev-processes.json")), { code: "ENOENT" });
  assert.doesNotThrow(() => assertNoDevelopment(workspace));
 } finally {
  if (child) await dispose(child);
  if (grandchild) { try { process.kill(grandchild, "SIGKILL"); } catch {} }
  await rm(workspace, { recursive: true, force: true });
 }
});

test("clean stops workspace port owners while preserving another project's service and development data", async () => {
 const workspace = await mkdtemp(join(tmpdir(), "trueorigin-clean-"));
 const foreignDirectory = await mkdtemp(join(tmpdir(), "another-project-"));
 let own, foreign;
 try {
  await writeFile(join(workspace, "keep.sqlite"), "development data");
  own = await server(workspace); foreign = await server(foreignDirectory);
  const reservation = createServer(); reservation.listen(0, "127.0.0.1"); await once(reservation, "listening");
  const unusedPort = reservation.address().port; await new Promise(resolve => reservation.close(resolve));
  const result = await cleanDevelopment(workspace, { ports: [own.port, foreign.port, unusedPort], graceMs: 150 });
  assert(result.count >= 1); assert(result.foreign.includes(foreign.child.pid));
  assert(!processTable().has(own.child.pid)); assert(processTable().has(foreign.child.pid));
  assert.equal(await readFile(join(workspace, "keep.sqlite"), "utf8"), "development data");
  assert.equal((await cleanDevelopment(workspace, { ports: [own.port], graceMs: 150 })).count, 0);
 } finally { if (own) await dispose(own.child); if (foreign) await dispose(foreign.child); await rm(workspace, { recursive: true, force: true }); await rm(foreignDirectory, { recursive: true, force: true }); }
});

test("stale process identities never signal a reused PID", async () => {
 const workspace = await mkdtemp(join(tmpdir(), "trueorigin-stale-process-"));
 let running;
 try {
  running = await server(workspace);
  const row = processTable().get(running.child.pid); assert(row);
  await stopProcesses([{ ...row, started: "a previous process" }], { graceMs: 100 });
  assert(processTable().has(running.child.pid));
  await writeFile(join(workspace, ".dev-processes.json"), JSON.stringify({ owner: { ...row, started: "a previous process" }, processes: [{ ...row, started: "a previous process" }] }));
  assert.doesNotThrow(() => assertNoDevelopment(workspace));
  await cleanDevelopment(workspace, { ports: [], graceMs: 100 });
  assert(processTable().has(running.child.pid));
 } finally { if (running) await dispose(running.child); await rm(workspace, { recursive: true, force: true }); }
});
