"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function toggleVoteAction(toolId: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return { error: "You must be logged in to vote" };
	}

	const userId = session.user.id;

	try {
		const existingVote = await db.vote.findUnique({
			where: {
				userId_toolId: {
					userId,
					toolId,
				},
			},
		});

		if (existingVote) {
			await db.$transaction([
				db.vote.delete({
					where: { id: existingVote.id },
				}),
				db.tool.update({
					where: { id: toolId },
					data: { votes: { decrement: 1 } },
				}),
			]);
			revalidatePath("/", "layout");
			return { success: true, voted: false };
		} else {
			await db.$transaction([
				db.vote.create({
					data: { userId, toolId },
				}),
				db.tool.update({
					where: { id: toolId },
					data: { votes: { increment: 1 } },
				}),
			]);
			revalidatePath("/", "layout");
			return { success: true, voted: true };
		}
	} catch (error) {
		console.error(error);
		return { error: "Failed to toggle vote" };
	}
}

export async function toggleFavoriteAction(toolId: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return { error: "You must be logged in to favorite" };
	}

	const userId = session.user.id;

	try {
		const existingFavorite = await db.favorite.findUnique({
			where: {
				userId_toolId: {
					userId,
					toolId,
				},
			},
		});

		if (existingFavorite) {
			await db.favorite.delete({
				where: { id: existingFavorite.id },
			});
			revalidatePath("/", "layout");
			return { success: true, isFavorite: false };
		} else {
			await db.favorite.create({
				data: {
					userId,
					toolId,
				},
			});
			revalidatePath("/", "layout");
			return { success: true, isFavorite: true };
		}
	} catch (error) {
		console.error(error);
		return { error: "Failed to toggle favorite" };
	}
}
