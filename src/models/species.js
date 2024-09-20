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

export async function getAllSpeciesCatalog() {
  // rodar e montar query aqui nessa bosta

  // const allSpeciesCatalog = await sql`SELECT e.id, e.nomePopular, e.nomeCientifico, STRING_AGG(si.speciesImage, ', ') AS all_images FROM especies e JOIN speciesImage si ON e.id = si.specieId GROUP BY e.id, e.nomePopular, e.nomeCientifico;`;

  const allSpeciesCatalog = await sql`SELECT e.id, e.nomePopular, e.nomeCientifico, e.catalogThumb thumb FROM especies e;`;

  if (allSpeciesCatalog.length === 0) {
      return {
        error: true,
        mode: "warning",
        data: [],
        message: "No species available",
      };
    }

  return allSpeciesCatalog;
}

export async function createSpecie(specie){
    const specieId = randomUUID();

    const { nomePopular, nomeCientifico, reino, filo, classe, ordem, familia, genero, especie, descricao} = specie;

    await sql`INSERT INTO especies (id, nomePopular, nomeCientifico, reino, filo, classe, ordem, familia, genero, especie, descricao)
    VALUES (
    ${specieId}, ${nomePopular}, ${nomeCientifico}, ${reino}, ${filo}, ${classe}, ${ordem}, ${familia}, ${genero}, ${especie}, ${descricao}         
    );`
}