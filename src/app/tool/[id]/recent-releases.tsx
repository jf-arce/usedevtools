import { Tag, ExternalLink } from "lucide-react";
import type { GithubRelease } from "@/lib/get-github-stats";

interface RecentReleasesProps {
	releases?: GithubRelease[];
}

function formatRelativeDate(dateStr: string): string {
	const date = new Date(dateStr);
	if (isNaN(date.getTime())) return "";
	const diff = Date.now() - date.getTime();
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	if (days === 0) return "Today";
	if (days === 1) return "Yesterday";
	if (days < 30) return `${days}d ago`;
	const months = Math.floor(days / 30);
	if (months < 12) return `${months}mo ago`;
	return `${Math.floor(months / 12)}y ago`;
}

export function RecentReleases({ releases }: RecentReleasesProps) {
	if (!releases || releases.length === 0) return null;

	return (
		<div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-2">
					<Tag className="h-5 w-5 text-indigo-400" />
					<h3 className="text-xl font-bold text-white">Recent Releases</h3>
				</div>
				<span className="text-xs text-indigo-400 font-medium px-2 py-1 bg-indigo-500/10 rounded-md ring-1 ring-inset ring-indigo-500/20">
					{releases.length} release{releases.length !== 1 ? "s" : ""}
				</span>
			</div>

			<div className="space-y-0">
				{releases.map((release, index) => (
					<div
						key={release.tag}
						className={`py-4 ${index < releases.length - 1 ? "border-b border-neutral-800/50" : ""}`}
					>
						<div className="flex items-start justify-between gap-3">
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2 mb-1 flex-wrap">
									<span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
										{release.tag}
									</span>
									{release.name !== release.tag && (
										<span className="text-sm font-medium text-white truncate">
											{release.name}
										</span>
									)}
								</div>
								<span className="text-[11px] text-neutral-500">
									{formatRelativeDate(release.date)}
								</span>
							</div>
							<a
								href={release.url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-neutral-500 hover:text-indigo-400 transition-colors shrink-0 mt-1"
								aria-label={`View release ${release.tag}`}
							>
								<ExternalLink className="h-3.5 w-3.5" />
							</a>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
