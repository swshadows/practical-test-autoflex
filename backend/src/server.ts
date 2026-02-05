import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { testRoutes, productRoutes, materialRoutes } from "./routes/routes.js";

const server = fastify();

server.register(fastifyCors, { origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] });

server.register(testRoutes, { prefix: "/" });
server.register(productRoutes, { prefix: "/products" });
server.register(materialRoutes, { prefix: "/materials" });

server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
