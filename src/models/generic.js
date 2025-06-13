import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function createParticipation(body) {
  const participation = await prisma.participacoes.create({
    data: {
      nome: body.name,
      localizacao: body.origin,
      mensagem: body.message || null,
      contato: body.contact || null
    }
  });
  return participation;
}