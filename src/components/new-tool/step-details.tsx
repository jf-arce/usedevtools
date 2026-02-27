import { ArrowRight, Loader2 } from "lucide-react";
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
import { useEffect, useState } from "react";
import { getCategories } from "@/actions/get-categories";
import { getSubCategories } from "@/actions/get-sub-categories";
import { PricingType } from "@prisma/client";

const TECH_STACK_OPTIONS = [
	"React",
	"Next.js",
	"Vue",
	"Nuxt",
	"Angular",
	"Svelte",
	"SvelteKit",
	"Astro",
	"Remix",
	"Node.js",
	"Express",
	"Fastify",
	"NestJS",
	"Django",
	"Flask",
	"FastAPI",
	"Ruby on Rails",
	"Laravel",
	"Spring Boot",
	"Go",
	"Rust",
	"Elixir",
	"Phoenix",
	"TypeScript",
	"JavaScript",
	"Python",
	"Java",
	"C#",
	".NET",
	"PHP",
	"PostgreSQL",
	"MySQL",
	"MongoDB",
	"Redis",
	"SQLite",
	"Supabase",
	"Firebase",
	"Prisma",
	"Drizzle",
	"Docker",
	"Kubernetes",
	"AWS",
	"Google Cloud",
	"Azure",
	"Vercel",
	"Netlify",
	"Cloudflare",
	"Tailwind CSS",
	"Sass",
	"Styled Components",
	"GraphQL",
	"tRPC",
	"REST API",
	"WebSocket",
	"Vite",
	"Webpack",
	"Turborepo",
	"Bun",
	"Deno",
] as const;

interface StepDetailsProps {
	formData: NewTool;
	onChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => void;
	onPricingChange: (value: PricingType) => void;
	onCategoryChange: (category: Category) => void;
	onSubCategoryChange: (subCategory: SubCategory) => void;
	onAddStack: (tag: string) => void;
	onRemoveStack: (tag: string) => void;
	onBack: () => void;
	onNext: () => void;
}

export function StepDetails({
	formData,
	onChange,
	onPricingChange,
	onCategoryChange,
	onSubCategoryChange,
	onAddStack,
	onRemoveStack,
	onBack,
	onNext,
}: StepDetailsProps) {
	const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
	const [subCategories, setSubCategories] = useState<{ id: string; name: string }[]>([]);
	const [loadingSubCategories, setLoadingSubCategories] = useState(false);

	useEffect(() => {
		const fetchCategories = async () => {
			const categories = await getCategories();
			setCategories(categories);
		};
		fetchCategories().then(async () => {
			if (formData.category) {
				setLoadingSubCategories(true);
				const subCategories = await getSubCategories(formData.category.id);
				setSubCategories(subCategories);
				setLoadingSubCategories(false);
			}
		});
	}, []);

	const handleCategoryChange = async (value: string) => {
		const selected = categories.find((c) => c.id === value);
		if (selected) onCategoryChange(selected);

		setLoadingSubCategories(true);
		const subCategories = await getSubCategories(value);
		setSubCategories(subCategories);
		setLoadingSubCategories(false);
	};

	const handleSubCategoryChange = (value: string) => {
		const selected = subCategories.find((s) => s.id === value);
		if (selected) onSubCategoryChange(selected);
	};

	const anchor = useComboboxAnchor();

	return (
		<form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="space-y-3 group/input">
					<label className="block text-sm font-bold text-muted-foreground group-focus-within/input:text-primary transition-colors uppercase tracking-wider">
						Categoría
					</label>
					<div className="relative">
						<Select required value={formData.category.id} onValueChange={handleCategoryChange}>
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
				</div>

				<div className="space-y-3 group/input">
					<label
						className={cn(
							"block text-sm font-bold text-muted-foreground group-focus-within/input:text-primary transition-colors uppercase tracking-wider",
							subCategories.length === 0 && "opacity-50",
						)}
					>
						Subcategoría
					</label>
					<div className="relative">
						<Select
							disabled={subCategories.length === 0}
							value={formData.subCategory.id}
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
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="space-y-3 group/input">
					<label className="block text-sm font-bold text-muted-foreground group-focus-within/input:text-primary transition-colors uppercase tracking-wider">
						Modelo de Precios
					</label>
					<div className="flex gap-2 p-1.5 bg-background/50 rounded-xl border border-white/10 h-14">
						{Object.values(PricingType).map((item) => (
							<button
								key={item}
								className={cn(
									"cursor-pointer flex-1 py-1 px-2 text-sm font-bold rounded-lg transition-all duration-300",
									formData.pricing === item
										? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
										: "text-muted-foreground hover:bg-white/5",
								)}
								type="button"
								onClick={() => onPricingChange(item)}
							>
								{item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
							</button>
						))}
					</div>
				</div>

				<div className="space-y-3 group/input">
					<label className="block text-sm font-bold text-muted-foreground group-focus-within/input:text-primary transition-colors uppercase tracking-wider">
						Stack Tecnológico
					</label>
					<Combobox
						multiple
						autoHighlight
						items={TECH_STACK_OPTIONS}
						value={formData.stack}
						onValueChange={(values) => {
							if (!values) return;
							const added = (values as string[]).filter((v) => !formData.stack.includes(v));
							const removed = formData.stack.filter((v) => !(values as string[]).includes(v));
							added.forEach((tag) => onAddStack(tag));
							removed.forEach((tag) => onRemoveStack(tag));
						}}
					>
						<ComboboxChips
							ref={anchor}
							className="w-full min-h-14 rounded-xl border-white/10 bg-background/50 px-3 py-2"
						>
							<ComboboxValue>
								{(values) => (
									<>
										{(values as string[]).map((value: string) => (
											<ComboboxChip key={value}>{value}</ComboboxChip>
										))}
										<ComboboxChipsInput
											placeholder={
												formData.stack.length === 0 ? "Busca tecnologías..." : "Añadir más..."
											}
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
					<span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">
						{formData.description.length}/140
					</span>
				</div>
				<textarea
					className="block w-full rounded-xl border border-white/10 bg-background/50 text-foreground shadow-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/10 sm:text-sm p-5 placeholder:text-muted-foreground/30 resize-none transition-all outline-none font-sans leading-relaxed"
					id="description"
					placeholder="Describe la herramienta en pocas palabras..."
					rows={4}
					value={formData.description}
					onChange={onChange}
				/>
			</div>

			<div className="flex flex-col sm:flex-row items-center justify-end gap-5">
				<Button
					variant="ghost"
					className="w-full sm:w-auto px-7 h-12 text-muted-foreground hover:text-foreground font-bold"
					onClick={onBack}
				>
					Atrás
				</Button>
				<Button className="w-full sm:w-auto px-7! h-12 font-bold group/button" onClick={onNext}>
					Siguiente: Revisión
					<ArrowRight className="h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
				</Button>
			</div>
		</form>
	);
}
