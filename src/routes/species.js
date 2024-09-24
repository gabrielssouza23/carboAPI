import { createSpecie, getAllSpeciesCatalog, getSpecie, getSpecieContributions, getSpecieLocations } from '../models/species.js';
import fastify from 'fastify';

  export default async function speciesRoutes(fastify) {
    fastify.get("/specie/:specieId", async (request, reply) => {
      
      try{
        const specie = await getSpecie(request.params.specieId);

        return reply.status(200).send(specie);

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

    fastify.get("/specie-contributions/:specieId", async (request, reply) => {
      
      try{
        const contributions = await getSpecieContributions(request.params.specieId);

        return reply.status(200).send(contributions);

      } catch (error){
        return reply.status(500).send({ error: 'Erro ao buscar espécies', details: error.message });

      }
    
    });

    fastify.get("/specie-locations/:specieId", async (request, reply) => {
      
      try{
        const locations = await getSpecieLocations(request.params.specieId);

        return reply.status(200).send(locations);

      } catch (error){
        return reply.status(500).send({ error: 'Erro ao buscar espécies', details: error.message });

      }
    
    });
  
  }