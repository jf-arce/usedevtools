import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { MousePointer2 } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { ToolBentoGrid } from "@/components/home/tool-bento-grid";

export default async function Home() {
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
			<Hero tools={tools} />
			<ToolBentoGrid tools={tools} />
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
