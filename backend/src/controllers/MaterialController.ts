import type { FastifyReply, FastifyRequest } from "fastify";
import MaterialService from "../services/MaterialService";
const materialService = new MaterialService();
export default class MaterialController {
	static async createMaterial(
		request: FastifyRequest<{ Body: { name: string; quantity: number } }>,
		reply: FastifyReply,
	) {
		const { name = null, quantity = null } = request.body ?? {};
		if (!name || !quantity) {
			return reply.code(400).send({ error: "Name and quantity are required" });
		}
		const material = await materialService.createMaterial(name, quantity);
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
		request: FastifyRequest<{ Body: { id: string; name: string; quantity: number } }>,
		reply: FastifyReply,
	) {
		const { id = null, name = null, quantity = null } = request.body ?? {};
		if (!id || !name || !quantity) {
			return reply.code(400).send({ error: "Id, name and quantity are required" });
		}
		const material = await materialService.updateMaterial(Number(id), name, quantity);
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
