import { cn } from "@/lib/utils";

export const GridBackground = ({
	className,
	children,
}: {
	className?: string;
	children?: React.ReactNode;
}) => {
	return (
		<div
			className={cn(
				"relative w-full flex flex-col items-center justify-center overflow-hidden bg-background",
				className,
			)}
		>
			<div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)]" />
			{children}
		</div>
	);
};
