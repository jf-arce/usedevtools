export type FormActionState<T> = {
	success: boolean;
	error: string | null;
	data: T | null;
};
