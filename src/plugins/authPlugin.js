import fp from "fastify-plugin";
import jwt from 'jsonwebtoken';

export default fp(async function (fastify, opts) {
  // Middleware de autenticação
  fastify.decorate("authenticate", async function(request, reply) {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        reply.code(401).send({ error: "Token não fornecido" });
        return;
      }

      const token = authHeader.split(' ')[1]; // Assumindo formato 'Bearer token'
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Adiciona o payload decodificado à requisição
      request.user = decoded;
    } catch (err) {
      reply.code(401).send({ error: "Token inválido ou expirado" });
    }
  });
});
