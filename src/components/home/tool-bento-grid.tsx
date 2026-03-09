"use client";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Sparkles, ChevronRight, Terminal } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useState } from "react";
import { toggleFavoriteAction } from "@/actions/tool-interactions";

type FeaturedTool = {
	id: string;
	title: string;
	description: string | null;
	url: string;
	votes: number;
	category: { name: string };
	subCategory: { name: string };
	stack: { name: string }[];
	isFavorite?: boolean;
};

const getFaviconUrl = (url: string) => {
	try {
		const domain = new URL(url).hostname;
		return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
	} catch {
		return null;
	}
};

export const ToolBentoGrid = ({
	featuredTools,
	communityTools,
}: {
	featuredTools: FeaturedTool[];
	communityTools: any[];
}) => {
	const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
		const initial: Record<string, boolean> = {};
		for (const tool of featuredTools) {
			initial[tool.id] = tool.isFavorite ?? false;
		}
		return initial;
	});
	const [favoritingIds, setFavoritingIds] = useState<Set<string>>(new Set());

	const handleFavorite = async (toolId: string) => {
		if (favoritingIds.has(toolId)) return;
		setFavoritingIds((prev) => new Set(prev).add(toolId));

		const res = await toggleFavoriteAction(toolId);
		if (res.error) {
			// Could show a login dialog here
		} else if (res.success) {
			setFavorites((prev) => ({ ...prev, [toolId]: res.isFavorite! }));
		}
		setFavoritingIds((prev) => {
			const next = new Set(prev);
			next.delete(toolId);
			return next;
		});
	};

	return (
		<section id="tools" className="relative overflow-hidden mt-16">
			<div className="container px-4 relative z-10 mx-auto">
				<div className="flex justify-between items-end mb-16 px-2">
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 rounded-full bg-primary" />
							<span className="text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
								Most Voted
							</span>
						</div>
						<h2 className="text-3xl md:text-4xl font-black tracking-tight">Featured Tools</h2>
					</div>
					<Button
						variant="ghost"
						size="sm"
						asChild
						className="hidden sm:flex text-muted-foreground hover:text-white group"
					>
						<Link href="/explore">
							View all{" "}
							<ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
						</Link>
					</Button>
				</div>

				<BentoGrid>
					{featuredTools.map((tool, index) => {
						const faviconUrl = getFaviconUrl(tool.url);
						const isFirst = index === 0;
						const isLastTwo =
							index >= featuredTools.length - 2 && index > 0 && featuredTools.length >= 7;

						return (
							<BentoGridItem
								key={tool.id}
								isLarge={isFirst}
								isFeatured={isFirst}
								isFullWidth={isLastTwo}
								title={tool.title}
								handleFavorite={() => handleFavorite(tool.id)}
								isFavorite={favorites[tool.id] ?? false}
								isFavoriting={favoritingIds.has(tool.id)}
								subtitle={tool.category.name}
								description={tool.description || ""}
								href={tool.url}
								tags={[
									tool.category.name,
									...tool.stack.slice(0, 2).map((s) => s.name),
									`${tool.votes} votes`,
								]}
								faviconUrl={faviconUrl}
							/>
						);
					})}
				</BentoGrid>

				{/* Explore Catalog CTA Button */}
				<div className="mt-16 flex justify-center px-4">
					<Button
						asChild
						size="lg"
						className="group shadow-lg shadow-primary/30 hover:-translate-y-1.25"
					>
						<Link href="/explore" className="flex items-center gap-2">
							Explore the Catalog{" "}
							<ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
						</Link>
					</Button>
				</div>

				{/* Community Feed Section */}
				<div className="mt-32 space-y-12">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
						<div className="space-y-1">
							<h3 className="text-3xl font-black tracking-tight">Community Feed</h3>
							<p className="text-muted-foreground">New tools submitted by developers like you.</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{communityTools.map((tool) => {
							const faviconUrl = getFaviconUrl(tool.url);
							return (
								<BentoGridItem
									key={tool.id}
									title={tool.title}
									subtitle={tool.category.name}
									description={tool.description}
									tags={[tool.category.name, "Community"]}
									href={tool.url}
									faviconUrl={faviconUrl}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
};
