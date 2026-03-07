import { useState } from "react";
import Link from "next/link";
import { Globe, ArrowRight, CheckCircle2, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewTool } from "@/types/tool";
import { FormActionState } from "@/types/formActionState";
import { FormError } from "@/components/form-error";
import { stepInfoValidation, urlValidation } from "@/validations/new-tool-validation";
import { z } from "zod";

interface StepInfoProps {
	formState: FormActionState<NewTool>;
	onNext: () => void;
}

const normalizeUrl = (value: string) => {
	const trimmed = value.trim();
	if (trimmed && !trimmed.includes("/")) {
		return `https://${trimmed}`;
	}
	return trimmed;
};

export function StepInfo({ formState, onNext }: StepInfoProps) {
	const [errors, setErrors] = useState<Record<string, string[]>>({});
	const [url, setUrl] = useState("");

	const handleNext = () => {
		const titleInput = document.getElementById("title") as HTMLInputElement;
		const titleValue = titleInput?.value?.trim() ?? "";
		const urlValue = normalizeUrl(url);

		const result = stepInfoValidation({ title: titleValue, url: urlValue });

		if (!result.success) {
			const flattenedErrors = z.flattenError(result.error);
			setErrors(flattenedErrors.fieldErrors as Record<string, string[]>);
			return;
		}

		setErrors({});
		onNext();
	};

	const handleUrlValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
		const urlValue = normalizeUrl(e.target.value);
		setUrl(urlValue);

		const result = urlValidation(urlValue);

		if (!result.success) {
			const flattenedErrors = z.flattenError(result.error);
			setErrors(flattenedErrors.fieldErrors as Record<string, string[]>);
			return;
		}

		setErrors({});
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
					</div>
					<input
						className={`block w-full rounded-xl border border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 bg-background/50 text-foreground shadow-sm sm:text-sm h-14 pl-13 pr-5 placeholder:text-muted-foreground/30 transition-all outline-none`}
						id="url"
						name="url"
						placeholder="https://ejemplo.com o ejemplo.com"
						type="text"
						defaultValue={formState.data?.url ?? ""}
						onChange={(e) => handleUrlValidation(e)}
					/>
					{errors.url ? (
						<div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-red-400">
							<CircleX className="h-5 w-5" />
						</div>
					) : url ? (
						<div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-green-500">
							<CheckCircle2 className="h-5 w-5" />
						</div>
					) : null}
				</div>
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
