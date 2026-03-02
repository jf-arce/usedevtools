import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "UseDevTools - Discover the best tools for developers",
	description:
		"UseDevTools is the ultimate platform to discover and share the tools that power your development workflow. Explore our curated catalog, find the perfect tool for your needs, and share your own favorites with the community.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}>
				<Navbar />
				{children}
			</body>
		</html>
	);
}
