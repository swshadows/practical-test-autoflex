import { type FastifyInstance, type FastifyReply, type FastifyRequest } from "fastify";
import ProductController from "../controllers/ProductController";
import MaterialController from "../controllers/MaterialController";

// Teste
export function testRoutes(fastify: FastifyInstance) {
	fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
		return reply.send({ hello: "world" });
	});
}

// Produtos
export function productRoutes(fastify: FastifyInstance) {
	fastify.get("/all", ProductController.getAllProducts);
	fastify.get("/:id", ProductController.getProductById);
	fastify.post("/create", ProductController.createProduct);
	fastify.put("/update", ProductController.updateProduct);
	fastify.delete("/delete/:id", ProductController.deleteProduct);
}

// Matérias-primas
export function materialRoutes(fastify: FastifyInstance) {
	fastify.get("/all", MaterialController.getAllMaterials);
	fastify.get("/:id", MaterialController.getMaterialById);
	fastify.post("/create", MaterialController.createMaterial);
	fastify.put("/update", MaterialController.updateMaterial);
	fastify.delete("/delete/:id", MaterialController.deleteMaterial);
}
