"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, ThumbsUp, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { PricingType } from "@prisma/client";
import { toggleVoteAction, toggleFavoriteAction } from "@/actions/tool-interactions";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetFaviconUrl } from "@/hooks/use-get-favicon-url";
import { GithubLight } from "../ui/svgs/githubLight";
import { signIn } from "@/lib/auth-client";
import { Loader } from "../loader";

interface ToolCardProps {
	tool: {
		id: string;
		title: string;
		description: string | null;
		url: string;
		pricing: PricingType;
		votes: number;
		isFavorite?: boolean;
		hasVoted?: boolean;
		category: { name: string };
		subCategory: { name: string };
	};
}

export function ToolCard({ tool }: ToolCardProps) {
	const [votes, setVotes] = useState(tool.votes);
	const [isFavorite, setIsFavorite] = useState(tool.isFavorite || false);
	const [hasVoted, setHasVoted] = useState(tool.hasVoted || false);
	const [isVoting, setIsVoting] = useState(false);
	const [isFavoriting, setIsFavoriting] = useState(false);
	const [showLoginDialog, setShowLoginDialog] = useState(false);
	const { faviconUrl, logoError, setLogoError } = useGetFaviconUrl(tool.url);

	const iconLetter = tool.title.charAt(0).toUpperCase();

	const [signInLoading, setSignInLoading] = useState(false);

	const handleGithubSignIn = async () => {
		setSignInLoading(true);
		try {
			await signIn.social({ provider: "github" });
		} catch (err) {
			console.error("GitHub sign-in failed", err);
			setSignInLoading(false);
		}
	};

	const handleVote = async (e: React.MouseEvent) => {
		e.preventDefault();
		if (isVoting) return;
		setIsVoting(true);

		const res = await toggleVoteAction(tool.id);
		if (res.error) {
			if (res.error.includes("logged in")) {
				setShowLoginDialog(true);
			}
		} else if (res.success) {
			setHasVoted(res.voted!);
			setVotes((prev) => (res.voted ? prev + 1 : prev - 1));
		}
		setIsVoting(false);
	};

	const handleFavorite = async (e: React.MouseEvent) => {
		e.preventDefault();
		if (isFavoriting) return;
		setIsFavoriting(true);

		const res = await toggleFavoriteAction(tool.id);
		if (res.error) {
			if (res.error.includes("logged in")) {
				setShowLoginDialog(true);
			}
		} else if (res.success) {
			setIsFavorite(res.isFavorite!);
		}
		setIsFavoriting(false);
	};

	return (
		<>
			<Card className="group py-1! relative overflow-hidden border-neutral-800 bg-neutral-900/50 transition-all hover:bg-neutral-900 flex flex-col h-full">
				<CardHeader className="p-6 pb-0">
					<div className="flex items-start justify-between">
						<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br text-xl font-bold text-white shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
							{faviconUrl && !logoError ? (
								<Image
									src={faviconUrl}
									alt={`${tool.title} logo`}
									width={48}
									height={48}
									className="h-full w-full object-contain p-1.5 rounded-xl"
									onError={() => setLogoError(true)}
									unoptimized
								/>
							) : (
								iconLetter
							)}
						</div>

						<div className="flex gap-2">
							<Button
								onClick={handleFavorite}
								disabled={isFavoriting}
								className={`p-2 rounded-lg border border-neutral-800 bg-neutral-900 transition-colors hover:border-rose-500/50 hover:bg-rose-500/10 group/fav ${isFavorite ? "text-rose-500 border-rose-500/50 bg-rose-500/10" : "text-neutral-500"}`}
							>
								<Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
							</Button>
						</div>
					</div>
					<div className="mt-4 flex flex-col gap-2">
						<h3 className="text-xl font-bold uppercase tracking-tight">{tool.title}</h3>

						<Badge
							variant="outline"
							className={`
					${tool.pricing === "FREE" ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : ""}
					${tool.pricing === "FREEMIUM" ? "border-amber-500/50 bg-amber-500/10 text-amber-400" : ""}
					${tool.pricing === "PAID" ? "border-rose-500/50 bg-rose-500/10 text-rose-400" : ""}
					text-[10px] uppercase tracking-wider h-fit mt-1
					`}
						>
							{tool.pricing.toLowerCase()}
						</Badge>
					</div>
				</CardHeader>

				<CardContent className="p-6 pt-2 grow">
					<p className="line-clamp-2 text-sm text-neutral-400 leading-relaxed">
						{tool.description || "No description available for this tool."}
					</p>
				</CardContent>
				<CardFooter className="flex items-center justify-between p-6 pt-0">
					<div className="flex items-center gap-2">
						<Button asChild variant="outline">
							<Link href={tool.url} target="_blank" className="hover:text-indigo-400">
								<Globe />
							</Link>
						</Button>
						<Button
							onClick={handleVote}
							disabled={isVoting}
							variant="outline"
							className={`flex hover:text-indigo-400 items-center gap-2 px-3 py-1.5 border transition-all cursor-pointer group/vote text-sm ${
								hasVoted && "border-indigo-500/50 bg-indigo-500/10 text-indigo-400"
							}`}
						>
							<ThumbsUp
								className={`h-4 w-4 group-hover/vote:-rotate-12 transition-transform ${isVoting ? "animate-pulse" : ""} ${hasVoted ? "fill-current" : ""}`}
							/>
							<span className="font-bold">{votes}</span>
						</Button>
					</div>
					<Link
						href={`/tool/${tool.id}`}
						className="group/link flex items-center gap-1 text-xs font-medium text-neutral-400 hover:text-white transition-colors uppercase tracking-widest"
					>
						Details
						<ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-1" />
					</Link>
				</CardFooter>
			</Card>

			<Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
				<DialogContent className="bg-neutral-900 border-neutral-800 text-white sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="text-xl font-bold uppercase tracking-tight">
							Login Required
						</DialogTitle>
						<DialogDescription className="text-neutral-400 mt-2">
							You need to be logged in to vote or favorite tools. Join our community to contribute!
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-4 mt-4">
						<Button
							className="font-bold uppercase tracking-widest text-xs h-12"
							onClick={handleGithubSignIn}
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
		</>
	);
}
