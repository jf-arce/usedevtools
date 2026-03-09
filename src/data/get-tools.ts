import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getTools({
	query,
	category,
	subCategory,
	pricing,
	sort = "votes",
	stack,
	limit = 12,
	skip = 0,
	favoritesUserId,
	uploadedByUserId,
}: {
	query?: string;
	category?: string;
	subCategory?: string;
	pricing?: string;
	sort?: string;
	stack?: string[];
	limit?: number;
	skip?: number;
	favoritesUserId?: string;
	uploadedByUserId?: string;
} = {}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const where: Prisma.ToolWhereInput = {
		published: uploadedByUserId ? undefined : true, // Only show published tools unless viewing own
	};

	if (query) {
		where.OR = [
			{ title: { contains: query, mode: "insensitive" } },
			{ description: { contains: query, mode: "insensitive" } },
			{ stack: { some: { name: { contains: query, mode: "insensitive" } } } },
		];
	}

	if (category && category !== "all") {
		where.category = { name: { equals: category } };
	}

	if (subCategory && subCategory !== "all") {
		where.subCategory = { name: { equals: subCategory } };
	}

	if (pricing && pricing !== "all") {
		where.pricing = pricing as any;
	}

	if (stack && stack.length > 0) {
		where.stack = { some: { name: { in: stack } } };
	}

	if (favoritesUserId) {
		where.favorites = { some: { userId: favoritesUserId } };
	}

	if (uploadedByUserId) {
		where.userId = uploadedByUserId;
	}

	const userId = session?.user?.id;

	const include: Prisma.ToolInclude = {
		category: { select: { name: true } },
		subCategory: { select: { name: true } },
		stack: { select: { name: true } },
		...(userId && {
			favorites: { where: { userId } },
			voteItems: { where: { userId } },
		}),
	};

	let orderBy: Prisma.ToolOrderByWithRelationInput;
	switch (sort) {
		case "newest":
			orderBy = { createdAt: "desc" };
			break;
		case "alphabetical":
			orderBy = { title: "asc" };
			break;
		case "votes":
		default:
			orderBy = { votes: "desc" };
			break;
	}

	const [tools, total] = await Promise.all([
		db.tool.findMany({
			where,
			include,
			orderBy,
			take: limit,
			skip: skip,
		}),
		db.tool.count({ where }),
	]);

	const toolsWithInteractions = tools.map((tool) => ({
		...tool,
		isFavorite: "favorites" in tool && Array.isArray(tool.favorites) && tool.favorites.length > 0,
		hasVoted: "voteItems" in tool && Array.isArray(tool.voteItems) && tool.voteItems.length > 0,
	}));

	return { tools: toolsWithInteractions, total };
}

export async function getCategories() {
	return db.category.findMany({
		orderBy: { name: "asc" },
	});
}

export async function getCategoriesWithCounts() {
	const categories = await db.category.findMany({
		orderBy: { name: "asc" },
		include: {
			_count: { select: { tools: { where: { published: true } } } },
			subCategories: {
				orderBy: { name: "asc" },
				include: {
					_count: { select: { tools: { where: { published: true } } } },
				},
			},
		},
	});

	return categories;
}

export async function getTotalToolsCount() {
	return db.tool.count({ where: { published: true } });
}

export async function getAllTechnologies() {
	return db.technology.findMany({
		orderBy: { name: "asc" },
		select: { id: true, name: true },
	});
}

export async function getFeaturedTools(limit = 8) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const userId = session?.user?.id;

	const tools = await db.tool.findMany({
		where: { published: true },
		include: {
			category: { select: { name: true } },
			subCategory: { select: { name: true } },
			stack: { select: { name: true } },
			...(userId && {
				favorites: { where: { userId } },
			}),
		},
		orderBy: { votes: "desc" },
		take: limit,
	});

	return tools.map((tool) => ({
		...tool,
		isFavorite: "favorites" in tool && Array.isArray(tool.favorites) && tool.favorites.length > 0,
	}));
}
