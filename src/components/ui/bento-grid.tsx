import { cn } from "@/lib/utils";
import { Bookmark, Crown, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./button";

export const BentoGrid = ({
	className,
	children,
}: {
	className?: string;
	children?: React.ReactNode;
}) => {
	return (
		<div
			className={cn(
				"grid lg:auto-rows-[20rem] grid-cols-1 lg:grid-cols-4 gap-6 mx-auto",
				className,
			)}
		>
			{children}
		</div>
	);
};

export const BentoGridItem = ({
	className,
	title,
	subtitle,
	description,
	header,
	icon,
	faviconUrl,
	tags,
	href,
	isLarge = false,
	isFullWidth = false,
	isFeatured = false,
	isFavoriting,
	isFavorite,
	handleFavorite,
}: {
	className?: string;
	title?: string | React.ReactNode;
	subtitle?: string | React.ReactNode;
	description?: string | React.ReactNode;
	header?: React.ReactNode;
	icon?: React.ReactNode;
	faviconUrl?: string | null;
	tags?: string[];
	href?: string;
	isLarge?: boolean;
	isFullWidth?: boolean;
	isFeatured?: boolean;
	isFavoriting?: boolean;
	isFavorite?: boolean;
	handleFavorite?: () => void;
}) => {
	return (
		<div
			className={cn(
				"row-span-1 border rounded-3xl group/bento transition-all duration-500 backdrop-blur-xl flex flex-col justify-end overflow-hidden relative h-full",
				isFeatured
					? "border-primary/30 bg-card/60 shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50"
					: "border-white/10 bg-card/40 shadow-none hover:border-primary/40",
				isLarge && "md:col-span-2 md:row-span-2",
				isFullWidth && "md:col-span-2 row-span-1",
				className,
			)}
		>
			{/* Blurred background logo */}
			{faviconUrl && (
				<div className="absolute inset-0 pointer-events-none overflow-hidden">
					<div
						className={cn(
							"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700",
							isFeatured
								? "w-[80%] h-[80%] opacity-[0.20] group-hover/bento:opacity-[0.30] blur-md group-hover/bento:blur-2xl"
								: "w-[70%] h-[70%] opacity-[0.14] group-hover/bento:opacity-[0.22] blur-lg group-hover/bento:blur-3xl",
						)}
					>
						<Image src={faviconUrl} alt="" fill className="object-contain" unoptimized />
					</div>
				</div>
			)}

			{/* Network Pattern Header (Simulation) */}
			<div className="absolute top-0 left-0 w-full h-full pointer-events-none">
				<div className="absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-transparent opacity-40 transition-opacity duration-700 group-hover/bento:opacity-60" />
				<div className="absolute top-0 left-0 w-full h-[70%] bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 group-hover/bento:scale-110 transition-transform duration-1000" />
				{/* Noise effect */}
				<div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />
			</div>

			{/* Featured Badge */}
			{isFeatured && (
				<>
					<div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-primary/60 to-transparent z-20" />
					<div className="absolute top-6 right-6 z-20 group-hover/bento:opacity-0 group-hover/bento:pointer-events-none group-hover/bento:-translate-y-2 transition-all duration-300">
						<div className="bg-primary/20 border border-primary/30 rounded-lg px-3 py-1.5 backdrop-blur-md flex items-center gap-1.5">
							<Crown className="h-3 w-3 text-yellow-400 fill-yellow-400" />
							<span className="text-[9px] text-white font-black uppercase tracking-widest">
								#1 Most Voted
							</span>
						</div>
					</div>
				</>
			)}

			<div className="absolute top-6 right-6 z-30 opacity-0 group-hover/bento:opacity-100 transition-all duration-500 transform translate-y-2 group-hover/bento:translate-y-0">
				<Button
					onClick={handleFavorite}
					disabled={isFavoriting}
					className={`p-2 rounded-lg border border-neutral-800 bg-neutral-900 hover:border-neutral-600 hover:bg-neutral-800 group/fav ${isFavorite ? "border-neutral-600 bg-neutral-800" : ""}`}
				>
					<Bookmark className={`h-4 w-4 ${isFavorite ? "fill-current text-white" : "text-neutral-400"}`} />
				</Button>
			</div>

			{/* Content Body */}
			<div className="flex flex-col p-8 relative z-10 w-full">
				{/* Logo + Title Section */}
				<div className="flex items-center gap-4 transition-all duration-500">
					<div
						className={cn(
							"rounded-4xl bg-white flex items-center justify-center shrink-0 shadow-2xl shadow-black p-3 transition-all duration-500 overflow-hidden",
							isLarge
								? "w-16 h-16 group-hover/bento:scale-90"
								: "w-14 h-14 group-hover/bento:scale-75",
						)}
					>
						{faviconUrl ? (
							<Image
								src={faviconUrl}
								alt={typeof title === "string" ? title : ""}
								width={isLarge ? 40 : 32}
								height={isLarge ? 40 : 32}
								className="object-contain"
								unoptimized
							/>
						) : (
							icon
						)}
					</div>
					<div className="space-y-1 min-w-0 transition-transform duration-500 group-hover/bento:-translate-x-2">
						<h3
							className={cn(
								"font-bold text-white tracking-tight leading-none group-hover/bento:text-primary transition-colors truncate",
								isLarge ? "text-3xl" : "text-xl",
							)}
						>
							{title}
						</h3>
						{subtitle && (
							<p className="text-muted-foreground/50 text-xs font-semibold leading-tight line-clamp-1">
								{subtitle}
							</p>
						)}
					</div>
				</div>

				{/* Description Reveal Area */}
				<div className="grid grid-rows-[0fr] group-hover/bento:grid-rows-[1fr] transition-all duration-500 ease-out">
					<div className="overflow-hidden">
						<div className="opacity-0 group-hover/bento:opacity-100 transition-opacity duration-500 delay-100 pt-6 space-y-6">
							<p
								className={cn(
									"font-medium text-muted-foreground leading-relaxed",
									isLarge ? "text-base line-clamp-4" : "text-sm line-clamp-3",
								)}
							>
								{description}
							</p>

							<div className="flex flex-wrap gap-2 items-center">
								{tags?.slice(0, isLarge ? 4 : 2).map((tag) => (
									<span
										key={tag}
										className="text-[10px] px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-muted-foreground uppercase tracking-widest font-black transition-all hover:bg-primary/20 hover:text-primary"
									>
										{tag}
									</span>
								))}
								{!isLarge && tags && tags.length > 2 && (
									<span className="text-[10px] text-muted-foreground/40 font-bold">
										+{tags.length - 2}
									</span>
								)}
								<div className="ml-auto flex items-center gap-2 group/link">
									<Link
										href={href || "#"}
										target="_blank"
										className="flex gap-1 items-center justify-center group/link transition-colors"
									>
										<span className="text-[10px] font-black uppercase tracking-widest text-primary group-hover/link:text-tertiary opacity-0 group-hover/bento:opacity-100 transition-opacity">
											Web Site
										</span>
										<ExternalLink className="h-5 w-5 text-primary group-hover/link:text-tertiary" />
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
