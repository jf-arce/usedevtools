"use client";

import { useRef, useState, useCallback, type ReactNode } from "react";

interface ScrollableCardsProps {
	header: ReactNode;
	children: ReactNode;
	fillContent?: boolean;
}

export function ScrollableCards({ header, children, fillContent }: ScrollableCardsProps) {
	const [isScrolled, setIsScrolled] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);

	const handleScroll = useCallback(() => {
		if (scrollRef.current) {
			setIsScrolled(scrollRef.current.scrollTop > 0);
		}
	}, []);

	return (
		<div className="relative bg-neutral-950 flex flex-col flex-1 min-h-0 rounded-lg border border-neutral-800">
			<div
				ref={scrollRef}
				onScroll={handleScroll}
				className={`flex-1 min-h-0 overflow-y-auto${fillContent ? " flex flex-col" : ""}`}
			>
				<div
					className={`border-b border-neutral-800 sticky top-0 z-20 px-6 py-4 rounded-tl-xl rounded-tr-xl transition-all duration-300 ${
						isScrolled ? "bg-neutral-900/50 backdrop-blur-md" : "bg-neutral-900/50"
					}`}
				>
					{header}
				</div>

				<div className={`px-6 py-4${fillContent ? " flex flex-col flex-1 min-h-0" : ""}`}>
					{children}
				</div>
			</div>
		</div>
	);
}
