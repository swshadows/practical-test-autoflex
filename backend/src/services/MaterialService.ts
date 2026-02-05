import { prisma } from "../lib/prisma";

export type MaterialForAdding = {
	id: number;
	stock_quantity: number;
};
export type Material = MaterialForAdding & {
	name: string;
};

export default class MaterialService {
	async createMaterial(name: string, quantity: number) {
		const material = await prisma.material.create({
			data: {
				name,
				stock_quantity: quantity,
			},
		});
		return material;
	}
	async getAllMaterials() {
		const materials = await prisma.material.findMany();
		return materials;
	}
	async getMaterialById(id: number) {
		const material = await prisma.material.findUnique({
			where: {
				id,
			},
		});
		return material;
	}
	async updateMaterial(id: number, name: string, quantity: number) {
		const material = await prisma.material.update({
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
		const material = await prisma.material.delete({
			where: {
				id,
			},
		});
		return material;
	}
}
