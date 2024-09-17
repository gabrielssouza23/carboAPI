import Fastify from "fastify";
import getAllRoutes from "./routes/index.js";

const fastify = Fastify({
  logger: true,
});

// fastify.addHook("onRequest", onRequest);

for (const { prefix, route } of getAllRoutes()) {
  await fastify.register(route, { prefix });
}

export default async function bootstrap() {
    // fastify.listen(
    //     {
    //         port: 3333,
            
    //     }
    // )
  try {
    await fastify.listen({ port: 3333});
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}