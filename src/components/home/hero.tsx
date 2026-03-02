import { Terminal, ChevronRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { HeroSearch } from "./hero-search";

export const Hero = ({ tools }: { tools: any[] }) => {
	return (
		<section
			id="home-hero"
			className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden"
		>
			<div className="container relative z-10 max-w-7xl mx-auto px-4">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
					<div className="space-y-8 animate-fade-in">
						<div
							className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border bg-muted/50 text-muted-foreground text-xs font-mono"
							id="version-badge"
						>
							<div className="w-1.5 h-1.5 rounded-full bg-green-500" />
							v2.0 — open source
						</div>

						<div className="space-y-4">
							<h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
								Find the right tool.
								<br />
								<span className="text-indigo-400">Ship faster.</span>
							</h1>
							<p className="text-lg text-muted-foreground max-w-md leading-relaxed">
								A curated catalog of developer tools, libraries, and services. Search, compare, and
								pick what fits your stack.
							</p>
						</div>

						<div className="space-y-3 max-w-lg">
							<HeroSearch />
						</div>

						<div className="flex items-center gap-8 pt-4">
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

					<div className="hidden lg:block animate-slide-up">
						<div className="relative">
							<div className="absolute -inset-4 bg-linear-to-br from-primary/5 via-transparent to-primary/5 rounded-3xl blur-2xl" />

							<div className="relative border border-border rounded-2xl bg-card overflow-hidden shadow-2xl shadow-black/20">
								<div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
									<div className="flex gap-1.5">
										<div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
										<div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
										<div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
									</div>
									<span className="text-xs text-muted-foreground font-mono ml-2">
										usedevtools — catalog
									</span>
								</div>

								<div className="p-5 space-y-3">
									{tools.slice(0, 5).map((tool, i) => (
										<div
											key={tool.id}
											className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-border hover:bg-muted/30 transition-all group"
										>
											<div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0">
												<Terminal className="h-4 w-4 text-muted-foreground" />
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2">
													<span className="text-sm font-medium truncate group-hover:text-foreground transition-colors">
														{tool.title}
													</span>
													<Badge
														variant="secondary"
														className="text-[10px] px-1.5 py-0 h-4 shrink-0"
													>
														{tool.category.name}
													</Badge>
												</div>
												<p className="text-xs text-muted-foreground truncate mt-0.5">
													{tool.description}
												</p>
											</div>
											<ExternalLink className="h-3.5 w-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
										</div>
									))}

									<div className="flex items-center justify-center pt-1">
										<Link
											href="/explore"
											className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-1"
										>
											View all tools <ChevronRight className="h-3 w-3" />
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="absolute bottom-0 left-0 w-full h-24 bg-linear-to-t from-background to-transparent" />
		</section>
	);
};
