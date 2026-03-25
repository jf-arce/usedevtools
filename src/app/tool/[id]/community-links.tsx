import { BookOpen, MessageCircle, FileText, ExternalLink, Download } from "lucide-react";

interface CommunityLinksProps {
	docsUrl?: string;
	installUrl?: string;
	discussionsUrl?: string;
	wikiUrl?: string;
}

const linkItems = [
	{ key: "installUrl" as const, icon: Download, label: "Installation" },
	{ key: "docsUrl" as const, icon: BookOpen, label: "Documentation" },
	{ key: "discussionsUrl" as const, icon: MessageCircle, label: "Discussions" },
	{ key: "wikiUrl" as const, icon: FileText, label: "Wiki" },
];

export function CommunityLinks({ docsUrl, installUrl, discussionsUrl, wikiUrl }: CommunityLinksProps) {
	const links = { docsUrl, installUrl, discussionsUrl, wikiUrl };
	const activeLinks = linkItems.filter((item) => links[item.key]);

	if (activeLinks.length === 0) return null;

	return (
		<div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
			<h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
				Links
			</h3>
			<div className="space-y-1">
				{activeLinks.map((item) => (
					<a
						key={item.key}
						href={links[item.key]!}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors group"
					>
						<item.icon className="h-4 w-4 shrink-0" />
						<span className="flex-1">{item.label}</span>
						<ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
					</a>
				))}
			</div>
		</div>
	);
}
