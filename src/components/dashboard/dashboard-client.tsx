"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bookmark, UploadCloud, SlidersHorizontal } from "lucide-react";
import { ToolCard } from "@/components/explore/tool-card";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type ToolType = any;

export function DashboardClient({
	currentTab,
	favoritesCount,
	uploadsCount,
	categories,
	technologies,
	tools,
}: {
	currentTab: "favorites" | "uploads";
	favoritesCount: number;
	uploadsCount: number;
	categories: { id: string; name: string; subCategories?: { id: string; name: string }[] }[];
	technologies: { id: string; name: string }[];
	tools: ToolType[];
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

	const activeCategory = searchParams.get("category") || "all";
	const activeSubCategory = searchParams.get("subCategory") || "all";
	const activeTechStack = searchParams.getAll("stack") || [];

	const anchorRef = useComboboxAnchor();

	// Handlers for URL updates
	const buildUrl = (overrides: Record<string, string | string[] | undefined>) => {
		const params = new URLSearchParams(searchParams.toString());

		// Reset page on filter changes (if not explicitly modifying page)
		if (Object.keys(overrides).some((k) => k !== "page" && k !== "tab")) {
			params.delete("page");
		}

		Object.entries(overrides).forEach(([key, value]) => {
			if (value === undefined || value === "all" || value === "") {
				params.delete(key);
			} else if (Array.isArray(value)) {
				params.delete(key);
				value.forEach((v) => params.append(key, v));
			} else {
				params.set(key, value);
			}
		});

		const query = params.toString();
		return `${pathname}${query ? `?${query}` : ""}`;
	};

	// Debounce search query
	useEffect(() => {
		const timer = setTimeout(() => {
			if (searchQuery !== (searchParams.get("q") || "")) {
				startTransition(() => {
					router.push(buildUrl({ q: searchQuery }));
				});
			}
		}, 400);
		return () => clearTimeout(timer);
	}, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

	const activeSubCategories = useMemo(() => {
		if (activeCategory === "all") return [];
		const cat = categories.find((c) => c.name === activeCategory);
		return cat?.subCategories ?? [];
	}, [activeCategory, categories]);

	return (
		<div className="space-y-6">
			{/* URL-controlled Tabs */}
			<Tabs
				value={currentTab}
				onValueChange={(val) => {
					setSearchQuery(""); // clear local state too
					// Clear filters safely, keep only the tab
					startTransition(() => {
						router.push(`${pathname}?tab=${val}`);
					});
				}}
				className="w-full"
			>
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
					<div className="flex-1 w-full max-w-sm">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search by name..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>
					</div>

					<TabsList className="shrink-0">
						<TabsTrigger value="favorites">
							<Bookmark className="w-4 h-4 mr-2 text-white" />
							Favorites ({favoritesCount})
						</TabsTrigger>
						<TabsTrigger value="uploads">
							<UploadCloud className="w-4 h-4 mr-2" />
							My Tools ({uploadsCount})
						</TabsTrigger>
					</TabsList>
				</div>

				{/* Filters Area */}
				<div className="flex flex-col md:flex-row gap-3 items-center mb-6 p-3 rounded-lg border">
					<div className="w-full md:w-auto overflow-hidden">
						<Select
							value={activeCategory}
							onValueChange={(val) => {
								startTransition(() => {
									router.push(buildUrl({ category: val, subCategory: undefined }));
								});
							}}
						>
							<SelectTrigger className="w-full md:w-48">
								<SlidersHorizontal className="w-4 h-4 mr-2 text-muted-foreground" />
								<SelectValue placeholder="Category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All categories</SelectItem>
								{categories.map((cat) => (
									<SelectItem key={cat.id} value={cat.name}>
										{cat.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{activeSubCategories.length > 0 && (
						<div className="w-full md:w-auto animate-in slide-in-from-left-2 opacity-100">
							<Select
								value={activeSubCategory}
								onValueChange={(val) => {
									startTransition(() => {
										router.push(buildUrl({ subCategory: val }));
									});
								}}
							>
								<SelectTrigger className="w-full md:w-48">
									<SelectValue placeholder="Subcategory" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All subcategories</SelectItem>
									{activeSubCategories.map((sub) => (
										<SelectItem key={sub.id} value={sub.name}>
											{sub.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}

					{technologies && technologies.length > 0 && (
						<div className="w-full md:flex-1 max-w-sm">
							<Combobox
								value={activeTechStack}
								onValueChange={(val) => {
									startTransition(() => {
										router.push(buildUrl({ stack: val }));
									});
								}}
								multiple
								items={technologies.map((t) => t.name)}
							>
								<ComboboxChips ref={anchorRef}>
									{activeTechStack.map((tech) => (
										<ComboboxChip key={tech}>{tech}</ComboboxChip>
									))}
									<ComboboxChipsInput placeholder="Filter by stack..." />
								</ComboboxChips>
								<ComboboxContent anchor={anchorRef} className="z-50">
									<ComboboxList>
										<ComboboxCollection>
											{(item) => (
												<ComboboxItem key={item as string} value={item as string}>
													{item}
												</ComboboxItem>
											)}
										</ComboboxCollection>
									</ComboboxList>
									<ComboboxEmpty>No technology found</ComboboxEmpty>
								</ComboboxContent>
							</Combobox>
						</div>
					)}

					{(activeCategory !== "all" || activeTechStack.length > 0) && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								startTransition(() => {
									router.push(`${pathname}?tab=${currentTab}`);
								});
								setSearchQuery("");
							}}
							className="text-xs text-muted-foreground"
						>
							Clear filters
						</Button>
					)}
				</div>
			</Tabs>

			{/* Server-Side Rendered Content Area */}
			{isPending ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 focus-visible:outline-none">
					{[...Array(4)].map((_, i) => (
						<Card
							key={i}
							className="py-1! relative overflow-hidden border-neutral-800 bg-neutral-900/50 flex flex-col h-full min-h-72.5"
						>
							<CardHeader className="p-6 pb-0">
								<div className="flex items-start justify-between">
									<Skeleton className="h-14 w-14 rounded-xl" />
									<Skeleton className="h-9 w-9 rounded-lg" />
								</div>
								<div className="mt-4 flex flex-col gap-2">
									<Skeleton className="h-7 w-3/4" />
									<Skeleton className="h-5 w-16 rounded-full mt-1" />
								</div>
							</CardHeader>
							<CardContent className="p-6 pt-2 grow flex flex-col justify-end">
								<div className="space-y-2 mt-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-5/6" />
								</div>
							</CardContent>
							<CardFooter className="flex items-center justify-between p-6 pt-0 mt-auto">
								<div className="flex items-center gap-2">
									<Skeleton className="h-9 w-10 rounded-md" />
									<Skeleton className="h-9 w-14 rounded-md" />
								</div>
								<Skeleton className="h-4 w-16" />
							</CardFooter>
						</Card>
					))}
				</div>
			) : tools.length === 0 ? (
				<Card className="border-dashed bg-transparent shadow-none">
					<CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground h-64">
						{currentTab === "favorites" ? (
							<Bookmark className="h-10 w-10 mb-4 opacity-20 text-white" />
						) : (
							<UploadCloud className="h-10 w-10 mb-4 opacity-20" />
						)}
						<h3 className="text-lg font-medium text-foreground mb-1">No matches found</h3>
						<p className="text-sm">
							{currentTab === "favorites"
								? "No favorite tools found with these filters."
								: "You haven't uploaded any tools yet, or none match your search."}
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 focus-visible:outline-none">
					{tools.map((tool) => (
						<div key={tool.id} className="relative group">
							<ToolCard tool={tool as any} />
							{currentTab === "uploads" && (
								<div className="absolute top-3 right-3 flex items-center gap-2 z-10">
									<span
										className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tool.published ? "bg-emerald-500 text-white shadow-sm" : "bg-amber-500 text-white shadow-sm"}`}
									>
										{tool.published ? "Public" : "In Review"}
									</span>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
