import { CircleX } from "lucide-react";

export const FormError = ({ error }: { error?: string[] }) => {
	if (!error) return null;

	return (
		<div className="text-red-500 rounded-md">
			<ul className="list-inside">
				{error.map((err, index) => (
					<li key={index}>
						<CircleX className="inline-block mr-1" size={16} />
						{err}
					</li>
				))}
			</ul>
		</div>
	);
};
