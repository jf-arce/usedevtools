import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

// Necesario en Node.js para que @neondatabase/serverless use WebSocket en lugar de HTTP
neonConfig.webSocketConstructor = ws;

const prismaClientSingleton = () => {
	const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
	return new PrismaClient({ adapter });
};

// Singleton para no saturar conexiones en Next.js
declare global {
	var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const db = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
