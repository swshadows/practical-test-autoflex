import { type FastifyInstance, type FastifyReply, type FastifyRequest } from "fastify";

// Teste
export function testRoutes(fastify: FastifyInstance) {
	fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
		return reply.send({ hello: "world" });
	});
}

// Produtos
export function productRoutes(fastify: FastifyInstance) {}

// Matérias-primas
export function materialRoutes(fastify: FastifyInstance) {}
