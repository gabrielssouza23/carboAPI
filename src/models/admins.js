import { sql } from "../dbConn/db.js";
import { createHash } from "node:crypto";
import jwt from 'jsonwebtoken';


export async function login(loginInfo) {
  const { email, senha } = loginInfo;

  // Gerar o hash SHA-512 da senha fornecida
  const hashedPassword = createHash("sha512").update(senha).digest("hex");

  // Verificar o email no banco de dados
  const authEmail = await sql`SELECT * FROM admins WHERE email = ${email};`;

  if (authEmail.length === 0) {
    return {
      error: true,
      mode: "warning",
      data: [],
      message: "Email não cadastrado",
    };
  }

  // Comparar o hash da senha
  const storedHash = authEmail[0].senha;

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
    { id: authEmail[0].id, email: authEmail[0].email },
    JWT_SECRET,
    { expiresIn: "1h" } // Define o tempo de expiração do token
  );

  return {
    error: false,
    mode: "success",
    data: {
      id: authEmail[0].id,
      email: authEmail[0].email,
      token: token, // Adiciona o token ao retorno
    },
    message: "Login realizado",
  };
}
