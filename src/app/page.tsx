import { db } from "@/lib/db";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { GridBackground } from "@/components/ui/grid-background";
import { Footer } from "@/components/footer";
import {
	Search,
	Zap,
	Layers,
	Sparkles,
	Terminal,
	MousePointer2,
	ChevronRight,
	ExternalLink,
	Monitor,
	Brush,
	Cpu,
} from "lucide-react";

export default async function Home() {
	// Traer herramientas de la DB
	const tools = await db.tool.findMany({
		include: {
			category: true,
			user: true,
		},
		orderBy: {
			createdAt: "desc",
		},
		take: 6,
	});

	return (
		<main className="bg-background text-foreground font-sans antialiased overflow-x-hidden">
			{/* Hero Section */}
			<section
				id="home-hero"
				className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden"
			>
				<div className="container relative z-10 max-w-7xl mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
						{/* Left Side - Content */}
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
									A curated catalog of developer tools, libraries, and services. Search, compare,
									and pick what fits your stack.
								</p>
							</div>

							{/* Search + Explore */}
							<div className="space-y-3 max-w-lg">
								<div className="flex items-center gap-2">
									<div className="relative flex-1 group">
										<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
										<input
											type="text"
											placeholder="Search tools..."
											className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition-all"
										/>
									</div>
									<Button asChild className="h-11 px-5 rounded-lg font-semibold shrink-0">
										<Link href="/explore">
											Explore
											<ChevronRight className="h-4 w-4 ml-1" />
										</Link>
									</Button>
								</div>
								<div className="flex items-center gap-2 flex-wrap">
									{["Frontend", "Backend", "DevOps", "AI", "Design"].map((tag) => (
										<Link
											key={tag}
											href={`/explore?q=${tag.toLowerCase()}`}
											className="px-2.5 py-1 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
										>
											{tag}
										</Link>
									))}
								</div>
							</div>

							{/* Stats */}
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

						{/* Right Side - Visual */}
						<div className="hidden lg:block animate-slide-up">
							<div className="relative">
								{/* Decorative glow */}
								<div className="absolute -inset-4 bg-linear-to-br from-primary/5 via-transparent to-primary/5 rounded-3xl blur-2xl" />

								{/* Terminal-like card */}
								<div className="relative border border-border rounded-2xl bg-card overflow-hidden shadow-2xl shadow-black/20">
									{/* Title bar */}
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

									{/* Content */}
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

										{/* More indicator */}
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

			{/* Tools Bento Grid Section */}
			<section id="tools" className="relative overflow-hidden bg-background">
				<GridBackground className="border-none bg-transparent">
					<div className="container px-4 relative z-10 mx-auto max-w-7xl">
						<div className="flex justify-between items-end mb-16 px-2">
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-primary" />
									<span className="text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
										Verified Stacks
									</span>
								</div>
								<h2 className="text-4xl md:text-5xl font-black tracking-tight">Featured Tools</h2>
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
							{/* Supabase (2x2) */}
							<BentoGridItem
								isLarge
								isFeatured
								title="Supabase"
								subtitle="The Open Source Firebase Alternative"
								description="Supabase is an open source Firebase alternative. SQL database, Auth, APIs, Edge Functions, Realtime, and Storage."
								href="https://supabase.com"
								tags={["Database", "Open Source", "Free Tier"]}
								icon={<Zap className="h-8 w-8 text-black fill-black" />}
							/>

							{/* Vercel */}
							<BentoGridItem
								title="Vercel"
								subtitle="Develop. Preview. Ship."
								description="The platform for frontend developers, providing speed and reliability for innovators."
								href="https://vercel.com"
								tags={["Hosting", "Next.js"]}
								icon={<Zap className="h-8 w-8 text-black fill-black" />}
							/>

							{/* OpenAI */}
							<BentoGridItem
								title="OpenAI API"
								subtitle="Powering the next generation"
								description="Integrate cutting-edge AI models like GPT-4 into your stack with a powerful developer API."
								href="https://openai.com"
								tags={["AI", "ML"]}
								icon={<Cpu className="h-8 w-8 text-[#74aa9c]" />}
							/>

							{/* Trending AI */}
							<div className="row-span-1 border border-white/10 rounded-[2.5rem] p-8 dark:bg-card/40 backdrop-blur-xl flex flex-col relative overflow-hidden group/trending h-full min-h-[18rem]">
								<div className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent opacity-0 group-hover/trending:opacity-100 transition-opacity" />
								<div className="flex flex-col h-full relative z-10">
									<h3 className="font-bold text-xl flex items-center gap-2 mb-6">
										<Sparkles className="h-5 w-5 text-accent animate-pulse" /> Trending AI
									</h3>
									<div className="space-y-4 flex-1">
										{[
											{ name: "Midjourney", growth: "+142%", icon: "Mj" },
											{ name: "LangChain", growth: "+98%", icon: "Lc" },
											{ name: "Pinecone", growth: "+64%", icon: "Pc" },
										].map((ai, i) => (
											<div
												key={i}
												className="flex items-center justify-between group/item cursor-pointer"
											>
												<div className="flex items-center gap-3">
													<div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-[10px] font-black text-accent">
														{ai.icon}
													</div>
													<span className="font-bold text-muted-foreground group-hover/item:text-white transition-colors">
														{ai.name}
													</span>
												</div>
												<span className="text-accent font-bold">{ai.growth}</span>
											</div>
										))}
									</div>
								</div>
							</div>

							{/* Linear */}
							<BentoGridItem
								title="Linear"
								subtitle="Built for high-performance teams"
								description="Linear helps streamline software projects, sprints, and bug tracking. Built for speed."
								href="https://linear.app"
								tags={["Productivity", "Agile"]}
								icon={<Layers className="h-8 w-8 text-[#5e6ad2]" />}
							/>

							{/* VS Code */}
							<BentoGridItem
								isFullWidth
								title="VS Code"
								subtitle="Code editing. Redefined."
								description="Free. Built on open source. Runs everywhere. The world's most popular code editor."
								href="https://code.visualstudio.com"
								tags={["Editor", "Open Source"]}
								icon={<Monitor className="h-8 w-8 text-[#007acc]" />}
							/>

							{/* Figma */}
							<BentoGridItem
								isFullWidth
								title="Figma"
								subtitle="Collaborative interface design"
								description="Figma connects everyone in the design process so teams can deliver better products."
								href="https://figma.com"
								tags={["Design", "Dev Mode"]}
								icon={<Brush className="h-8 w-8 text-[#f24e1e]" />}
							/>
						</BentoGrid>

						{/* Explore Catalog CTA Button */}
						<div className="mt-16 flex justify-center px-4">
							<Button
								asChild
								size="lg"
								className="h-14 px-12 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto text-base shadow-xl shadow-primary/30 active:scale-95 group shadow-[0_20px_50px_rgba(139,92,246,0.3)]"
							>
								<Link href="/explore" className="flex items-center gap-2">
									Explore the Catalog{" "}
									<ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
								</Link>
							</Button>
						</div>

						{/* Real Tools Section */}
						<div className="mt-40 space-y-12">
							<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
								<div className="space-y-1">
									<h3 className="text-3xl font-black tracking-tight">Community Feed</h3>
									<p className="text-muted-foreground">
										New tools submitted by developers like you.
									</p>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{tools.map((tool) => (
									<BentoGridItem
										key={tool.id}
										title={tool.title}
										subtitle={tool.category.name}
										description={tool.description}
										tags={[tool.category.name, "Community"]}
										href={tool.url}
										icon={<Terminal className="h-8 w-8 text-black fill-black" />}
									/>
								))}
							</div>
						</div>
					</div>
				</GridBackground>
			</section>

			{/* Post Tool CTA Section */}
			<section className="py-40 relative px-4">
				<div className="container px-4 mx-auto max-w-5xl">
					<div className="p-12 md:p-24 rounded-[4rem] border border-white/10 bg-linear-to-b from-white/3 to-transparent backdrop-blur-2xl relative overflow-hidden text-center group">
						<div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-primary/50 to-transparent" />
						<div className="absolute inset-0 bg-radial-[at_50%_0%] from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

						<div className="relative z-10 space-y-10">
							<div className="w-24 h-24 bg-primary/10 border border-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 shadow-3xl shadow-primary/20">
								<MousePointer2 className="h-12 w-12 text-primary" />
							</div>
							<div className="space-y-4">
								<h3 className="text-4xl md:text-7xl font-black tracking-tighter leading-tight">
									Impulsa a otros devs
								</h3>
								<p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
									Descubriste una gema oculta? Un framework que te cambió la vida?{" "}
									<br className="hidden md:block" />
									Compártela con 10k+ desarrolladores y ayuda a construir el stack perfecto.
								</p>
							</div>
							<div className="pt-8 flex flex-col sm:flex-row justify-center gap-6">
								<Button
									asChild
									size="lg"
									className="h-18 px-16 rounded-[1.5rem] font-black text-xl bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all duration-500 shadow-2xl shadow-primary/50"
								>
									<Link href="/new">Publicar Herramienta</Link>
								</Button>
								<Button
									variant="ghost"
									size="lg"
									className="h-18 px-12 rounded-[1.5rem] font-bold text-lg border border-white/10 hover:bg-white/5 transition-all shadow-xl"
								>
									Ver requisitos
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</main>
	);
}
