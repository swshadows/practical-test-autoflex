import { prisma } from "../lib/prisma";

export default class ProductService {
	async createProduct(name: string, value: number) {
		const product = prisma.product.create({
			data: {
				name,
				value,
			},
		});
		return product;
	}
	async getAllProducts() {
		const products = prisma.product.findMany();
		return products;
	}
	getProductById(id: number) {
		const product = prisma.product.findUnique({
			where: {
				id,
			},
		});
		return product;
	}
	updateProduct(id: number, name: string, value: number) {
		const product = prisma.product.update({
			where: {
				id,
			},
			data: {
				name,
				value,
			},
		});
		return product;
	}
	deleteProduct(id: number) {
		const product = prisma.product.delete({
			where: {
				id,
			},
		});
		return product;
	}
}
