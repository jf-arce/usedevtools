"use server";

import { db } from "@/lib/db";

export const getSubCategories = async (categoryId: string) => {
	const subCategories = await db.subCategory.findMany({
		where: {
			categoryId,
		},
		select: {
			id: true,
			name: true,
		},
	});
	return subCategories;
};
