import { createSpecie, getAllSpeciesCatalog, getSpecie, getallSpeciesCrud, getSpecieLocations } from '../models/species.js';
import { catalogSpecie } from '../controllers/species.js';
import fastify from 'fastify';

export default async function speciesRoutes(fastify) {
  fastify.get("/specie/:specieId", async (request, reply) => {
    try {
      const specie = await getSpecie(request.params.specieId);
      return reply.status(200).send(specie);
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao buscar espécies', details: error.message });
    }
  });

  fastify.get("/species-all-catalog", async (request, reply) => {
    try {
      const allSpeciesCatalog = await getAllSpeciesCatalog();
      return reply.status(200).send(allSpeciesCatalog);
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao buscar espécies', details: error.message });
    }
  });

  fastify.get("/species-all-crud", async (request, reply) => {
    try {
      const allSpeciesCrud = await getallSpeciesCrud();
      return reply.status(200).send(allSpeciesCrud);
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao buscar espécies', details: error.message });
    }
  });


  fastify.post("/specie-create", {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      console.log(request.body);
      const thumbBase64 = request.body.thumb; // Obtém a imagem em base64
  
      // Passa os dados para a função catalogSpecie
      const response = await catalogSpecie(request.body, thumbBase64);
  
      // Formata a resposta
      const formattedResponse = {
        teste: response.teste,
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
  
  
      fastify.get("/specie-contributions/:specieId", async (request, reply) => {
        try {
          const contributions = await getSpecieContributions(request.params.specieId);
          return reply.status(200).send(contributions);
        } catch (error) {
          return reply.status(500).send({ error: 'Erro ao buscar espécies', details: error.message });
        }
      });
  // Rota para buscar localizações de uma espécie
  fastify.get("/specie-locations/:specieId", async (request, reply) => {
    try {
      const locations = await getSpecieLocations(request.params.specieId);
      return reply.status(200).send(locations);
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao buscar localizações', details: error.message });
    }
  });
  }
  
  
  

