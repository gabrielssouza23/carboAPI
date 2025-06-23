import { createHash } from "node:crypto";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { PrismaClient } from "../generated/prisma/index.js";

const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new PrismaClient();

export async function login(loginInfo) {
  const { email, senha } = loginInfo;

  // Gerar o hash SHA-512 da senha fornecida
  const hashedPassword = createHash("sha512").update(senha).digest("hex");

  // Verificar o email no banco de dados
  const authEmail = await prisma.admins.findUnique({
    where: { email }
  });

  if (!authEmail) {
    return {
      error: true,
      mode: "warning",
      data: [],
      message: "Email não cadastrado",
    };
  }

  // Comparar o hash da senha
  const storedHash = authEmail.senha;

  if (hashedPassword !== storedHash) {
    return {
      error: true,
      mode: "warning",
      data: [],
      message: "Senha incorreta",
    };
  }

  // Gerar JWT
  const token = jwt.sign(
    { id: authEmail.id, email: authEmail.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    error: false,
    mode: "success",
    data: {
      id: authEmail.id,
      email: authEmail.email,
      token: token,
    },
    message: "Login realizado",
  };
}
