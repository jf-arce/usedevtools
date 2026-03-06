import { PricingType } from "@prisma/client";
import { z } from "zod";

export const stepInfoSchema = z.object({
	title: z.string().min(1, "El título es obligatorio"),
	url: z.url("Formato de URL inválido"),
});

export const stepDetailsSchema = z.object({
	description: z.string().max(200, "La descripción debe tener menos de 200 caracteres"),
	categoryId: z.uuid("Debes seleccionar una categoría válida"),
	subCategoryId: z.uuid("Debes seleccionar una subcategoría válida"),
	pricing: z.enum(PricingType),
	stack: z.array(z.string()),
});

export const newToolSchema = stepInfoSchema.extend(stepDetailsSchema.shape);
