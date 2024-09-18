import Fastify from "fastify";
import getAllRoutes from "./routes/index.js";
import cors from '@fastify/cors'

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: '*', 
});

// fastify.addHook("onRequest", onRequest);

for (const { prefix, route } of getAllRoutes()) {
  await fastify.register(route, { prefix });
}

export default async function bootstrap() {
  try {
    await fastify.listen({ port: 3333});
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}