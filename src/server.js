import Fastify from "fastify";
import getAllRoutes from "./routes/index.js";
import cors from '@fastify/cors'
import authPlugin from './plugins/authPlugin.js'; // O plugin que criamos
import fastifyMultipart from '@fastify/multipart';

const fastify = Fastify({
  logger: true,
  bodyLimit: 10485760 // 10 MB (o valor é em bytes)
});

fastify.register(cors, {
  origin: '*', 
});

// Registre o plugin de autenticação
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
