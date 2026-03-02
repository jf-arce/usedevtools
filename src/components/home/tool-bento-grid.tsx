import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { GridBackground } from "@/components/ui/grid-background";
import { Zap, Layers, Sparkles, Terminal, ChevronRight, Monitor, Brush, Cpu } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export const ToolBentoGrid = ({ tools }: { tools: any[] }) => {
	return (
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
						<div className="row-span-1 border border-white/10 rounded-[2.5rem] p-8 dark:bg-card/40 backdrop-blur-xl flex flex-col relative overflow-hidden group/trending h-full min-h-72">
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
							className="h-14 px-12 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto text-base shadow-xl shadow-primary/30 active:scale-95 group"
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
								<p className="text-muted-foreground">New tools submitted by developers like you.</p>
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
	);
};
