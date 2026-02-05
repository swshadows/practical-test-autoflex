import { prisma } from "../lib/prisma";
import { type Material, type MaterialForAdding } from "./MaterialService";
export default class ProductService {
	async createProduct(name: string, value: number, materials: Material[]) {
		const product = await prisma.product.create({
			data: {
				name,
				value,
				materials: {
					create: materials.map((m) => ({
						material: { connect: { id: m.id } },
						quantity: m.stock_quantity,
					})),
				},
			},
			include: {
				materials: true,
			},
		});
		return product;
	}
	async getAllProducts() {
		const products = await prisma.product.findMany();
		return products;
	}
	async getProductById(id: number) {
		const product = await prisma.product.findUnique({
			where: { id },
			include: {
				materials: {
					include: { material: true },
				},
			},
		});
		return product;
	}
	async updateProduct(id: number, name: string, value: number, materials: MaterialForAdding[]) {
		return prisma.$transaction(async (tx) => {
			await tx.product.update({
				where: { id },
				data: { name, value },
			});

			await tx.productMaterial.deleteMany({
				where: { product_id: id },
			});

			await tx.productMaterial.createMany({
				data: materials.map((m) => ({
					product_id: id,
					material_id: m.id,
					quantity: m.stock_quantity,
				})),
			});

			return tx.product.findUnique({
				where: { id },
				include: {
					materials: {
						include: {
							material: true,
						},
					},
				},
			});
		});
	}

	async deleteProduct(id: number) {
		const product = await prisma.product.delete({
			where: {
				id,
			},
		});
		return product;
	}
}
