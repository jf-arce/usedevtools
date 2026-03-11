import { HeroSearch } from "./hero-search";
import { TheInfiniteGrid } from "@/components/the-infinite-grid";

export const Hero = ({ tools }: { tools: any[] }) => {
	return (
		<TheInfiniteGrid className="min-h-[calc(100vh-4rem)]">
			<section id="home-hero" className="relative flex items-center w-full py-20">
				<div className="container relative z-10 mx-auto px-4 flex justify-center items-center">
					<div className="space-y-8 md:space-y-12 animate-fade-in w-full flex flex-col items-center text-center">
						<div className="space-y-6 flex flex-col items-center">
							<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
								Find the right tool.
								<br />
								<span className="text-indigo-400">Ship faster.</span>
							</h1>
							<p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
								A curated catalog of developer tools, libraries, and services. Search, compare, and
								pick what fits your stack.
							</p>
						</div>

						<div className="space-y-3 max-w-2xl w-full">
							<HeroSearch />
						</div>

						<div className="flex justify-center items-center gap-8 sm:gap-12 pt-8">
							<div>
								<div className="text-2xl font-bold tabular-nums">{tools.length * 50}+</div>
								<div className="text-xs text-muted-foreground">Tools listed</div>
							</div>
							<div className="w-px h-8 bg-border" />
							<div>
								<div className="text-2xl font-bold tabular-nums">12</div>
								<div className="text-xs text-muted-foreground">Categories</div>
							</div>
							<div className="w-px h-8 bg-border" />
							<div>
								<div className="text-2xl font-bold tabular-nums">100%</div>
								<div className="text-xs text-muted-foreground">Free & open</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</TheInfiniteGrid>
	);
};
