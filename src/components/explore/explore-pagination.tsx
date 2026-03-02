import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExplorePaginationProps {
	pagination: {
		currentPage: number;
		total: number;
		pageSize: number;
	};
	filters: {
		q?: string;
		category?: string;
		subCategory?: string;
		pricing?: string;
		sort?: string;
	};
}

export const ExplorePagination = ({ pagination, filters }: ExplorePaginationProps) => {
	const { currentPage, total, pageSize } = pagination;
	const { q, category, subCategory, pricing, sort } = filters;

	return (
		<>
			{total > pageSize && (
				<div className="flex justify-center items-center gap-4 pt-8 pb-4">
					<a
						href={
							currentPage > 1
								? `/explore?${new URLSearchParams({
										...(q ? { q } : {}),
										...(category ? { category } : {}),
										...(subCategory ? { subCategory } : {}),
										...(pricing ? { pricing } : {}),
										...(sort ? { sort } : {}),
										page: String(currentPage - 1),
									}).toString()}`
								: "#"
						}
						className={cn(
							buttonVariants({ variant: "outline", size: "sm" }),
							currentPage === 1 && "opacity-30 pointer-events-none",
						)}
					>
						Previous
					</a>
					<span className="text-sm text-zinc-500 font-medium">
						Page {currentPage} of {Math.ceil(total / pageSize)}
					</span>
					<a
						href={
							currentPage * pageSize < total
								? `/explore?${new URLSearchParams({
										...(q ? { q } : {}),
										...(category ? { category } : {}),
										...(subCategory ? { subCategory } : {}),
										...(pricing ? { pricing } : {}),
										...(sort ? { sort } : {}),
										page: String(currentPage + 1),
									}).toString()}`
								: "#"
						}
						className={cn(
							buttonVariants({ variant: "outline", size: "sm" }),
							currentPage * pageSize >= total && "opacity-30 pointer-events-none",
						)}
					>
						Next
					</a>
				</div>
			)}
		</>
	);
};
