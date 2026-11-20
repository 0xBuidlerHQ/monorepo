export function isPublicActivityId(id: string) {
	return /^[A-Za-z0-9_-]{21}[AQgw]$/.test(id);
}
