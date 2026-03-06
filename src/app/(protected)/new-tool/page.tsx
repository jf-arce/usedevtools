import { NewToolForm } from "@/components/new-tool/new-tool-form";
import { getCategories } from "@/data/get-categories";

export default async function NewToolPage() {
	const categories = await getCategories();

	return (
		<main className="min-h-screen bg-background text-foreground antialiased relative overflow-hidden font-sans">
			<div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl relative z-10">
				<NewToolForm categories={categories} />
			</div>
		</main>
	);
}
