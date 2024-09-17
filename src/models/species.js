import { sql } from "../dbConn/db.js";
import { randomUUID } from "node:crypto"


export async function getAllSpecies() {
    // rodar e montar query aqui nessa bosta

    const allSpecies = await sql`SELECT * FROM especies;`;

    if (allSpecies.length === 0) {
        return {
          error: true,
          mode: "warning",
          data: [],
          message: "No species available",
        };
      }

    return allSpecies;
}

export async function createSpecie(specie){
    const specieId = randomUUID();

    const { nomePopular, nomeCientifico, reino, filo, classe, ordem, familia, genero, especie, descricao} = specie;

    await sql`INSERT INTO especies (id, nomePopular, nomeCientifico, reino, filo, classe, ordem, familia, genero, especie, descricao)
    VALUES (
    ${specieId}, ${nomePopular}, ${nomeCientifico}, ${reino}, ${filo}, ${classe}, ${ordem}, ${familia}, ${genero}, ${especie}, ${descricao}         
    );`
}