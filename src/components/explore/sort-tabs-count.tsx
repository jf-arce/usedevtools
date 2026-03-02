"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { Star, Clock, ArrowDownAZ } from "lucide-react";

const SORT_OPTIONS = [
	{ value: "votes", label: "Most Rated", icon: Star },
	{ value: "newest", label: "Newest", icon: Clock },
	{ value: "alphabetical", label: "Alphabetical", icon: ArrowDownAZ },
];

export const SortTabsCount = ({ totalTools }: { totalTools: number }) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const currentSort = searchParams.get("sort") || "";

	const handleSortChange = (sort: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (currentSort === sort) {
			params.delete("sort");
		} else {
			params.set("sort", sort);
		}
		params.delete("page");
		const query = params.toString();
		router.push(`/explore${query ? `?${query}` : ""}`);
	};

	return (
		<>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1.5">
					{SORT_OPTIONS.map((option) => {
						const Icon = option.icon;
						return (
							<Button
								key={option.value}
								onClick={() => handleSortChange(option.value)}
								variant={currentSort === option.value ? "outline" : "ghost"}
								size="icon"
								title={option.label}
							>
								<Icon className="h-4 w-4" />
							</Button>
						);
					})}
				</div>
				<p className="text-sm text-zinc-500">
					Showing <span className="font-bold text-white">{totalTools} tools</span>
				</p>
			</div>
		</>
	);
};
