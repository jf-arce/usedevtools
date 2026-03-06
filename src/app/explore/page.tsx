import {
	getTools,
	getCategoriesWithCounts,
	getTotalToolsCount,
	getAllTechnologies,
} from "@/data/get-tools";
import { ToolCard } from "@/components/explore/tool-card";
import { ExploreSearch } from "@/components/explore/explore-search";
import { ExploreSidebar } from "@/components/explore/explore-sidebar";
import { NoToolsFound } from "@/components/explore/no-tools-found";

import { SortTabsCount } from "@/components/explore/sort-tabs-count";
import { ExplorePagination } from "@/components/explore/explore-pagination";
import { ScrollableCards } from "@/components/explore/scrollable-cards";

interface ExplorePageProps {
	searchParams: Promise<{
		q?: string;
		category?: string;
		subCategory?: string;
		pricing?: string;
		sort?: string;
		stack?: string | string[];
		page?: string;
	}>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
	const params = await searchParams;
	const { q, category, subCategory, pricing, sort, page } = params;
	const stack = params.stack
		? Array.isArray(params.stack)
			? params.stack
			: [params.stack]
		: undefined;
	const currentPage = Number(page) || 1;
	const pageSize = 12;
	const skip = (currentPage - 1) * pageSize;

	const [toolsData, categoriesWithCounts, totalToolsCount, technologies] = await Promise.all([
		getTools({
			query: q,
			category,
			subCategory,
			pricing,
			sort,
			stack,
			limit: pageSize,
			skip,
		}),
		getCategoriesWithCounts(),
		getTotalToolsCount(),
		getAllTechnologies(),
	]);

	const { tools, total } = toolsData;

	return (
		<div className="flex container mx-auto h-[calc(100vh-4rem)] overflow-hidden">
			<ExploreSidebar
				categories={categoriesWithCounts}
				totalTools={totalToolsCount}
				technologies={technologies}
			/>

			<main className="flex-1 min-w-0 bg-background flex flex-col">
				<div className="mx-auto px-6 py-4 gap-6 flex flex-col flex-1 min-h-0 w-full">
					<ExploreSearch />

					<ScrollableCards
						header={<SortTabsCount totalTools={total} />}
						fillContent={tools.length === 0}
					>
						{tools.length > 0 ? (
							<>
								<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
									{tools.map((tool) => (
										<ToolCard key={tool.id} tool={tool as any} />
									))}
								</div>

								<ExplorePagination
									pagination={{ currentPage, total, pageSize }}
									filters={{ q, category, subCategory, pricing, sort }}
								/>
							</>
						) : (
							<NoToolsFound />
						)}
					</ScrollableCards>
				</div>
			</main>
		</div>
	);
}
