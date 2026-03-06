"use server";

import { db } from "@/lib/db";

export const getCategories = async () => {
	const categories = await db.category.findMany({
		select: {
			id: true,
			name: true,
		},
	});
	return categories;
};
