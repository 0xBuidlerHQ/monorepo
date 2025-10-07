// db.ts

import { createActor, type SnapshotFrom } from "xstate";

const store: Record<string, string> = {};

const localStorage = {
	getItem: (key: string) => store[key] ?? null,
	setItem: (key: string, value: string) => {
		store[key] = value;
	},
	removeItem: (key: string) => {
		delete store[key];
	},
};

BigInt.prototype.toJSON = function () {
	const int = Number.parseInt(this.toString());
	return int ?? this.toString();
};

const STORAGE_KEY = "machines";

type MachineId = string;
type MachineSnapshot = SnapshotFrom<any>;

interface MachineSnapshotMap {
	[id: MachineId]: MachineSnapshot;
}

const getAllMachinesSnapshot = (): MachineSnapshotMap => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return {};
		return JSON.parse(raw) as MachineSnapshotMap;
	} catch (err) {
		console.error("Failed to load machine states:", err);
		return {};
	}
};

const saveMachinesSnapshot = (map: MachineSnapshotMap) => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
	} catch (err) {
		console.error("Failed to save machine states:", err);
	}
};

const saveMachineSnapshot = (id: MachineId, snapshot: MachineSnapshot) => {
	const all = getAllMachinesSnapshot();
	all[id] = snapshot;
	saveMachinesSnapshot(all);
};

const getMachineSnapshot = (id: MachineId): MachineSnapshot | undefined =>
	getAllMachinesSnapshot()[id];

/**
 * @dev MachineSnapshotDB.
 */
const MachineSnapshotDB = {
	getMachineSnapshot,
	getAllMachinesSnapshot,

	saveMachineSnapshot,
	saveMachinesSnapshot,
};

/**
 * @dev useMachine.
 */
const useMachine = (id: MachineId) => {
	const savedSnapshot = MachineSnapshotDB.getMachineSnapshot(id)!;
	const machine = createActor({}, { snapshot: savedSnapshot });

	machine.subscribe((state) => MachineSnapshotDB.saveMachineSnapshot(id, state));
	machine.start();

	return machine;
};

export { useMachine, MachineSnapshotDB };
