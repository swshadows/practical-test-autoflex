import type { FastifyReply, FastifyRequest } from "fastify";
import MaterialService from "../services/MaterialService";
const materialService = new MaterialService();
export default class MaterialController {
	static async createMaterial(
		request: FastifyRequest<{ Body: { name: string; stock_quantity: number } }>,
		reply: FastifyReply,
	) {
		const { name = null, stock_quantity = null } = request.body ?? {};
		if (!name || !stock_quantity) {
			return reply.code(400).send({ error: "Name and stock_quantity are required" });
		}
		const material = await materialService.createMaterial(name, stock_quantity);
		return material;
	}
	static async getAllMaterials(request: FastifyRequest, reply: FastifyReply) {
		const materials = await materialService.getAllMaterials();
		return materials;
	}
	static async getMaterialById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
		const { id = null } = request.params ?? {};
		if (!id) {
			return reply.code(400).send({ error: "Id is required" });
		}
		const material = await materialService.getMaterialById(Number(id));
		return material;
	}

	static async updateMaterial(
		request: FastifyRequest<{ Body: { id: string; name: string; stock_quantity: number } }>,
		reply: FastifyReply,
	) {
		const { id = null, name = null, stock_quantity = null } = request.body ?? {};
		if (!id || !name || !stock_quantity) {
			return reply.code(400).send({ error: "Id, name and stock_quantity are required" });
		}
		const material = await materialService.updateMaterial(Number(id), name, stock_quantity);
		return material;
	}
	static async deleteMaterial(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
		const { id = null } = request.params ?? {};
		if (!id) {
			return reply.code(400).send({ error: "Id is required" });
		}
		const material = await materialService.deleteMaterial(Number(id));
		return material;
	}
}
