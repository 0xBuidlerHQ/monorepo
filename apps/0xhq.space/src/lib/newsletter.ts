/** Build only Buttondown's public HTML signup endpoint; no API key is needed. */
export function getNewsletterSignupUrl(username: string | undefined) {
	const value = username?.trim();
	if (!value || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/.test(value))
		return undefined;
	return `https://buttondown.com/api/emails/embed-subscribe/${encodeURIComponent(value)}`;
}
