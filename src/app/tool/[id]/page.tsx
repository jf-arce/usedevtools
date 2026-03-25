import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ToolHeader } from "./tool-header";
import { RecentReleases } from "./recent-releases";
import { CommunityLinks } from "./community-links";
import { ChevronRight, Star, GitFork, AlertCircle, BookOpen, Download, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { getGithubStats } from "@/lib/get-github-stats";

interface ToolPageProps {
	params: Promise<{ id: string }>;
}

export default async function ToolPage({ params }: ToolPageProps) {
	const { id } = await params;

	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const userId = session?.user?.id;

	const tool = await db.tool.findUnique({
		where: { id },
		include: {
			category: true,
			subCategory: true,
			stack: true,
			favorites: userId ? { where: { userId } } : false,
			voteItems: userId ? { where: { userId } } : false,
		},
	});

	if (!tool || !tool.published) {
		return notFound();
	}

	const hasVoted = userId ? tool.voteItems.length > 0 : false;
	const isFavorite = userId ? tool.favorites.length > 0 : false;

	// fetch alternatives
	const stackIds = tool.stack.map((s) => s.id);

	const alternativesRaw = await db.tool.findMany({
		where: {
			id: { not: tool.id },
			categoryId: tool.categoryId,
			subCategoryId: tool.subCategoryId,
			...(stackIds.length > 0 ? { stack: { some: { id: { in: stackIds } } } } : {}),
			published: true,
		},
		take: 3,
		orderBy: {
			votes: "desc",
		},
	});

	const alternatives = alternativesRaw;

	const githubStats = await getGithubStats(tool.url);

	return (
		<main className="grow w-full container mx-auto px-4 py-8 animate-in fade-in duration-500">
			{/* Breadcrumbs */}
			<nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
				<Link href="/" className="hover:text-white transition-colors">
					Home
				</Link>
				<ChevronRight className="h-4 w-4" />
				<Link
					href={`/?category=${tool.category.name}`}
					className="hover:text-white transition-colors capitalize"
				>
					{tool.category.name}
				</Link>
				<ChevronRight className="h-4 w-4" />
				<span className="text-white font-medium">{tool.title}</span>
			</nav>

			{/* Hero Header */}
			<ToolHeader
				tool={{
					id: tool.id,
					title: tool.title,
					description: tool.description,
					url: tool.url,
					pricing: tool.pricing,
					votes: tool.votes,
					category: tool.category.name,
					subCategory: tool.subCategory.name,
				}}
				initialHasVoted={hasVoted}
				initialIsFavorite={isFavorite}
				repoUrl={githubStats?.repoUrl}
			/>

			{/* Main Content Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
				{/* Left Column: Description & Reviews */}
				<div className="lg:col-span-2 space-y-8">
					{/* Detailed Info */}
					<div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8">
						<h2 className="text-xl font-bold text-white mb-4">About {tool.title}</h2>
						<div className="prose prose-invert prose-slate max-w-none text-neutral-400 space-y-4">
							<p className="leading-relaxed">
								{tool.description ||
									`This is the details page for ${tool.title}. Here you can find more information about its features and integrations.`}
							</p>
						</div>
					</div>

					{githubStats && (
						<CommunityLinks
							docsUrl={githubStats.docsUrl}
							installUrl={githubStats.installUrl}
							discussionsUrl={
								githubStats.hasDiscussions
									? `${githubStats.repoUrl}/discussions`
									: undefined
							}
							wikiUrl={
								githubStats.hasWiki
									? `${githubStats.repoUrl}/wiki`
									: undefined
							}
						/>
					)}

					<RecentReleases releases={githubStats?.releases} />
				</div>

				{/* Right Column: Sidebar Metadata */}
				<div className="space-y-6">
					{/* Tool Info Card */}
					<div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
						<div>
							<h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
								Stats
							</h3>

							<div className="flex items-center justify-between py-2 border-b border-neutral-800/50">
								<span className="text-sm text-neutral-400">Pricing</span>
								<span
									className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset uppercase tracking-wider ${
										tool.pricing === "FREE"
											? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
											: tool.pricing === "FREEMIUM"
												? "bg-amber-500/10 text-amber-400 ring-amber-500/20"
												: "bg-rose-500/10 text-rose-400 ring-rose-500/20"
									}`}
								>
									{tool.pricing.toLowerCase()}
								</span>
							</div>

{githubStats && (
								<>
									<div className="flex items-center justify-between py-2 border-b border-neutral-800/50">
										<span className="text-sm text-neutral-400">Stars</span>
										<div className="flex items-center gap-1 text-sm font-medium text-white">
											<Star className="h-4 w-4 text-yellow-500 fill-yellow-500/20" />
											{githubStats.stars >= 1000
												? (githubStats.stars / 1000).toFixed(1) + "k"
												: githubStats.stars}
										</div>
									</div>
									<div className="flex items-center justify-between py-2 border-b border-neutral-800/50">
										<span className="text-sm text-neutral-400">Forks</span>
										<div className="flex items-center gap-1 text-sm font-medium text-white">
											<GitFork className="h-4 w-4 text-neutral-400" />
											{githubStats.forks >= 1000
												? (githubStats.forks / 1000).toFixed(1) + "k"
												: githubStats.forks}
										</div>
									</div>
									<div className="flex items-center justify-between py-2 border-b border-neutral-800/50">
										<span className="text-sm text-neutral-400">Issues</span>
										<div className="flex items-center gap-1 text-sm font-medium text-white">
											<AlertCircle className="h-4 w-4 text-neutral-400" />
											{githubStats.openIssues >= 1000
												? (githubStats.openIssues / 1000).toFixed(1) + "k"
												: githubStats.openIssues}
										</div>
									</div>
									{githubStats.npmDownloads && (
										<div className="flex items-center justify-between py-2 border-b border-neutral-800/50">
											<span className="text-sm text-neutral-400">NPM Weekly</span>
											<div className="flex items-center gap-1.5 text-sm font-medium text-white">
												<Download className="h-4 w-4 text-indigo-400" />
												{githubStats.npmDownloads >= 1000000
													? (githubStats.npmDownloads / 1000000).toFixed(1) + "M"
													: githubStats.npmDownloads >= 1000
														? (githubStats.npmDownloads / 1000).toFixed(1) + "k"
														: githubStats.npmDownloads}
												{githubStats.npmTrend !== undefined && (
													<span
														className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${
															githubStats.npmTrend > 0
																? "text-emerald-400"
																: "text-rose-400"
														}`}
													>
														{githubStats.npmTrend > 0 ? (
															<TrendingUp className="h-3 w-3" />
														) : (
															<TrendingDown className="h-3 w-3" />
														)}
														{Math.abs(githubStats.npmTrend)}%
													</span>
												)}
											</div>
										</div>
									)}
									{githubStats.license && (
										<div className="flex items-center justify-between py-2 border-b border-neutral-800/50">
											<span className="text-sm text-neutral-400">License</span>
											<div className="flex items-center gap-1 text-sm font-medium text-white">
												<BookOpen className="h-4 w-4 text-neutral-400" />
												<span className="max-w-30 truncate" title={githubStats.license}>
													{githubStats.license}
												</span>
											</div>
										</div>
									)}
								</>
							)}

							<div className="flex items-center justify-between py-2">
								<span className="text-sm text-neutral-400">Released</span>
								<span className="text-sm font-medium text-white">
									{new Intl.DateTimeFormat("en-US", {
										month: "short",
										year: "numeric",
									}).format(
										new Date(githubStats?.createdAt ? githubStats.createdAt : tool.createdAt),
									)}
								</span>
							</div>
						</div>

						{tool.stack.length > 0 && (
							<div className="mt-6">
								<h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
									Technologies
								</h3>
								<div className="flex flex-wrap gap-2">
									{tool.stack.map((tech) => (
										<span
											key={tech.id}
											className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20"
										>
											{tech.name}
										</span>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Alternatives */}
					{alternatives.length > 0 && (
						<div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-sm font-semibold text-white">Alternatives</h3>
							</div>
							<div className="space-y-4">
								{alternatives.map((alt) => {
									const altLetter = alt.title.charAt(0).toUpperCase();
									return (
										<Link
											key={alt.id}
											href={`/tool/${alt.id}`}
											className="flex items-start gap-3 group"
										>
											<div className="h-10 w-10 rounded-lg bg-neutral-800/80 flex items-center justify-center text-white font-bold text-lg shrink-0 group-hover:scale-105 transition-transform duration-300 ring-1 ring-inset ring-neutral-700/50">
												{altLetter}
											</div>
											<div className="min-w-0 flex-1">
												<div className="flex items-center justify-between">
													<h4 className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors truncate">
														{alt.title}
													</h4>
													<span className="text-[10px] text-neutral-400 bg-neutral-800/80 px-1.5 py-0.5 rounded uppercase font-medium ring-1 ring-inset ring-neutral-700/50">
														{alt.pricing}
													</span>
												</div>
												<p className="text-xs text-neutral-400 truncate mt-0.5">
													{alt.description || "Discover this alternative tool."}
												</p>
											</div>
										</Link>
									);
								})}
							</div>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
