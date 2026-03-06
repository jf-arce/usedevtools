import { useState } from "react";
import Link from "next/link";
import { Globe, ArrowRight, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewTool } from "@/types/tool";
import { FormActionState } from "@/types/formActionState";
import { FormError } from "../form-error";
import { stepInfoSchema } from "@/validations/new-tool-validation";
import { z } from "zod";

interface StepInfoProps {
	formState: FormActionState<NewTool>;
	onNext: () => void;
}

export function StepInfo({ formState, onNext }: StepInfoProps) {
	const [errors, setErrors] = useState<Record<string, string[]>>({});

	const handleNext = () => {
		const titleInput = document.getElementById("title") as HTMLInputElement;
		const urlInput = document.getElementById("url") as HTMLInputElement;

		const titleValue = titleInput?.value?.trim() ?? "";
		let urlValue = urlInput?.value?.trim() ?? "";

		// Prepend https:// if user only entered a domain (UI shows https:// prefix)
		if (urlValue && !urlValue.startsWith("http://") && !urlValue.startsWith("https://")) {
			urlValue = `https://${urlValue}`;
		}

		const result = stepInfoSchema.safeParse({
			title: titleValue,
			url: urlValue,
		});

		if (!result.success) {
			const flattenedErrors = z.flattenError(result.error);
			setErrors(flattenedErrors.fieldErrors as Record<string, string[]>);
			return;
		}

		setErrors({});
		onNext();
	};

	return (
		<>
			<div className="space-y-3">
				<label
					className="block text-sm font-bold text-muted-foreground group-focus-within/input:text-primary transition-colors uppercase tracking-wider"
					htmlFor="title"
				>
					Nombre de la Herramienta <span className="text-destructive">*</span>
				</label>
				<div className="relative">
					<input
						className="block w-full rounded-xl border border-white/10 bg-background/50 text-foreground shadow-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/10 sm:text-sm h-14 px-5 placeholder:text-muted-foreground/30 transition-all outline-none"
						id="title"
						name="title"
						placeholder="Ej: Linear, Supabase, Vercel"
						type="text"
						defaultValue={formState.data?.title ?? ""}
					/>
					<div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
						<CheckCircle2 className="h-5 w-5 text-emerald-500" />
					</div>
				</div>
				<FormError error={errors.title ?? formState.errorFields?.title} />
			</div>

			<div className="space-y-3">
				<label
					className="block text-sm font-bold text-muted-foreground group-focus-within/input:text-primary transition-colors uppercase tracking-wider"
					htmlFor="url"
				>
					URL del Sitio Web <span className="text-destructive">*</span>
				</label>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-muted-foreground/50 text-sm">
						<Globe className="h-4 w-4 mr-2" />
						https://
					</div>
					<input
						className="block w-full rounded-xl border border-destructive/30 bg-background/50 text-foreground shadow-sm focus:border-destructive/50 focus:ring-4 focus:ring-destructive/10 sm:text-sm h-14 pl-26 pr-5 placeholder:text-muted-foreground/30 transition-all outline-none"
						id="url"
						name="url"
						placeholder="ejemplo.com"
						type="text"
						defaultValue={formState.data?.url ?? ""}
					/>
					<div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
						<AlertCircle className="h-5 w-5 text-destructive" />
					</div>
				</div>
				<p className="text-sm text-destructive font-medium mt-2 flex items-center gap-2">
					<Info className="h-3 w-3" />
					Por favor, introduce una URL válida con extensión de dominio.
				</p>
				<FormError error={errors.url ?? formState.errorFields?.url} />
			</div>

			<div className="flex flex-col sm:flex-row items-center justify-end gap-5 ">
				<Button
					variant="ghost"
					asChild
					className="w-full sm:w-auto px-7 h-12 text-muted-foreground hover:text-foreground font-bold"
				>
					<Link href="/">Cancelar</Link>
				</Button>
				<Button
					type="button"
					className="w-full sm:w-auto px-7! h-12 font-bold group/button"
					onClick={handleNext}
				>
					Siguiente: Detalles
					<ArrowRight className="h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
				</Button>
			</div>
		</>
	);
}
