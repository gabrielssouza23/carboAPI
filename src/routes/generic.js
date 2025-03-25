import { createParticipation } from '../models/generic.js'

export default async function speciesRoutes(fastify) {

fastify.post("/participacao", {
  }, async (request, reply) => {
    try {
      const response = await createParticipation(request.body);
  
      // Formata a resposta
      const formattedResponse = {
        data: response.data,
        success: true,
        status: response.status || 200
      };
  
      // Envia a resposta de sucesso
      return reply.status(201).send(formattedResponse);
    } catch (error) {
      // Envia a resposta de erro
      return reply.status(500).send({ error: 'Erro ao criar espécie', details: error.message });
    }
  });
}