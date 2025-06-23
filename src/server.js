import Fastify from "fastify";
import getAllRoutes from "./routes/index.js";
import cors from '@fastify/cors'
import authPlugin from './plugins/authPlugin.js';
import fastifyMultipart from '@fastify/multipart';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

const fastify = Fastify({
  logger: true,
  bodyLimit: 100 * 1024 * 1024, // 100 MB
});

fastify.register(cors, {
  origin: '*', 
});

// Swagger
fastify.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'CarboAPI',
      description: 'Documentação da API da Carbonífera',
      version: '1.0.0',
    },
    servers: [
      { url: 'http://localhost:3333', description: 'Servidor local' }
    ],
  },
});
fastify.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

fastify.register(authPlugin);
fastify.register(fastifyMultipart);

for (const { prefix, route } of getAllRoutes()) {
  await fastify.register(route, { prefix });
}

export default async function bootstrap() {
  try {
    const port = process.env.PORT || 3333; // Usa a porta atribuída pelo Render ou a 3333 como fallback
    await fastify.listen({ port, host: '0.0.0.0' }); // Define o host como '0.0.0.0'
  } catch (err) {
    fastify.log.error(err);
    process.exit(1); // Encerra o processo em caso de erro
  }
}
