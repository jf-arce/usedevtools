"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FormStepper } from "@/components/new-tool/form-stepper";
import { StepInfo } from "@/components/new-tool/step-info";
import { StepDetails } from "@/components/new-tool/step-details";
import { StepReview } from "@/components/new-tool/step-review";
import { StepSuccess } from "@/components/new-tool/step-success";
import { PreviewSidebar } from "@/components/new-tool/preview-sidebar";
import { NewTool, Category, SubCategory } from "@/types/tool";
import { submitNewTool } from "@/actions/submit-new-tool";
import { PricingType } from "@prisma/client";

export default function NewToolPage() {
	const [formData, setFormData] = useState<NewTool>({
		title: "",
		url: "",
		category: { id: "", name: "" },
		subCategory: { id: "", name: "" },
		pricing: "FREE",
		description: "",
		stack: [],
	});

	const [step, setStep] = useState(1);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { id, value } = e.target;
		if (!id) return;
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	const setPricing = (value: PricingType) => {
		setFormData((prev) => ({ ...prev, pricing: value }));
	};

	const addStackTag = (tag: string) => {
		if (tag && !formData.stack.includes(tag)) {
			setFormData((prev) => ({ ...prev, stack: [...prev.stack, tag] }));
		}
	};

	const removeStackTag = (tag: string) => {
		setFormData((prev) => ({ ...prev, stack: prev.stack.filter((t: string) => t !== tag) }));
	};

	const handleCategoryChange = (category: Category) => {
		setFormData((prev) => ({ ...prev, category, subCategory: { id: "", name: "" } }));
	};

	const handleSubCategoryChange = (subCategory: SubCategory) => {
		setFormData((prev) => ({ ...prev, subCategory }));
	};

	const handleOnSubmit = () => {
		setStep(4);
		setFormData({
			title: "",
			url: "",
			category: { id: "", name: "" },
			subCategory: { id: "", name: "" },
			pricing: "FREE",
			description: "",
			stack: [],
		});

		submitNewTool(formData);
	};

	return (
		<main className="min-h-screen bg-background text-foreground antialiased relative overflow-hidden font-sans">
			<div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl relative z-10">
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
							{/* <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-colors duration-700"></div> */}
							<CardContent className="p-6 md:p-10 relative z-10">
								{step === 1 && (
									<StepInfo formData={formData} onChange={handleChange} onNext={() => setStep(2)} />
								)}

								{step === 2 && (
									<StepDetails
										formData={formData}
										onChange={handleChange}
										onPricingChange={setPricing}
										onCategoryChange={handleCategoryChange}
										onSubCategoryChange={handleSubCategoryChange}
										onAddStack={addStackTag}
										onRemoveStack={removeStackTag}
										onBack={() => setStep(1)}
										onNext={() => setStep(3)}
									/>
								)}

								{step === 3 && (
									<StepReview
										formData={formData}
										onBack={() => setStep(2)}
										onSubmit={handleOnSubmit}
									/>
								)}

								{step === 4 && <StepSuccess />}
							</CardContent>
						</Card>
					</div>

					<div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-8">
						<PreviewSidebar formData={formData} />
					</div>
				</div>
			</div>
		</main>
	);
}
