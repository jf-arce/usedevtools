import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NewTool } from "@/types/tool";

interface StepReviewProps {
	formData: NewTool;
	onBack: () => void;
	onSubmit: () => void;
}

export function StepReview({ formData, onBack, onSubmit }: StepReviewProps) {
	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="space-y-1">
					<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
						Nombre
					</p>
					<p className="text-xl font-black">{formData.title}</p>
				</div>
				<div className="space-y-1">
					<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
						URL del Sitio
					</p>
					<p className="text-xl font-black text-primary">https://{formData.url}</p>
				</div>
				<div className="space-y-1">
					<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
						Categoría
					</p>
					<p className="text-lg font-bold">
						{formData.category.name} &gt; {formData.subCategory.name}
					</p>
				</div>
				<div className="space-y-1">
					<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
						Precio
					</p>
					<Badge className="font-black h-8 px-4">{formData.pricing}</Badge>
				</div>
			</div>

			<div className="space-y-1">
				<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
					Stack Tecnológico
				</p>
				<div className="flex flex-wrap gap-2">
					{formData.stack.map((tag) => (
						<Badge key={tag} variant="outline" className="text-primary border-primary/30">
							{tag}
						</Badge>
					))}
				</div>
			</div>

			<div className="space-y-1">
				<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
					Descripción
				</p>
				<p className="text-muted-foreground leading-relaxed italic">
					&quot;{formData.description}&quot;
				</p>
			</div>

			<div className="h-px bg-white/5 w-full"></div>

			<div className="flex flex-col sm:flex-row items-center justify-end gap-5">
				<Button
					variant="ghost"
					className="w-full sm:w-auto px-7! h-12 text-muted-foreground hover:text-foreground font-bold"
					onClick={onBack}
				>
					Modificar datos
				</Button>
				<Button
					className="w-full sm:w-auto px-7! h-12 font-bold group/button bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2"
					onClick={onSubmit}
				>
					Publicar Herramienta
					<CheckCircle2 className="h-5 w-5" />
				</Button>
			</div>
		</div>
	);
}
