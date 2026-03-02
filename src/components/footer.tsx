import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";
import { UseDevToolsIcon } from "./icons";

export const Footer = () => {
	return (
		<footer className="w-full border-t border-white/5 py-16 relative">
			<div className="container px-4 mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
					<div className="col-span-1 md:col-span-2 space-y-4">
						<Link href="/" className="flex items-center gap-2 group">
							<UseDevToolsIcon className="h-6 w-6" />
							<div>
								<span className="font-bold text-xl">UseDev</span>
								<span className="font-bold text-xl text-tertiary">Tools.</span>
							</div>
						</Link>
						<p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
							La plataforma definitiva para descubrir y compartir las herramientas que impulsan el
							desarrollo moderno. Construido por devs, para devs.
						</p>
					</div>

					<div>
						<h4 className="font-semibold mb-4 text-sm uppercase tracking-widest text-primary/80">
							Plataforma
						</h4>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link href="/explore" className="hover:text-primary transition-colors">
									Explorar
								</Link>
							</li>
							<li>
								<Link href="/new" className="hover:text-primary transition-colors">
									Añadir Tool
								</Link>
							</li>
							<li>
								<Link href="/categories" className="hover:text-primary transition-colors">
									Categorías
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="font-semibold mb-4 text-sm uppercase tracking-widest text-primary/80">
							Comunidad
						</h4>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link href="#" className="hover:text-primary transition-colors">
									GitHub
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary transition-colors">
									Discord
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary transition-colors">
									Twitter
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
					<p className="text-xs text-muted-foreground">
						© {new Date().getFullYear()} UseDevTools. Todos los derechos reservados.
					</p>
					<div className="flex items-center gap-6">
						<Link href="#" className="text-muted-foreground hover:text-white transition-colors">
							<Github className="h-4 w-4" />
						</Link>
						<Link href="#" className="text-muted-foreground hover:text-white transition-colors">
							<Twitter className="h-4 w-4" />
						</Link>
						<Link href="#" className="text-muted-foreground hover:text-white transition-colors">
							<Linkedin className="h-4 w-4" />
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};
