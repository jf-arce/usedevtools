import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StepSuccess() {
	return (
		<div className="py-12 text-center space-y-8 animate-in zoom-in-95 duration-700">
			<div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
				<CheckCircle2 className="h-12 w-12 text-emerald-500" />
			</div>
			<div className="space-y-4">
				<h2 className="text-4xl font-black tracking-tight">¡Todo listo!</h2>
				<p className="text-muted-foreground max-w-md mx-auto">
					Tu herramienta ha sido enviada a moderación. Recibirás un correo cuando esté disponible
					para toda la comunidad.
				</p>
			</div>
			<Button
				asChild
				size="lg"
				className="h-14 px-12 rounded-2xl bg-primary font-black shadow-xl shadow-primary/30"
			>
				<Link href="/">Volver al Inicio</Link>
			</Button>
		</div>
	);
}
