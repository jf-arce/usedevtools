"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Command } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ExploreSearch() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [search, setSearch] = useState(searchParams.get("q") || "");

	useEffect(() => {
		const params = new URLSearchParams(searchParams.toString());

		if (search) {
			params.set("q", search);
		} else {
			params.delete("q");
		}

		// Reset page when searching
		params.delete("page");

		const query = params.toString();
		const url = `/explore${query ? `?${query}` : ""}`;

		const timer = setTimeout(() => {
			router.push(url);
		}, 400);

		return () => clearTimeout(timer);
	}, [search]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="flex flex-col gap-5 w-full">
			{/* Search Bar */}
			<div className="relative w-full group">
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 z-10" />
				<Input
					type="text"
					placeholder="Search for tools, frameworks, and libraries..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full pl-11 pr-16 h-12 text-sm"
				/>
				{/* <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800/80 border border-zinc-700/50 text-zinc-500">
					<Command className="h-3 w-3" />
					<span className="text-[10px] font-medium">K</span>
				</div> */}
			</div>
		</div>
	);
}
