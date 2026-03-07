import {
	Eye,
	Heart,
	ThumbsUp,
	Globe,
	ArrowRight,
	Lightbulb,
	Info,
	Layout,
	Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NewToolFormValues } from "@/validations/new-tool-validation";
import Image from "next/image";
import { useGetFaviconUrl } from "@/hooks/use-get-favicon-url";

interface PreviewSidebarProps {
	formData: NewToolFormValues | null;
}

export function PreviewSidebar({ formData }: PreviewSidebarProps) {
	const { faviconUrl, logoError, setLogoError } = useGetFaviconUrl(formData?.url || "");

	return (
		<div className="sticky top-24 space-y-8">
			<div className="space-y-4">
				<h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
					<Eye className="h-4 w-4 text-primary" />
					Preview
				</h3>

				<Card className="group py-1! relative overflow-hidden border-neutral-800 bg-neutral-900/50 flex flex-col">
					<CardHeader className="p-4 pb-0">
						<div className="flex items-start justify-between">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br text-xl font-bold text-white shadow-lg overflow-hidden shrink-0">
								{faviconUrl && !logoError ? (
									<Image
										src={faviconUrl}
										alt={`${formData?.title || "Tool"} logo`}
										width={48}
										height={48}
										className="h-full w-full object-contain p-1.5 rounded-xl"
										onError={() => setLogoError(true)}
										unoptimized
									/>
								) : (
									<Terminal className="h-6 w-6 text-primary" />
								)}
							</div>

							<div className="flex gap-2">
								<div className="p-2 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-500 cursor-default">
									<Heart className="h-3.5 w-3.5" />
								</div>
							</div>
						</div>
						<div className="mt-3 flex flex-col gap-1.5 min-w-0">
							<h3 className="text-lg font-bold uppercase tracking-tight truncate">
								{formData?.title || "Your Tool"}
							</h3>

							<Badge
								variant="outline"
								className={`
									${formData?.pricing === "FREE" || !formData?.pricing ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : ""}
									${formData?.pricing === "FREEMIUM" ? "border-amber-500/50 bg-amber-500/10 text-amber-400" : ""}
									${formData?.pricing === "PAID" ? "border-rose-500/50 bg-rose-500/10 text-rose-400" : ""}
									text-[10px] uppercase tracking-wider h-fit w-fit
								`}
							>
								{(formData?.pricing || "free").toLowerCase()}
							</Badge>
						</div>
					</CardHeader>

					<CardContent className="grow min-w-0 overflow-hidden">
						<p className="line-clamp-2 text-sm text-neutral-400 leading-relaxed wrap-break-word">
							{formData?.description ||
								"Add a short description to see how your tool will look in the directory."}
						</p>
					</CardContent>

					<CardFooter className="flex items-center justify-between p-4 pt-0">
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								className="cursor-default h-8 w-8 p-0"
								tabIndex={-1}
							>
								<Globe className="h-3.5 w-3.5" />
							</Button>
							<div className="flex items-center gap-1.5 px-2.5 py-1.5 border border-neutral-800 rounded-md text-xs text-neutral-500 cursor-default">
								<ThumbsUp className="h-3.5 w-3.5" />
								<span className="font-bold">0</span>
							</div>
						</div>
					</CardFooter>
				</Card>
			</div>

			<Card className="rounded-3xl border-white/5 bg-accent/5 backdrop-blur-md overflow-hidden relative">
				<div className="absolute top-0 right-0 p-1 opacity-10">
					<Layout className="h-20 w-20 text-primary" />
				</div>
				<CardContent className="p-6">
					<h4 className="text-foreground text-sm font-black mb-5 flex items-center gap-2 uppercase tracking-widest">
						<div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
							<Lightbulb className="h-4 w-4 text-amber-500" />
						</div>
						Publishing Tips
					</h4>
					<ul className="space-y-4">
						{[
							"Use a concise, memorable name.",
							"Make sure the URL is accessible (https).",
							"Select the most relevant category for SEO.",
							"A valuable description attracts more clicks.",
						].map((tip, i) => (
							<li key={i} className="flex items-start gap-4">
								<div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
								<p className="text-xs text-muted-foreground leading-normal">{tip}</p>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>

			<div className="p-6 rounded-3xl border border-white/5 bg-background/40 flex items-center gap-4">
				<div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
					<Info className="h-5 w-5 text-emerald-500" />
				</div>
				<div>
					<p className="text-xs font-bold text-foreground">Quick Approval</p>
					<p className="text-[10px] text-muted-foreground">
						Tools are usually reviewed in less than 24h.
					</p>
				</div>
			</div>
		</div>
	);
}
