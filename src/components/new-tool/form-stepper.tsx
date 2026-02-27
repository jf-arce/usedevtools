import { cn } from "@/lib/utils";

interface FormStepperProps {
	step: number;
}

export function FormStepper({ step }: FormStepperProps) {
	if (step >= 4) return null;

	return (
		<div className="flex items-start w-full max-w-xl py-4">
			{/* Step 1 */}
			<div className="flex flex-col items-center gap-2">
				<div
					className={cn(
						"rounded-full transition-all duration-500 h-10 w-10 flex items-center justify-center font-bold text-sm shadow-lg",
						step >= 1
							? "bg-primary text-primary-foreground ring-4 ring-primary/20"
							: "bg-muted text-muted-foreground",
					)}
				>
					1
				</div>
				<span className="w-max text-[10px] font-bold uppercase tracking-widest text-primary">
					Info Básica
				</span>
			</div>

			<div
				className={cn(
					"flex-auto border-t-2 transition-all duration-500 mx-4 mt-5",
					step > 1 ? "border-primary" : "border-muted",
				)}
			></div>

			{/* Step 2 */}
			<div className="flex flex-col items-center gap-2">
				<div
					className={cn(
						"rounded-full transition-all duration-500 h-10 w-10 flex items-center justify-center font-bold text-sm",
						step >= 2
							? "bg-primary text-primary-foreground ring-4 ring-primary/20"
							: "bg-muted text-muted-foreground shadow-lg",
						step === 2 && "shadow-lg",
					)}
				>
					2
				</div>
				<span
					className={cn(
						"w-max text-[10px] font-bold uppercase tracking-widest",
						step >= 2 ? "text-primary" : "text-muted-foreground",
					)}
				>
					Detalles
				</span>
			</div>

			<div
				className={cn(
					"flex-auto border-t-2 transition-all duration-500 mx-4 mt-5",
					step > 2 ? "border-primary" : "border-muted",
				)}
			></div>

			{/* Step 3 */}
			<div className="flex flex-col items-center gap-2">
				<div
					className={cn(
						"rounded-full transition-all duration-500 h-10 w-10 flex items-center justify-center font-bold text-sm",
						step >= 3
							? "bg-primary text-primary-foreground ring-4 ring-primary/20"
							: "bg-muted text-muted-foreground",
						step === 3 && "shadow-lg",
					)}
				>
					3
				</div>
				<span
					className={cn(
						"w-max text-[10px] font-bold uppercase tracking-widest",
						step >= 3 ? "text-primary" : "text-muted-foreground",
					)}
				>
					Revisión
				</span>
			</div>
		</div>
	);
}
