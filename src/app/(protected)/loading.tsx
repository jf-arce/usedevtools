import { Loader } from "@/components/loader";

export default function Loading() {
	return (
		<div className="flex items-center justify-center h-[calc(100vh-65px)]">
			<Loader size={40} color="white" />
		</div>
	);
}
