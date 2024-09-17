import { login } from '../models/admins.js';
import fastify from 'fastify';

  export default async function adminsRoutes(fastify) {

    fastify.post("/admins-login", async (request, reply) => {
      
      try{
        const loginInfo = request.body;

        const loginResult = await login(loginInfo);

        const { data } = loginResult;

           // Verifica se houve erro no login
      if (loginResult.error) {
        // Se houver erro no login, envia a resposta com o status apropriado
        return reply.status(400).send({
          message: loginResult.message,
          mode: loginResult.mode,
        });
      }

        return reply.status(201).send({ message: 'login realizado ', data: data });

      } catch (error){
        return reply.status(500).send({ error: 'Erro ao realizar login', details: error.message });

      }
    
    });
  
  }