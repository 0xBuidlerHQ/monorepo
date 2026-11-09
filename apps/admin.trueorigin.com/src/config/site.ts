export const site = {
	name: "TrueOrigin Admin",
	url: "https://admin.trueorigin.com",
	appUrl: process.env.TRUEORIGIN_APP_URL ?? (process.env.NODE_ENV === "production" ? "https://app.trueorigin.com" : "http://localhost:3001"),
	description: "TrueOrigin operations: intake, inspections, and digital passports.",
};
