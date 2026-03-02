import { LineSpinner } from "ldrs/react";
import "ldrs/react/LineSpinner.css";

export const Loader = ({ size = 18, stroke = 2, speed = 1, color = "black" }) => {
	return <LineSpinner size={size} stroke={stroke} speed={speed} color={color} />;
};
