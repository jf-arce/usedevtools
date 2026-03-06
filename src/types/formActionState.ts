export type FormActionState<T> = {
	success: boolean;
	error: string | null;
	errorFields?: Record<string, string[]>;
	data: T | null;
};
