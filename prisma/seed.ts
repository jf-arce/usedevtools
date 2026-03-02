import { db } from "../src/lib/db";

async function main() {
	const categories = [
		"Frontend",
		"Backend",
		"IA & Machine Learning",
		"DevOps",
		"Mobile",
		"UI/UX & Design",
		"Testing",
		"Cloud",
	];

	console.log("🌱 Iniciando el seeding de categorías...");

	for (const catName of categories) {
		const exists = await db.category.findUnique({
			where: { name: catName },
		});

		if (!exists) {
			await db.category.create({
				data: { name: catName },
			});
			console.log(`✅ Creada categoría: ${catName}`);
		} else {
			console.log(`⏭️  Ya existe: ${catName}`);
		}
	}

	console.log(`✅ Seeding completado. ${categories.length} categorías procesadas.`);

	// Subcategories - mapeo: nombre de subcategoría -> nombre de categoría padre
	const subCategories = [
		{ name: "Hosting & Deployment", categoryName: "Frontend" },
		{ name: "Frameworks", categoryName: "Frontend" },
		{ name: "Databases", categoryName: "Backend" },
		{ name: "State Management", categoryName: "Frontend" },
		{ name: "Utilities", categoryName: "Frontend" },
	];

	console.log("🌱 Iniciando el seeding de subcategorías...");

	for (const subCat of subCategories) {
		const exists = await db.subCategory.findUnique({
			where: { name: subCat.name },
		});

		if (!exists) {
			// Buscar la categoría padre por nombre para obtener su ID real
			const parentCategory = await db.category.findUnique({
				where: { name: subCat.categoryName },
			});

			if (!parentCategory) {
				console.log(
					`⚠️  Categoría padre "${subCat.categoryName}" no encontrada para "${subCat.name}". Saltando...`,
				);
				continue;
			}

			await db.subCategory.create({
				data: { name: subCat.name, categoryId: parentCategory.id },
			});
			console.log(`✅ Creada subcategoría: ${subCat.name} (en ${subCat.categoryName})`);
		} else {
			console.log(`⏭️  Ya existe: ${subCat.name}`);
		}
	}

	console.log(`✅ Seeding completado. ${subCategories.length} subcategorías procesadas.`);

	// ─── Demo User ───
	console.log("🌱 Creando usuario de prueba...");
	const demoUser = await db.user.upsert({
		where: { email: "demo@usedevtools.com" },
		update: {},
		create: {
			email: "demo@usedevtools.com",
			name: "Demo User",
			emailVerified: true,
		},
	});
	console.log(`✅ Usuario de prueba: ${demoUser.email}`);

	// ─── Technologies ───
	console.log("🌱 Creando tecnologías...");
	const techNames = [
		"React",
		"Next.js",
		"TypeScript",
		"Node.js",
		"Python",
		"Tailwind CSS",
		"PostgreSQL",
		"MongoDB",
		"Docker",
		"Kubernetes",
		"GraphQL",
		"REST API",
		"Svelte",
		"Vue.js",
		"Rust",
		"Go",
		"Redis",
		"Supabase",
		"Firebase",
		"Vercel",
	];

	const techs: Record<string, string> = {};
	for (const name of techNames) {
		const tech = await db.technology.upsert({
			where: { name },
			update: {},
			create: { name },
		});
		techs[name] = tech.id;
	}
	console.log(`✅ ${techNames.length} tecnologías creadas.`);

	// ─── Helper: get IDs ───
	const getCategoryId = async (name: string) => {
		const cat = await db.category.findUnique({ where: { name } });
		return cat!.id;
	};
	const getSubCategoryId = async (name: string) => {
		const sub = await db.subCategory.findUnique({ where: { name } });
		return sub!.id;
	};

	// ─── Tools de prueba ───
	console.log("🌱 Creando herramientas de prueba...");

	const toolsData = [
		{
			title: "Vercel",
			description:
				"The platform for frontend developers. Deploy web projects with the best DX and performance. Supports Next.js, React, Svelte, and more.",
			url: "https://vercel.com",
			pricing: "FREEMIUM" as const,
			categoryName: "Frontend",
			subCategoryName: "Hosting & Deployment",
			votes: 142,
			published: true,
			stack: ["Next.js", "React", "TypeScript", "Vercel"],
		},
		{
			title: "Supabase",
			description:
				"The open source Firebase alternative. Build production-grade applications with a Postgres database, authentication, instant APIs, and real-time subscriptions.",
			url: "https://supabase.com",
			pricing: "FREEMIUM" as const,
			categoryName: "Backend",
			subCategoryName: "Databases",
			votes: 128,
			published: true,
			stack: ["PostgreSQL", "TypeScript", "REST API", "Supabase"],
		},
		{
			title: "Tailwind CSS",
			description:
				"A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup. Fast, flexible and reliable.",
			url: "https://tailwindcss.com",
			pricing: "FREE" as const,
			categoryName: "Frontend",
			subCategoryName: "Frameworks",
			votes: 201,
			published: true,
			stack: ["Tailwind CSS", "React", "Vue.js", "Svelte"],
		},
		{
			title: "Prisma",
			description:
				"Next-generation Node.js and TypeScript ORM. Makes database access easy with an auto-generated query builder for TypeScript & Node.js.",
			url: "https://prisma.io",
			pricing: "FREE" as const,
			categoryName: "Backend",
			subCategoryName: "Databases",
			votes: 115,
			published: true,
			stack: ["TypeScript", "Node.js", "PostgreSQL", "MongoDB"],
		},
		{
			title: "Figma",
			description:
				"The collaborative interface design tool. Design, prototype, and gather feedback all in one place with Figma's powerful design platform.",
			url: "https://figma.com",
			pricing: "FREEMIUM" as const,
			categoryName: "UI/UX & Design",
			subCategoryName: "Utilities",
			votes: 189,
			published: true,
			stack: ["React", "TypeScript"],
		},
		{
			title: "Docker",
			description:
				"Develop faster. Run anywhere. Build, share, and run applications with containers. Simplify development and ship with confidence.",
			url: "https://docker.com",
			pricing: "FREEMIUM" as const,
			categoryName: "DevOps",
			subCategoryName: "Utilities",
			votes: 167,
			published: true,
			stack: ["Docker", "Kubernetes", "Go"],
		},
		{
			title: "Railway",
			description:
				"Infrastructure made simple. Instantly deploy production-ready apps. Build, ship, and monitor from one unified platform.",
			url: "https://railway.app",
			pricing: "FREEMIUM" as const,
			categoryName: "Cloud",
			subCategoryName: "Hosting & Deployment",
			votes: 98,
			published: true,
			stack: ["Docker", "Node.js", "PostgreSQL", "Redis"],
		},
		{
			title: "Playwright",
			description:
				"Reliable end-to-end testing for modern web apps. Cross-browser, cross-platform, and cross-language. Fast, reliable, and capable.",
			url: "https://playwright.dev",
			pricing: "FREE" as const,
			categoryName: "Testing",
			subCategoryName: "Utilities",
			votes: 87,
			published: true,
			stack: ["TypeScript", "Node.js"],
		},
		{
			title: "Expo",
			description:
				"Make any app with React Native. Build one app that runs on Android, iOS, and the web. Simplified mobile development with powerful tools.",
			url: "https://expo.dev",
			pricing: "FREEMIUM" as const,
			categoryName: "Mobile",
			subCategoryName: "Frameworks",
			votes: 134,
			published: true,
			stack: ["React", "TypeScript", "React"],
		},
		{
			title: "Stripe",
			description:
				"Financial infrastructure for the internet. Accept payments, send payouts, and manage businesses online with a suite of powerful APIs.",
			url: "https://stripe.com",
			pricing: "PAID" as const,
			categoryName: "Backend",
			subCategoryName: "Utilities",
			votes: 156,
			published: true,
			stack: ["TypeScript", "Node.js", "REST API"],
		},
		{
			title: "Zustand",
			description:
				"A small, fast, and scalable state management solution. Nothing boilerplatey, with a comfy API based on hooks.",
			url: "https://zustand-demo.pmnd.rs",
			pricing: "FREE" as const,
			categoryName: "Frontend",
			subCategoryName: "State Management",
			votes: 103,
			published: true,
			stack: ["React", "TypeScript"],
		},
		{
			title: "TensorFlow",
			description:
				"An end-to-end open source machine learning platform. Comprehensive tools and community resources for ML researchers and developers.",
			url: "https://tensorflow.org",
			pricing: "FREE" as const,
			categoryName: "IA & Machine Learning",
			subCategoryName: "Frameworks",
			votes: 175,
			published: true,
			stack: ["Python"],
		},
		{
			title: "Shadcn/ui",
			description:
				"Beautifully designed components built with Radix UI and Tailwind CSS. Copy and paste into your apps. Open source and customizable.",
			url: "https://ui.shadcn.com",
			pricing: "FREE" as const,
			categoryName: "Frontend",
			subCategoryName: "Frameworks",
			votes: 195,
			published: true,
			stack: ["React", "TypeScript", "Tailwind CSS"],
		},
		{
			title: "Cloudflare",
			description:
				"The Web Performance & Security Company. CDN, DDoS protection, DNS, and more. Make your website faster and more secure.",
			url: "https://cloudflare.com",
			pricing: "FREEMIUM" as const,
			categoryName: "Cloud",
			subCategoryName: "Hosting & Deployment",
			votes: 144,
			published: true,
			stack: ["Rust", "Go"],
		},
		{
			title: "Upstash",
			description:
				"Serverless data platform. Redis and Kafka for serverless and edge computing. Pay only for what you use.",
			url: "https://upstash.com",
			pricing: "FREEMIUM" as const,
			categoryName: "Backend",
			subCategoryName: "Databases",
			votes: 76,
			published: true,
			stack: ["Redis", "TypeScript", "REST API"],
		},
		{
			title: "Turborepo",
			description:
				"High-performance build system for JavaScript and TypeScript codebases. Incremental builds, remote caching, and parallel execution.",
			url: "https://turbo.build",
			pricing: "FREE" as const,
			categoryName: "DevOps",
			subCategoryName: "Utilities",
			votes: 112,
			published: true,
			stack: ["TypeScript", "Rust", "Go"],
		},
	];

	for (const tool of toolsData) {
		const exists = await db.tool.findUnique({ where: { url: tool.url } });
		if (exists) {
			console.log(`⏭️  Ya existe: ${tool.title}`);
			continue;
		}

		const categoryId = await getCategoryId(tool.categoryName);
		const subCategoryId = await getSubCategoryId(tool.subCategoryName);

		await db.tool.create({
			data: {
				title: tool.title,
				description: tool.description,
				url: tool.url,
				pricing: tool.pricing,
				categoryId,
				subCategoryId,
				votes: tool.votes,
				published: tool.published,
				userId: demoUser.id,
				stack: {
					connect: [...new Set(tool.stack)].map((name) => ({ name })),
				},
			},
		});
		console.log(`✅ Creada herramienta: ${tool.title}`);
	}

	console.log(`✅ Seeding completado. ${toolsData.length} herramientas procesadas.`);
}

main()
	.catch((e) => {
		console.error("❌ Error en el seed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await db.$disconnect();
	});
