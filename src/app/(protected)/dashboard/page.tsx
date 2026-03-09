import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Heart, UploadCloud, Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DashboardClient } from "./dashboard-client";
import { getTools } from "@/data/get-tools";
import { ExplorePagination } from "@/components/explore/explore-pagination";

interface DashboardPageProps {
	searchParams: Promise<{
		tab?: string;
		q?: string;
		category?: string;
		subCategory?: string;
		stack?: string | string[];
		page?: string;
	}>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) redirect("/");

	const userId = session.user.id;
	const params = await searchParams;

	const currentTab = params.tab === "uploads" ? "uploads" : "favorites";
	const { q, category, subCategory, page } = params;
	const stack = params.stack
		? Array.isArray(params.stack)
			? params.stack
			: [params.stack]
		: undefined;

	const currentPage = Number(page) || 1;
	const pageSize = 12;
	const skip = (currentPage - 1) * pageSize;

	// Fetch base stats and lists in parallel
	const [favoritesCount, uploadsCount, categories, technologies, toolsForVotes] = await Promise.all(
		[
			db.favorite.count({ where: { userId } }),
			db.tool.count({ where: { userId } }),
			db.category.findMany({
				orderBy: { name: "asc" },
				include: { subCategories: { select: { id: true, name: true }, orderBy: { name: "asc" } } },
			}),
			db.technology.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
			db.tool.findMany({ where: { userId }, select: { votes: true } }),
		],
	);

	const totalVotesReceived = toolsForVotes.reduce((acc, tool) => acc + tool.votes, 0);

	// Fetch server-side filtered tools for the active tab
	const { tools, total } = await getTools({
		query: q,
		category,
		subCategory,
		stack,
		limit: pageSize,
		skip,
		favoritesUserId: currentTab === "favorites" ? userId : undefined,
		uploadedByUserId: currentTab === "uploads" ? userId : undefined,
	});

	return (
		<main className="py-8 space-y-8 container mx-auto px-4">
			{/* Top Bar Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
					<p className="text-muted-foreground mt-1">
						Quickly access your favorite tools or manage those you contributed.
					</p>
				</div>
				<Button asChild className="shrink-0 group">
					<Link href="/new-tool">
						<PlusCircle className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
						Submit a Tool
					</Link>
				</Button>
			</div>

			{/* Stats Overview */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card className="bg-linear-to-br from-card to-card/50 overflow-hidden relative">
					<div className="absolute -right-4 -bottom-4 opacity-5">
						<Heart className="w-32 h-32" />
					</div>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
						<CardTitle className="text-sm font-medium">Saved Favorites</CardTitle>
						<Heart className="h-4 w-4 text-rose-500" />
					</CardHeader>
					<CardContent className="relative z-10">
						<div className="text-3xl font-bold">{favoritesCount}</div>
						<p className="text-xs text-muted-foreground mt-1">Tools for quick search</p>
					</CardContent>
				</Card>

				<Card className="bg-linear-to-br from-card to-card/50 overflow-hidden relative">
					<div className="absolute -right-4 -bottom-4 opacity-5">
						<UploadCloud className="w-32 h-32" />
					</div>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
						<CardTitle className="text-sm font-medium">My Tools</CardTitle>
						<UploadCloud className="h-4 w-4 text-blue-500" />
					</CardHeader>
					<CardContent className="relative z-10">
						<div className="text-3xl font-bold">{uploadsCount}</div>
						<p className="text-xs text-muted-foreground mt-1">Contributions to the community</p>
					</CardContent>
				</Card>

				<Card className="bg-linear-to-br from-card to-card/50 overflow-hidden relative">
					<div className="absolute -right-4 -bottom-4 opacity-5">
						<Star className="w-32 h-32" />
					</div>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
						<CardTitle className="text-sm font-medium">Votes Received</CardTitle>
						<Star className="h-4 w-4 text-yellow-500 border-yellow-500" fill="currentColor" />
					</CardHeader>
					<CardContent className="relative z-10">
						<div className="text-3xl font-bold">{totalVotesReceived}</div>
						<p className="text-xs text-muted-foreground mt-1">Total likes on your contributions</p>
					</CardContent>
				</Card>
			</div>

			{/* Interactive Client Section with Tabs and Filters */}
			<div className="space-y-6">
				<DashboardClient
					currentTab={currentTab}
					favoritesCount={favoritesCount}
					uploadsCount={uploadsCount}
					categories={categories}
					technologies={technologies}
					tools={tools}
				/>

				{tools.length > 0 && (
					<ExplorePagination
						basePath="/dashboard"
						pagination={{ currentPage, total, pageSize }}
						filters={{ q, category, subCategory }}
					/>
				)}
			</div>
		</main>
	);
}
