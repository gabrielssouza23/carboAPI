import { getAllSpecies, createSpecie, getAllSpeciesCatalog } from '../models/species.js';
import fastify from 'fastify';

  export default async function speciesRoutes(fastify) {
    fastify.get("/species-all", async (request, reply) => {
      
      try{
        const allSpecies = await getAllSpecies();

        return reply.status(200).send(allSpecies);

      } catch (error){
        return reply.status(500).send({ error: 'Erro ao buscar espécies', details: error.message });

      }
    
    });

      fastify.get("/species-all-catalog", async (request, reply) => {
        
        try{
          const allSpeciesCatalog = await getAllSpeciesCatalog();
  
          return reply.status(200).send(allSpeciesCatalog);
  
        } catch (error){
          return reply.status(500).send({ error: 'Erro ao buscar espécies', details: error.message });
  
        }
      
      });

    fastify.post("/specie-create", async (request, reply) => {
      
      try{
        const specie = request.body;

        await createSpecie(specie);

        return reply.status(201).send({ message: 'Espécie criada com sucesso' });

      } catch (error){
        return reply.status(500).send({ error: 'Erro ao criar espécie', details: error.message });

      }
    
    });
  
  }