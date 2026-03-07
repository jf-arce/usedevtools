import {
	Eye,
	Terminal,
	Globe,
	ExternalLink,
	Heart,
	Bookmark,
	Layout,
	Lightbulb,
	Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { NewToolFormValues } from "@/validations/new-tool-validation";
import Image from "next/image";
import { useGetFaviconUrl } from "@/hooks/use-get-favicon-url";

interface PreviewSidebarProps {
	formData: NewToolFormValues | null;
}

export function PreviewSidebar({ formData }: PreviewSidebarProps) {
	const { faviconUrl, logoError, setLogoError } = useGetFaviconUrl(formData?.url || "");

	return (
		<div className="sticky top-24 space-y-8">
			<div className="space-y-4">
				<h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
					<Eye className="h-4 w-4 text-primary" />
					Vista Previa
				</h3>

				<div className="group relative rounded-3xl bg-card border border-white/5 p-6 transition-all hover:border-primary/30 overflow-hidden">
					<div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

					<div className="flex items-start justify-between mb-5 relative z-10">
						<div className="flex items-center gap-4">
							{faviconUrl && !logoError ? (
								<div className="h-14 w-14 rounded-xl bg-linear-to-br text-xl font-bold text-white shadow-lg overflow-hidden">
									<Image
										src={faviconUrl}
										alt={`${formData?.title} logo`}
										width={48}
										height={48}
										className="h-full w-full object-contain p-1.5 rounded-xl"
										onError={() => setLogoError(true)}
										unoptimized
									/>
								</div>
							) : (
								<div className="h-14 w-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500">
									<Terminal className="h-7 w-7 text-primary" />
								</div>
							)}
							<div>
								<h4 className="text-xl font-black text-foreground leading-tight tracking-tight">
									{formData?.title || "Tu Herramienta"}
								</h4>
								<div className="flex items-center gap-1.5 text-xs text-muted-foreground/70 mt-1 cursor-default hover:text-primary transition-colors">
									<Globe className="h-3 w-3" />
									<span>{formData?.url || "dominio.com"}</span>
									<ExternalLink className="h-2 w-2" />
								</div>
							</div>
						</div>
						<Badge
							variant="secondary"
							className="bg-primary/10 text-primary border-primary/20 font-black text-[10px] uppercase px-3 py-1"
						>
							{formData?.pricing}
						</Badge>
					</div>

					<p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2 mb-6 relative z-10 min-h-10">
						{formData?.description ||
							"Agrega una breve descripción para ver cómo se verá tu herramienta en el directorio."}
					</p>

					<div className="flex flex-wrap gap-1.5 mb-5 relative z-10">
						{(formData?.stack ?? []).map((tag) => (
							<span
								key={tag}
								className="text-[9px] font-bold text-primary/70 uppercase tracking-tighter bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10"
							>
								#{tag}
							</span>
						))}
					</div>

					<div className="flex items-center justify-between pt-5 border-t border-white/5 relative z-10">
						<div className="flex items-center gap-2">
							<Badge
								variant="outline"
								className="bg-background text-[9px] text-muted-foreground/60 uppercase font-black tracking-widest border-white/5 px-3"
							>
								{(formData?.subCategory?.name ?? "-").split(" ")[0]}
							</Badge>
						</div>
						<div className="flex items-center gap-4 text-muted-foreground/50">
							<button className="hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
								<Heart className="h-3.5 w-3.5" />0
							</button>
							<button className="hover:text-foreground transition-colors">
								<Bookmark className="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>
			</div>

			<Card className="rounded-3xl border-white/5 bg-accent/5 backdrop-blur-md overflow-hidden relative">
				<div className="absolute top-0 right-0 p-1 opacity-10">
					<Layout className="h-20 w-20 text-primary" />
				</div>
				<CardContent className="p-6">
					<h4 className="text-foreground text-sm font-black mb-5 flex items-center gap-2 uppercase tracking-widest">
						<div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
							<Lightbulb className="h-4 w-4 text-amber-500" />
						</div>
						Consejos de Publicación
					</h4>
					<ul className="space-y-4">
						{[
							"Usa un nombre conciso y fácil de recordar.",
							"Asegúrate de que la URL sea accesible (https).",
							"Selecciona la categoría más relevante para el SEO.",
							"Una descripción con valor atrae más clics.",
						].map((tip, i) => (
							<li key={i} className="flex items-start gap-4">
								<div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
								<p className="text-xs text-muted-foreground leading-normal">{tip}</p>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>

			<div className="p-6 rounded-3xl border border-white/5 bg-background/40 flex items-center gap-4">
				<div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
					<Info className="h-5 w-5 text-emerald-500" />
				</div>
				<div>
					<p className="text-xs font-bold text-foreground">Aprobación Rápida</p>
					<p className="text-[10px] text-muted-foreground">
						Las herramientas suelen revisarse en menos de 24h.
					</p>
				</div>
			</div>
		</div>
	);
}
