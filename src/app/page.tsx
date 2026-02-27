import { db } from "@/lib/db";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { GridBackground } from "@/components/ui/grid-background";
import { Footer } from "@/components/footer";
import {
	Search,
	Code,
	Database,
	Cloud,
	Cpu,
	Brush,
	Zap,
	Layers,
	Sparkles,
	Github,
	Terminal,
	MousePointer2,
	ChevronRight,
	ExternalLink,
	Monitor,
	Bookmark,
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
				className="relative h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden"
			>
				{/* <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="oklch(0.65 0.2 280)" /> */}

				<div className="container relative z-10 text-center max-w-7xl mx-auto flex flex-col items-center">
					<div
						className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] sm:text-xs font-bold mb-8 animate-fade-in uppercase tracking-wider backdrop-blur-sm"
						id="version-badge"
					>
						<div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
						<span>v2.0 is live! Discover curated developer resources</span>
					</div>

					<h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 animate-slide-up leading-[0.9] text-balance">
						Discover the best <br />
						<span className="bg-linear-to-b from-primary via-primary to-accent bg-clip-text text-transparent italic">
							developer tools.
						</span>
					</h1>

					<p className="text-lg md:text-xl text-muted-foreground/70 max-w-2xl mx-auto mb-12 animate-slide-up [animation-delay:0.1s] leading-relaxed">
						Hand-picked resources to supercharge your workflow. Find the perfect library, SaaS, or
						utility for your next big project.
					</p>

					{/* Search Bar */}
					<div className="w-full max-w-2xl relative mb-12 group animate-slide-up [animation-delay:0.2s]">
						<div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
						<div className="relative flex items-center bg-card/60 border border-white/10 p-2 rounded-2xl backdrop-blur-xl group-focus-within:border-primary/50 transition-all">
							<Search className="h-5 w-5 text-muted-foreground ml-3" />
							<input
								type="text"
								placeholder="Search for 'databases', 'hosting', or 'AI'..."
								className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50"
							/>
							<kbd className="hidden sm:inline-flex h-8 items-center gap-1 rounded border border-white/10 bg-white/5 px-2 font-mono text-[10px] font-medium text-muted-foreground opacity-100 mr-2">
								<span className="text-xs">⌘</span>K
							</kbd>
						</div>
					</div>

					{/* Quick Filters */}
					<div className="flex flex-wrap justify-center gap-3 animate-slide-up [animation-delay:0.3s]">
						{[
							{ icon: <Code className="h-4 w-4" />, label: "Frontend" },
							{ icon: <Database className="h-4 w-4" />, label: "Backend" },
							{ icon: <Cloud className="h-4 w-4" />, label: "DevOps" },
							{ icon: <Cpu className="h-4 w-4" />, label: "AI Tools" },
							{ icon: <Brush className="h-4 w-4" />, label: "Design" },
						].map((item, i) => (
							<button
								key={i}
								className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/20 hover:text-primary transition-all text-sm font-medium text-muted-foreground group"
							>
								<span className="text-muted-foreground group-hover:text-primary transition-colors">
									{item.icon}
								</span>
								{item.label}
							</button>
						))}
					</div>
				</div>

				<div className="absolute bottom-0 left-0 w-full h-40 bg-linear-to-t from-background via-background/80 to-transparent" />
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
