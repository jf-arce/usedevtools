"use client";
import { ChevronRight, Search } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export const HeroSearch = () => {
	const router = useRouter();

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);

		const query = formData.get("search")?.toString().trim();

		if (query) {
			router.push(`/explore?q=${encodeURIComponent(query)}`);
		} else {
			router.push("/explore");
		}
	};

	return (
		<form className="flex items-center gap-2" onSubmit={handleSearch}>
			<div className="relative flex-1 group">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<input
					type="text"
					name="search"
					placeholder="Search tools..."
					className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition-all"
				/>
			</div>
			<Button type="submit" className="h-11 px-5 rounded-lg font-semibold shrink-0">
				Explore
				<ChevronRight className="h-4 w-4 ml-1" />
			</Button>
		</form>
	);
};
