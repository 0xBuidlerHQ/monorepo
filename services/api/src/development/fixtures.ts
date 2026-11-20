import { itemDisplayTitle } from "@0xhq/api-client/passport-item";
import { readFile } from "node:fs/promises";
import type { PassportIssuance, SubmissionStatus } from "@0xhq/api-client/types";
import type { PassportImage } from "../passports/assets.ts";

// Anvil's public development wallets. No customer account or real certification is used.
export const demoWallets = ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"];
const cards = [
 { number: "4", name: "Charizard", grade: "10" }, { number: "2", name: "Blastoise", grade: "9" },
 { number: "15", name: "Venusaur", grade: "9" }, { number: "58", name: "Pikachu", grade: "10" },
 { number: "10", name: "Mewtwo", grade: "8" }, { number: "8", name: "Machamp", grade: "9" },
 { number: "16", name: "Zapdos", grade: "9" }, { number: "1", name: "Alakazam", grade: "8" },
];
export const developmentFixtures = [
 ...cards.map((card, index) => ({ ...card, status: "approved" as SubmissionStatus, issue: true, owner: index % demoWallets.length, transfer: index < 3 })),
 ...(["requested", "accepted", "under_inspection", "rejected"] as SubmissionStatus[]).map((status, index) => ({ ...cards[index], status, issue: false, owner: index % demoWallets.length, transfer: false })),
].map((fixture, index) => ({ ...fixture, item: { type: "card", schemaVersion: 1, universe: "pokemon", attributes: { sealed: false, subject: fixture.name, set: "Base Set", number: fixture.number, total: "102" } }, title: itemDisplayTitle({ type: "card", schemaVersion: 1, universe: "pokemon", attributes: { sealed: false, subject: fixture.name, set: "Base Set", number: fixture.number, total: "102" } }), certifier: "PSA" as const, certificationNumber: `99000000${String(index + 1).padStart(4, "0")}`, requestId: `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}` }));
export async function fixtureImage(fixture: { number: string }) {
 return readFile(new URL(`../../../../apps/app.trueorigin.com/public/images/cards/base1-${fixture.number}.webp`, import.meta.url));
}
export async function developmentPassportImage(passport: PassportIssuance): Promise<PassportImage | undefined> {
 const fixture = developmentFixtures.find(row => row.certifier === passport.certifier && row.certificationNumber === passport.certificationNumber);
 return fixture ? { name: "passport.webp", contentType: "image/webp", bytes: await fixtureImage(fixture), development: true } : undefined;
}
