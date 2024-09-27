import { createSpecie, getAllSpeciesCatalog, getSpecie, getallSpeciesCrud } from '../models/species.js';
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
    const fields = await request.body; // Obtém os campos de texto enviados com o arquivo

    // const fields = {
    //   nomePopular: "Nome Popular",
    //   nomeCientifico: "Nome Científico",
    //   reino: "Reino",
    //   filo: "Filo",
    //   classe: "Classe",
    //   ordem: "Ordem",
    //   familia: "Familia",
    //   genero: "Gênero",
    //   especie: "Espécie",
    //   descricao: "Descrição da espécie"
    // };
  
    // Verifique se os dados estão chegando corretamente
    console.log('Dados recebidos:', request);
  
    const fileData = await request.file(); // Obtém o arquivo enviado
  
    if (!fileData) {
      return reply.status(400).send({ error: 'Nenhum arquivo foi enviado' });
    }
  
    const chunks = [];
  
    // Lê o arquivo em partes
    fileData.file.on('data', (chunk) => {
      chunks.push(chunk);
    });
  
    return new Promise((resolve, reject) => {
      fileData.file.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const thumbBase64 = buffer.toString('base64'); // Converte para base64
  
          // Passa os dados para a função catalogSpecie
          const response = await catalogSpecie(fields, thumbBase64); // Use 'fields' aqui
  
          // Ajuste a resposta para o formato desejado
          const formattedResponse = {
            teste: response.teste,
            data: response.data,
            success: true,
            status: response.status || 200
          };
  
          resolve(reply.status(201).send(formattedResponse));
        } catch (error) {
          reject(reply.status(500).send({ error: 'Erro ao criar espécie', details: error.message }));
        }
      });
  
      // Tratamento de erro
      fileData.file.on('error', (error) => {
        reject(reply.status(500).send({ error: 'Erro ao processar o arquivo', details: error.message }));
      });
    });
  });
  
  
  fastify.get("/specie-contributions/:specieId", async (request, reply) => {
    try {
      const contributions = await getSpecieContributions(request.params.specieId);
      return reply.status(200).send(contributions);
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao buscar espécies', details: error.message });
    }
  });
}
