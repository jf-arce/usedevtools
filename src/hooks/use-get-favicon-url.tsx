import { useState } from "react";

export const useGetFaviconUrl = (url: string) => {
	const [logoError, setLogoError] = useState(false);

	// Extract domain from URL to fetch favicon
	const getFaviconUrl = (url: string) => {
		try {
			const domain = new URL(url).hostname;
			return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
		} catch {
			return null;
		}
	};

	return {
		faviconUrl: getFaviconUrl(url),
		logoError,
		setLogoError,
	};
};
