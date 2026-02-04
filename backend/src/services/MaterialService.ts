import { prisma } from "../lib/prisma";

export default class MaterialService {
	async createMaterial(name: string, quantity: number) {
		const material = prisma.material.create({
			data: {
				name,
				stock_quantity: quantity,
			},
		});
		return material;
	}
	async getAllMaterials() {
		const materials = prisma.material.findMany();
		return materials;
	}
	async getMaterialById(id: number) {
		const material = prisma.material.findUnique({
			where: {
				id,
			},
		});
		return material;
	}
	async updateMaterial(id: number, name: string, quantity: number) {
		const material = prisma.material.update({
			where: {
				id,
			},
			data: {
				name,
				stock_quantity: quantity,
			},
		});
		return material;
	}
	async deleteMaterial(id: number) {
		const material = prisma.material.delete({
			where: {
				id,
			},
		});
		return material;
	}
}
