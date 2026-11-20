export function relativeActivityTime(timestamp: string, now: number): string {
	const seconds = Math.floor((now - new Date(timestamp).getTime()) / 1000);
	if (seconds < 60) return "Just now";
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes} min ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours} hr ago`;
	const days = Math.floor(hours / 24);
	if (days < 30) return `${days} ${days === 1 ? "day" : "days"} ago`;
	const months = Math.floor(days / 30);
	if (months < 12) return `${months} ${months === 1 ? "month" : "months"} ago`;
	const years = Math.floor(days / 365);
	return `${Math.max(1, years)} ${years <= 1 ? "year" : "years"} ago`;
}
