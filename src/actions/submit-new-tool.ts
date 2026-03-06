"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { type FormActionState } from "@/types/formActionState";
import { NewTool } from "@/types/tool";
import { PricingType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { newToolSchema } from "@/validations/new-tool-validation";

export type NewToolFormValues = z.infer<typeof newToolSchema>;

export const submitNewToolAction = async (
	_prevState: FormActionState<NewTool>,
	formData: FormData,
): Promise<FormActionState<NewTool>> => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session || !session.user) {
		throw new Error("User not authenticated");
	}

	const tool: NewTool = {
		title: formData.get("title") as string,
		url: formData.get("url") as string,
		description: formData.get("description") as string,
		category: {
			id: formData.get("categoryId") as string,
			name: (formData.get("categoryName") as string) ?? "",
		},
		subCategory: {
			id: formData.get("subCategoryId") as string,
			name: (formData.get("subCategoryName") as string) ?? "",
		},
		pricing: formData.get("pricing") as PricingType,
		stack: JSON.parse(formData.get("stack") as string) as string[],
	};

	const validatedFields = newToolSchema.safeParse(tool);
	if (!validatedFields.success) {
		const flattenedErrors = z.flattenError(validatedFields.error);
		return {
			success: false,
			error: JSON.stringify(flattenedErrors.fieldErrors),
			data: tool,
		};
	}

	const newTool = await db.tool.create({
		data: {
			userId: session.user.id,
			title: tool.title,
			url: tool.url,
			description: tool.description,
			categoryId: tool.category.id,
			subCategoryId: tool.subCategory.id,
			pricing: tool.pricing,
			stack: {
				connectOrCreate: tool.stack.map((name: string) => ({
					where: { name },
					create: { name },
				})),
			},
		},
		include: {
			stack: true,
		},
	});

	console.log(newTool);
	if (!newTool) return { success: false, error: "Failed to create tool", data: tool };

	revalidatePath("/");

	return {
		success: true,
		error: null,
		data: {
			title: newTool.title,
			url: newTool.url,
			description: newTool.description || "",
			category: { id: newTool.categoryId, name: "" },
			subCategory: { id: newTool.subCategoryId, name: "" },
			pricing: newTool.pricing,
			stack: newTool.stack.map((s) => s.name),
		},
	};
};
