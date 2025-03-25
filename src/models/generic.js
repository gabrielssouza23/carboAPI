import { sql } from "../dbConn/db.js";

export async function createParticipation(body) {
  // Executar a consulta SQL
  const participation = await sql`
    INSERT INTO participacoes (nome, localizacao, mensagem, contato)
    VALUES (
      ${body.name}, 
      ${body.origin}, 
      ${body.message || null}, 
      ${body.contact || null}
    )
    RETURNING *;
  `;
  
  return participation;
}