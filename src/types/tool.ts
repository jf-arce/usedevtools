import { PricingType } from "@prisma/client";

export type NewTool = {
	id: string;
	title: string;
	url: string;
	category: Category;
	subCategory: SubCategory;
	pricing: PricingType;
	description?: string;
	stack: string[];
};

export type Category = {
	id: string;
	name: string;
};

export type SubCategory = {
	id: string;
	name: string;
	category?: Category;
};

