"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Combobox,
	ComboboxChips,
	ComboboxChip,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxList,
	ComboboxItem,
	ComboboxEmpty,
	ComboboxCollection,
	useComboboxAnchor,
} from "@/components/ui/combobox";

interface SubCategoryWithCount {
	id: string;
	name: string;
	_count: { tools: number };
}

interface CategoryWithCount {
	id: string;
	name: string;
	_count: { tools: number };
	subCategories: SubCategoryWithCount[];
}

interface ExploreSidebarProps {
	categories: CategoryWithCount[];
	totalTools: number;
	technologies: { id: string; name: string }[];
}

export function ExploreSidebar({ categories, totalTools, technologies }: ExploreSidebarProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const anchorRef = useComboboxAnchor();

	const activeCategory = searchParams.get("category") || "";
	const activeSubCategory = searchParams.get("subCategory") || "";
	const activeTechStack = searchParams.getAll("stack");

	// Get subcategories for the selected category
	const activeSubCategories = useMemo(() => {
		if (!activeCategory) return [];
		const cat = categories.find((c) => c.name === activeCategory);
		return cat?.subCategories ?? [];
	}, [activeCategory, categories]);

	const buildUrl = (overrides: Record<string, string | string[] | undefined>) => {
		const params = new URLSearchParams();

		const current = {
			q: searchParams.get("q") || undefined,
			category: searchParams.get("category") || undefined,
			subCategory: searchParams.get("subCategory") || undefined,
			sort: searchParams.get("sort") || undefined,
			pricing: searchParams.get("pricing") || undefined,
			stack: searchParams.getAll("stack"),
		};

		const merged = { ...current, ...overrides };

		if (merged.q) params.set("q", merged.q as string);
		if (merged.category) params.set("category", merged.category as string);
		if (merged.subCategory) params.set("subCategory", merged.subCategory as string);
		if (merged.sort) params.set("sort", merged.sort as string);
		if (merged.pricing) params.set("pricing", merged.pricing as string);
		if (Array.isArray(merged.stack)) {
			merged.stack.forEach((s) => params.append("stack", s));
		}

		const query = params.toString();
		return `/explore${query ? `?${query}` : ""}`;
	};

	const handleCategoryChange = (value: string) => {
		if (value === "__all__") {
			router.push(buildUrl({ category: undefined, subCategory: undefined }));
		} else {
			router.push(buildUrl({ category: value, subCategory: undefined }));
		}
	};

	const handleSubCategoryChange = (value: string) => {
		if (value === "__all__") {
			router.push(buildUrl({ subCategory: undefined }));
		} else {
			router.push(buildUrl({ subCategory: value }));
		}
	};

	const handleTechStackChange = (newStack: string[]) => {
		router.push(buildUrl({ stack: newStack }));
	};

	return (
		<aside className="w-64 shrink-0 hidden lg:flex flex-col h-[calc(100vh-4rem)] sticky top-16">
			<div className="flex flex-col h-full overflow-hidden">
				<div className="flex-1 overflow-y-auto px-3 pt-4 pb-4 space-y-5">
					<div className="space-y-2">
						<p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold px-1">
							Category
						</p>
						<Select value={activeCategory || "__all__"} onValueChange={handleCategoryChange}>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="__all__">All Categories ({totalTools})</SelectItem>
								{categories.map((cat) => (
									<SelectItem key={cat.id} value={cat.name}>
										{cat.name} ({cat._count.tools})
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{activeCategory && activeSubCategories.length > 0 && (
						<div className="space-y-2">
							<p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold px-1">
								Subcategory
							</p>
							<Select
								value={activeSubCategory || "__all__"}
								onValueChange={handleSubCategoryChange}
							>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="__all__">All Subcategories</SelectItem>
									{activeSubCategories.map((sub) => (
										<SelectItem key={sub.id} value={sub.name}>
											{sub.name} ({sub._count.tools})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}

					<div className="space-y-2">
						<p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold px-1">
							Tech Stack
						</p>
						<Combobox
							value={activeTechStack}
							onValueChange={handleTechStackChange}
							multiple
							items={technologies.map((t) => t.name)}
						>
							<ComboboxChips ref={anchorRef}>
								{activeTechStack.map((tech) => (
									<ComboboxChip key={tech}>{tech}</ComboboxChip>
								))}
								<ComboboxChipsInput placeholder="Search tech..." />
							</ComboboxChips>
							<ComboboxContent anchor={anchorRef}>
								<ComboboxList>
									<ComboboxCollection>
										{(item) => (
											<ComboboxItem key={item} value={item}>
												{item}
											</ComboboxItem>
										)}
									</ComboboxCollection>
								</ComboboxList>
								<ComboboxEmpty>No technologies found</ComboboxEmpty>
							</ComboboxContent>
						</Combobox>
					</div>
				</div>
			</div>
		</aside>
	);
}
