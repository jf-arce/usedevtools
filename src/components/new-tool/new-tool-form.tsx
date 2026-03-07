"use client";
import { useActionState, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FormStepper } from "@/components/new-tool/form-stepper";
import { StepInfo } from "@/components/new-tool/step-info";
import { StepDetails } from "@/components/new-tool/step-details";
import { StepReview } from "@/components/new-tool/step-review";
import { StepSuccess } from "@/components/new-tool/step-success";
import { PreviewSidebar } from "@/components/new-tool/preview-sidebar";
import { Category, NewTool } from "@/types/tool";
import { NewToolFormValues } from "@/validations/new-tool-validation";
import { submitNewToolAction } from "@/actions/submit-new-tool";
import { type FormActionState } from "@/types/formActionState";

const INITIAL_STATE: FormActionState<NewTool> = {
	success: false,
	error: null,
	data: null,
};

export const NewToolForm = ({ categories }: { categories: Category[] }) => {
	const [step, setStep] = useState(1);
	const [formState, formAction, isPending] = useActionState(submitNewToolAction, INITIAL_STATE);
	const formRef = useRef<HTMLFormElement>(null);
	const [formDraft, setFormDraft] = useState<NewToolFormValues | null>(null);

	const collectFormData = (): NewToolFormValues | null => {
		const form = formRef.current;
		if (!form) return null;
		const fd = new FormData(form);
		let stack: string[] = [];
		try {
			stack = JSON.parse(fd.get("stack") as string);
		} catch {
			stack = [];
		}
		return {
			title: fd.get("title") as string,
			url: fd.get("url") as string,
			category: { id: fd.get("categoryId") as string, name: fd.get("categoryName") as string },
			subCategory: {
				id: fd.get("subCategoryId") as string,
				name: fd.get("subCategoryName") as string,
			},
			pricing: fd.get("pricing") as NewToolFormValues["pricing"],
			stack,
			description: (fd.get("description") as string) ?? "",
		};
	};

	const goToReview = () => {
		// Sync read since we're navigating immediately
		setFormDraft(collectFormData());
		setStep(3);
	};

	const updatePreview = () => {
		// Defer read so React can flush setState changes to hidden inputs first
		setTimeout(() => setFormDraft(collectFormData()), 0);
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
			<div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-10">
				<div className="space-y-4">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider">
						<Sparkles className="h-3 w-3" />
						<span>Directorio Premium</span>
					</div>
					<h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
						{step === 3 ? "Revisa tu publicación" : "Publicar nueva herramienta"}
					</h1>
					<p className="text-muted-foreground text-lg max-w-2xl">
						{step === 4
							? "Tu herramienta ha sido enviada con éxito."
							: "Contribuye al directorio premium de recursos para desarrolladores. Ayuda a la comunidad a descubrir las mejores herramientas."}
					</p>
				</div>

				<FormStepper step={step} />

				<Card className="relative overflow-hidden group border-white/5 bg-card/50 backdrop-blur-xl shadow-2xl">
					<CardContent className="p-6 md:p-10 relative z-10">
						<form ref={formRef} action={formAction}>
							<div
								style={{ display: step === 1 ? "block" : "none" }}
								aria-hidden={step !== 1}
								className="space-y-8"
							>
								<StepInfo
									formState={formState}
									onNext={() => setStep(2)}
									onPreviewUpdate={updatePreview}
								/>
							</div>

							<div
								style={{ display: step === 2 ? "block" : "none" }}
								aria-hidden={step !== 2}
								className="space-y-8"
							>
								<StepDetails
									formState={formState}
									categories={categories}
									onBack={() => setStep(1)}
									onNext={goToReview}
									onPreviewUpdate={updatePreview}
								/>
							</div>

							<div style={{ display: step === 3 ? "block" : "none" }} aria-hidden={step !== 3}>
								<StepReview formData={formDraft} onBack={() => setStep(2)} />
							</div>
						</form>

						{step === 4 && <StepSuccess />}
					</CardContent>
				</Card>
			</div>

			<div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-8">
				<PreviewSidebar formData={formDraft ?? formState.data} />
			</div>
		</div>
	);
};
