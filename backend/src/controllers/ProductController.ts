import { type FastifyReply, type FastifyRequest } from "fastify";
import ProductService from "../services/ProductService";
import type { Material, MaterialForAdding } from "../services/MaterialService";
const productService = new ProductService();

export default class ProductController {
	static async createProduct(
		request: FastifyRequest<{ Body: { name: string; value: number; materials: Material[] } }>,
		reply: FastifyReply,
	) {
		const { name = null, value = null, materials = [] } = request.body ?? {};
		if (!name || !value) {
			return reply.code(400).send({ error: "Name and value are required" });
		}
		if (materials.length === 0) {
			return reply.code(400).send({ error: "Materials are required" });
		}

		const product = await productService.createProduct(name, value, materials);
		return product;
	}
	static async getAllProducts(request: FastifyRequest, reply: FastifyReply) {
		const products = await productService.getAllProducts();
		return products;
	}
	static async getProductById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
		const { id = null } = request.params ?? {};
		if (!id) {
			return reply.code(400).send({ error: "Id is required" });
		}
		const product = await productService.getProductById(Number(id));
		return product;
	}
	static async updateProduct(
		request: FastifyRequest<{ Body: { id: string; name: string; value: number; materials: MaterialForAdding[] } }>,
		reply: FastifyReply,
	) {
		const { id = null, name = null, value = null, materials = [] } = request.body ?? {};
		if (!id || !name || !value) {
			return reply.code(400).send({ error: "Id, name and value are required" });
		}
		if (materials.length === 0) {
			return reply.code(400).send({ error: "Materials are required" });
		}
		const product = await productService.updateProduct(Number(id), name, value, materials);
		return product;
	}
	static async deleteProduct(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
		const { id = null } = request.params ?? {};
		if (!id) {
			return reply.code(400).send({ error: "Id is required" });
		}
		const product = await productService.deleteProduct(Number(id));
		return product;
	}
}
