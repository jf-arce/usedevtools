import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { TECH_STACK_OPTIONS } from "@/constants/tech-stack-options";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NewTool, Category, SubCategory } from "@/types/tool";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectGroup,
	SelectLabel,
} from "@/components/ui/select";

import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxChips,
	ComboboxChip,
	ComboboxChipsInput,
	ComboboxValue,
	useComboboxAnchor,
} from "@/components/ui/combobox";
import { getSubCategories } from "@/data/get-sub-categories";
import { PricingType } from "@prisma/client";
import { FormActionState } from "@/types/formActionState";
import { FormError } from "../form-error";
import { stepDetailsValidation } from "@/validations/new-tool-validation";
import { z } from "zod";

interface StepDetailsProps {
	formState: FormActionState<NewTool>;
	categories: Category[];
	onBack: () => void;
	onNext: () => void;
	onPreviewUpdate: () => void;
}

export function StepDetails({
	formState,
	categories,
	onBack,
	onNext,
	onPreviewUpdate,
}: StepDetailsProps) {
	const [subCategories, setSubCategories] = useState<{ id: string; name: string }[]>([]);
	const [loadingSubCategories, setLoadingSubCategories] = useState(false);

	const [selectedCategory, setSelectedCategory] = useState({
		id: formState.data?.category?.id ?? "",
		name: formState.data?.category?.name ?? "",
	});
	const [selectedSubCategory, setSelectedSubCategory] = useState({
		id: formState.data?.subCategory?.id ?? "",
		name: formState.data?.subCategory?.name ?? "",
	});
	const [pricing, setPricing] = useState<PricingType>(formState.data?.pricing ?? PricingType.FREE);
	const [stack, setStack] = useState<string[]>(formState.data?.stack ?? []);
	const [errors, setErrors] = useState<Record<string, string[]>>({});
	const [descriptionLength, setDescriptionLength] = useState(
		formState.data?.description?.length ?? 0,
	);

	const handleNext = () => {
		const descriptionTextarea = document.getElementById("description") as HTMLTextAreaElement;
		const descriptionValue = descriptionTextarea?.value ?? "";

		const result = stepDetailsValidation({
			description: descriptionValue,
			category: {
				id: selectedCategory.id,
				name: selectedCategory.name,
			},
			subCategory: {
				id: selectedSubCategory.id,
				name: selectedSubCategory.name,
			},
			pricing,
			stack,
		});

		if (!result.success) {
			const flattenedErrors = z.flattenError(result.error);
			setErrors(flattenedErrors.fieldErrors as Record<string, string[]>);
			return;
		}

		setErrors({});
		onNext();
	};

	const handleCategoryChange = async (value: string) => {
		const found = categories.find((c) => c.id === value);
		setSelectedCategory({ id: value, name: found?.name ?? "" });
		setSelectedSubCategory({ id: "", name: "" });
		setLoadingSubCategories(true);
		const subs: SubCategory[] = await getSubCategories(value);
		setSubCategories(subs);
		setLoadingSubCategories(false);
		onPreviewUpdate();
	};

	const handleSubCategoryChange = (value: string) => {
		const found = subCategories.find((s) => s.id === value);
		setSelectedSubCategory({ id: value, name: found?.name ?? "" });
		onPreviewUpdate();
	};

	const anchor = useComboboxAnchor();

	return (
		<>
			{/*Inputs para componentes no nativos*/}
			<input type="hidden" name="categoryId" value={selectedCategory.id} />
			<input type="hidden" name="categoryName" value={selectedCategory.name} />
			<input type="hidden" name="subCategoryId" value={selectedSubCategory.id} />
			<input type="hidden" name="subCategoryName" value={selectedSubCategory.name} />
			<input type="hidden" name="pricing" value={pricing} />
			<input type="hidden" name="stack" value={JSON.stringify(stack)} />

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="space-y-3 group/input">
					<label className="block text-sm font-bold text-muted-foreground group-focus-within/input:text-primary transition-colors uppercase tracking-wider">
						Categoría <span className="text-destructive">*</span>
					</label>
					<div className="relative">
						<Select required value={selectedCategory.id} onValueChange={handleCategoryChange}>
							<SelectTrigger className="w-full h-14! px-5!">
								<SelectValue placeholder="Select a category" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Categories</SelectLabel>
									{categories.map((category) => (
										<SelectItem key={category.id} value={category.id}>
											{category.name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<FormError error={errors.category} />
				</div>

				<div className="space-y-3 group/input">
					<label
						className={cn(
							"block text-sm font-bold text-muted-foreground group-focus-within/input:text-primary transition-colors uppercase tracking-wider",
							subCategories.length === 0 && "opacity-50",
						)}
					>
						Subcategoría <span className="text-destructive">*</span>
					</label>
					<div className="relative">
						<Select
							disabled={subCategories.length === 0}
							value={selectedSubCategory.id}
							onValueChange={handleSubCategoryChange}
						>
							<SelectTrigger className="w-full h-14! px-5! disabled:hover:bg-input/30!">
								{loadingSubCategories ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<SelectValue />
								)}
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Subcategories</SelectLabel>
									{subCategories.map((subCategory) => (
										<SelectItem key={subCategory.id} value={subCategory.id}>
											{subCategory.name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<FormError error={errors.subCategory} />
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="space-y-3 group/input">
					<label className="block text-sm font-bold text-muted-foreground group-focus-within/input:text-primary transition-colors uppercase tracking-wider">
						Modelo de Precios <span className="text-destructive">*</span>
					</label>
					<div className="flex gap-2 p-1.5 bg-background/50 rounded-xl border border-white/10 h-14">
						{Object.values(PricingType).map((item) => (
							<button
								key={item}
								className={cn(
									"cursor-pointer flex-1 py-1 px-2 text-sm font-bold rounded-lg transition-all duration-300",
									pricing === item
										? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
										: "text-muted-foreground hover:bg-white/5",
								)}
								type="button"
								onClick={() => {
									setPricing(item);
									onPreviewUpdate();
								}}
							>
								{item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
							</button>
						))}
					</div>
					<FormError error={errors.pricing} />
				</div>

				<div className="space-y-3 group/input">
					<label className="block text-sm font-bold text-muted-foreground group-focus-within/input:text-primary transition-colors uppercase tracking-wider">
						Stack Tecnológico <span className="text-destructive">*</span>
					</label>
					<Combobox
						multiple
						autoHighlight
						items={TECH_STACK_OPTIONS}
						value={stack}
						onValueChange={(values) => {
							setStack((values as string[]) ?? []);
							onPreviewUpdate();
						}}
					>
						<ComboboxChips
							ref={anchor}
							className="w-full min-h-14 rounded-xl border-white/10 bg-background/50 px-3 py-2"
						>
							<ComboboxValue>
								{(values) => (
									<>
										{((values as string[]) ?? []).map((value: string) => (
											<ComboboxChip key={value}>{value}</ComboboxChip>
										))}
										<ComboboxChipsInput
											placeholder={stack.length === 0 ? "Busca tecnologías..." : "Añadir más..."}
										/>
									</>
								)}
							</ComboboxValue>
						</ComboboxChips>
						<ComboboxContent anchor={anchor}>
							<ComboboxEmpty>No se encontraron tecnologías</ComboboxEmpty>
							<ComboboxList>
								{(item) => (
									<ComboboxItem key={item} value={item}>
										{item}
									</ComboboxItem>
								)}
							</ComboboxList>
						</ComboboxContent>
					</Combobox>
					<FormError error={errors.stack} />
				</div>
			</div>

			<div className="space-y-3 group/input">
				<div className="flex justify-between items-end">
					<label
						className="block text-sm font-bold text-muted-foreground group-focus-within/input:text-primary transition-colors uppercase tracking-wider"
						htmlFor="description"
					>
						Descripción Corta
					</label>
					<span
						className={`text-[10px] font-mono uppercase tracking-widest ${
							descriptionLength >= 140 ? "text-amber-500" : "text-muted-foreground/50"
						}`}
					>
						{descriptionLength}/140
					</span>
				</div>
				<textarea
					className="block w-full rounded-xl border border-white/10 bg-background/50 text-foreground shadow-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/10 sm:text-sm p-5 placeholder:text-muted-foreground/30 resize-none transition-all outline-none font-sans leading-relaxed"
					id="description"
					name="description"
					placeholder="Describe la herramienta en pocas palabras..."
					rows={4}
					defaultValue={formState.data?.description ?? ""}
					maxLength={140}
					onChange={(e) => {
						setDescriptionLength(e.target.value.length);
						onPreviewUpdate();
					}}
				/>
				<FormError error={errors.description} />
			</div>

			<div className="flex flex-col sm:flex-row items-center justify-end gap-5">
				<Button
					type="button"
					variant="ghost"
					className="w-full sm:w-auto px-7 h-12 text-muted-foreground hover:text-foreground font-bold"
					onClick={onBack}
				>
					Atrás
				</Button>
				<Button
					type="button"
					className="w-full sm:w-auto px-7! h-12 font-bold group/button"
					onClick={handleNext}
				>
					Siguiente: Revisión
					<ArrowRight className="h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
				</Button>
			</div>
		</>
	);
}
