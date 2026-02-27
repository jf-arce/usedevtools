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
}

main()
	.catch((e) => {
		console.error("❌ Error en el seed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await db.$disconnect();
	});
