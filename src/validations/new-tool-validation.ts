import { VALID_TLDS } from "@/constants/valid-tlds";
import { PricingType } from "@prisma/client";
import { z } from "zod";

// Info step validation
const urlSchema = z.object({
	url: z
		.url()
		.startsWith("https://", "If you include the protocol, it must be https://")
		.refine((val) => {
			try {
				const urlObj = new URL(val);
				const hostname = urlObj.hostname.replace(/^www\./, "");
				const parts = hostname.split(".");

				if (parts.length < 2) return false;

				const tld = parts[parts.length - 1].toLowerCase();
				return VALID_TLDS.has(tld);
			} catch (e) {
				return false;
			}
		}, "Please enter a URL with a valid domain extension (e.g., .com, .io, .dev)"),
});

const baseInfoSchema = z.object({
	title: z.string().min(1, "Title is required"),
});

const stepInfoSchema = baseInfoSchema.extend(urlSchema.shape);

export type StepInfoValues = z.infer<typeof stepInfoSchema>;
export const urlValidation = (url: string) => urlSchema.safeParse({ url });
export const stepInfoValidation = (data: StepInfoValues) => stepInfoSchema.safeParse(data);

// Details step validation
const stepDetailsSchema = z.object({
	description: z.string().max(200, "Description must be less than 200 characters"),
	category: z.object({
		id: z.uuid("Category is required"),
		name: z.string(),
	}),
	subCategory: z.object({
		id: z.uuid("Subcategory is required"),
		name: z.string(),
	}),
	pricing: z.enum(PricingType),
	stack: z.array(z.string()),
});

export type StepDetailsValues = z.infer<typeof stepDetailsSchema>;
export const stepDetailsValidation = (data: StepDetailsValues) => stepDetailsSchema.safeParse(data);

// Final validation for all steps
const newToolSchema = stepInfoSchema.extend(stepDetailsSchema.shape);

export type NewToolFormValues = z.infer<typeof newToolSchema>;
export const newToolValidation = (data: NewToolFormValues) => newToolSchema.safeParse(data);
