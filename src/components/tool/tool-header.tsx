"use client";

import Image from "next/image";
import { ArrowUpRight, Bookmark, ThumbsUp, Github } from "lucide-react";
import { useState, useTransition, useOptimistic } from "react";
import { toggleVoteAction, toggleFavoriteAction } from "@/actions/tool-interactions";
import { useGetFaviconUrl } from "@/hooks/use-get-favicon-url";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { GithubLight } from "@/components/ui/svgs/githubLight";
import { signIn } from "@/lib/auth-client";
import { Loader } from "@/components/loader";

interface ToolHeaderProps {
	tool: {
		id: string;
		title: string;
		description: string | null;
		url: string;
		pricing: string;
		votes: number;
		category: string;
		subCategory: string;
	};
	initialHasVoted: boolean;
	initialIsFavorite: boolean;
	repoUrl?: string;
}

export function ToolHeader({ tool, initialHasVoted, initialIsFavorite, repoUrl }: ToolHeaderProps) {
	const [showLoginDialog, setShowLoginDialog] = useState(false);
	const [signInLoading, setSignInLoading] = useState(false);

	const [optimisticVoteData, addOptimisticVoteData] = useOptimistic(
		{ hasVoted: initialHasVoted, votes: tool.votes },
		(state, newHasVoted: boolean) => ({
			hasVoted: newHasVoted,
			votes: newHasVoted ? state.votes + 1 : state.votes - 1,
		}),
	);

	const [optimisticIsFavorite, addOptimisticIsFavorite] = useOptimistic(
		initialIsFavorite,
		(state, newIsFavorite: boolean) => newIsFavorite,
	);

	const [isPendingVote, startVoteTransition] = useTransition();
	const [isPendingFavorite, startFavoriteTransition] = useTransition();

	const { faviconUrl, logoError, setLogoError } = useGetFaviconUrl(tool.url);
	const iconLetter = tool.title.charAt(0).toUpperCase();

	const handleGithubSignIn = async () => {
		setSignInLoading(true);
		try {
			await signIn.social({ provider: "github" });
		} catch (err) {
			console.error("GitHub sign-in failed", err);
			setSignInLoading(false);
		}
	};

	const handleVote = (e: React.MouseEvent) => {
		e.preventDefault();
		if (isPendingVote) return;

		startVoteTransition(async () => {
			addOptimisticVoteData(!optimisticVoteData.hasVoted);
			const res = await toggleVoteAction(tool.id);
			if (res?.error) {
				if (res.error.includes("logged in")) {
					setShowLoginDialog(true);
				}
			}
		});
	};

	const handleFavorite = (e: React.MouseEvent) => {
		e.preventDefault();
		if (isPendingFavorite) return;

		startFavoriteTransition(async () => {
			addOptimisticIsFavorite(!optimisticIsFavorite);
			const res = await toggleFavoriteAction(tool.id);
			if (res?.error) {
				if (res.error.includes("logged in")) {
					setShowLoginDialog(true);
				}
			}
		});
	};

	return (
		<div className="relative mb-10 h-full w-full">
			<div className="relative flex flex-col md:flex-row gap-6 md:items-start justify-between">
				<div className="flex flex-col sm:flex-row gap-6">
					{/* Tool Logo Large */}
					<div className="shrink-0 h-24 w-24 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center p-4 shadow-lg transition-transform hover:scale-105 duration-300">
						{faviconUrl && !logoError ? (
							<Image
								src={faviconUrl}
								alt={`${tool.title} logo`}
								width={64}
								height={64}
								className="h-full w-full object-contain"
								onError={() => setLogoError(true)}
								unoptimized
							/>
						) : (
							<span className="text-3xl font-bold text-neutral-400">{iconLetter}</span>
						)}
					</div>

					<div className="flex flex-col gap-2 pt-1 min-w-0">
						<div className="flex items-center gap-3 flex-wrap">
							<h1 className="text-3xl md:text-4xl font-black text-white tracking-tight truncate">
								{tool.title}
							</h1>
							<span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400 border border-indigo-500/20">
								{tool.category}
							</span>
							<span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20 capitalize">
								{tool.subCategory}
							</span>
						</div>
						<p className="text-lg text-neutral-400 max-w-2xl leading-relaxed">
							{tool.description || "No description available for this tool."}
						</p>
					</div>
				</div>

				<div className="flex flex-wrap lg:flex-nowrap gap-3 mt-4 md:mt-0 shrink-0 w-full md:w-auto overflow-hidden">
					<Button
						asChild
						variant="ghost"
						className="flex-1 active:scale-95 transition-transform lg:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-5 sm:py-6 lg:py-3 h-auto text-sm font-semibold text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] hover:bg-indigo-500! hover:text-white hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.6)] ring-1 ring-inset ring-white/10"
					>
						<a href={tool.url} target="_blank" rel="noopener noreferrer">
							<span>Visit website</span>
							<ArrowUpRight className="h-4 w-4" />
						</a>
					</Button>
					{repoUrl && (
						<Button
							asChild
							variant="outline"
							className="flex-1 active:scale-95 transition-transform lg:flex-none inline-flex items-center justify-center gap-2 rounded-lg border-neutral-700 bg-neutral-800/80 px-4 py-5 sm:py-6 lg:py-3 h-auto text-sm font-semibold text-white hover:bg-neutral-700 hover:text-white ring-1 ring-inset ring-neutral-600/50 group"
							aria-label="View on GitHub"
						>
							<a href={repoUrl} target="_blank" rel="noopener noreferrer">
								<Github className="h-4 w-4 group-hover:text-indigo-400 transition-colors" />
								<span className="hidden sm:inline">Repo</span>
							</a>
						</Button>
					)}
					<Button
						onClick={handleFavorite}
						variant="outline"
						className={`cursor-pointer active:scale-95 flex-1 lg:flex-none inline-flex items-center justify-center gap-2 rounded-lg border-neutral-800 px-6 py-5 sm:py-6 lg:py-3 h-auto text-sm font-semibold transition-all group ${
							optimisticIsFavorite
								? "bg-neutral-800 text-white border-neutral-600 hover:bg-neutral-700 hover:text-white"
								: "bg-neutral-900/50 text-white hover:bg-neutral-800/80 hover:text-white"
						}`}
					>
						<Bookmark
							className={`h-4 w-4 transition-all ${
								optimisticIsFavorite
									? "fill-current text-white scale-110"
									: "text-neutral-400 group-hover:text-white group-hover:scale-110"
							}`}
						/>
						<span>{optimisticIsFavorite ? "Saved" : "Save"}</span>
					</Button>
					<Button
						onClick={handleVote}
						variant="outline"
						className={`cursor-pointer active:scale-95 flex-1 lg:flex-none inline-flex items-center justify-center gap-2 rounded-lg border-neutral-800 px-6 py-5 sm:py-6 lg:py-3 h-auto text-sm font-semibold transition-all group ${
							optimisticVoteData.hasVoted
								? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20 hover:text-indigo-300"
								: "bg-neutral-900/50 text-white hover:bg-neutral-800/80 hover:text-white"
						}`}
					>
						<ThumbsUp
							className={`h-4 w-4 transition-all duration-300 ${
								optimisticVoteData.hasVoted
									? "fill-current scale-110 -rotate-12 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
									: "text-neutral-400 group-hover:text-indigo-400 group-hover:-rotate-12 group-hover:scale-110"
							}`}
						/>
						<span>
							{optimisticVoteData.hasVoted ? "Upvoted" : "Upvote"} ({optimisticVoteData.votes})
						</span>
					</Button>
				</div>
			</div>

			<Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
				<DialogContent className="bg-neutral-900 border-neutral-800 text-white sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="text-xl font-bold uppercase tracking-tight">
							Login Required
						</DialogTitle>
						<DialogDescription className="text-slate-400 mt-2">
							You need to log in to upvote or save tools to favorites. Join our community!
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-4 mt-6">
						<Button
							className="font-bold uppercase tracking-widest text-xs h-12 bg-white text-black hover:bg-slate-200 transition-colors"
							onClick={handleGithubSignIn}
							disabled={signInLoading}
						>
							{signInLoading ? (
								<Loader />
							) : (
								<>
									<GithubLight className="h-5 w-5 mr-2" />
									Continue with GitHub
								</>
							)}
						</Button>
						<Button
							variant="ghost"
							className="text-neutral-500 hover:text-white hover:bg-neutral-800 uppercase tracking-widest text-[10px]"
							onClick={() => setShowLoginDialog(false)}
						>
							Cancel
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
