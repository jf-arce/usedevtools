import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	serverExternalPackages: ["@prisma/adapter-neon"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "www.google.com",
				pathname: "/s2/favicons/**",
			},
		],
	},
};

export default nextConfig;
