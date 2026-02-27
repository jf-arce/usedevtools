"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NewTool } from "@/types/tool";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

interface SubmitResponse {
	success: boolean;
	data?: any;
	error?: string;
}

export const submitNewTool = async (tool: NewTool): Promise<SubmitResponse> => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session || !session.user) {
		throw new Error("User not authenticated");
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
	if (!newTool) return { success: false, error: "Failed to create tool" };

	revalidatePath("/");

	return { success: true, data: newTool };
};
