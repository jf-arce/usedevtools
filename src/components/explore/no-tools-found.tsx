"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export function NoToolsFound() {
	const router = useRouter();

	return (
		<div className="flex flex-col items-center justify-center flex-1 min-h-0 space-y-4 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
			<Search className="h-12 w-12 text-zinc-700" />
			<p className="text-zinc-500 font-medium">No tools found matching your criteria</p>
			<button
				onClick={() => router.push("/explore")}
				className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold uppercase tracking-widest transition-colors cursor-pointer"
			>
				Clear all filters
			</button>
		</div>
	);
}
