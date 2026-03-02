export const BackgroundFading = () => {
	return (
		<>
			<div className="pointer-events-none absolute top-0 left-0 w-full h-[60vh] bg-[linear-gradient(to_bottom,oklch(14.5%_0_0)_0%,oklch(14.5%_0_0/0.8)_20%,oklch(14.5%_0_0/0.4)_40%,transparent_100%)] z-1" />
			<div className="pointer-events-none absolute top-0 left-0 w-full h-[80vh] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(67.3%_0.182_276.935/0.12),transparent)]" />
			{/* 1. Hero heading — left side */}
			<div className="pointer-events-none absolute top-[12%] left-[10%] w-150 h-150 bg-[radial-gradient(circle,oklch(67.3%_0.182_276.935/0.08),transparent_70%)] z-2" />
			{/* 2. Hero terminal preview — right side */}
			<div className="pointer-events-none absolute top-[8%] right-[0%] w-125 h-125 bg-[radial-gradient(circle,oklch(67.3%_0.182_276.935/0.06),transparent_70%)] z-2" />
			{/* 3. Featured Tools bento grid — center */}
			<div className="pointer-events-none absolute top-[30%] left-[50%] -translate-x-1/2 w-175 h-125 bg-[radial-gradient(ellipse,oklch(67.3%_0.182_276.935/0.07),transparent_70%)] z-2" />
			{/* 4. Explore Catalog button — center */}
			<div className="pointer-events-none absolute top-[48%] left-[50%] -translate-x-1/2 w-100 h-75 bg-[radial-gradient(circle,oklch(67.3%_0.182_276.935/0.09),transparent_70%)] z-2" />
			{/* 5. Community Feed — left accent */}
			<div className="pointer-events-none absolute top-[58%] left-[5%] w-125 h-125 bg-[radial-gradient(circle,oklch(67.3%_0.182_276.935/0.07),transparent_70%)] z-2" />
			{/* 6. Community Feed — right accent */}
			<div className="pointer-events-none absolute top-[62%] right-[5%] w-112.5 h-112.5 bg-[radial-gradient(circle,oklch(67.3%_0.182_276.935/0.06),transparent_70%)] z-2" />
			{/* 7. CTA card — center glow */}
			<div className="pointer-events-none absolute top-[78%] left-[50%] -translate-x-1/2 w-150 h-100 bg-[radial-gradient(ellipse,oklch(67.3%_0.182_276.935/0.08),transparent_70%)] z-2" />
		</>
	);
};
