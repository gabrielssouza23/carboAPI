import { sql } from "../dbConn/db.js";
import { randomUUID } from "node:crypto"


export async function getSpecie(id) {
  // Executar a consulta SQL
  const specie = await sql`
    SELECT e.*, STRING_AGG(si.speciesImage, ', ') AS all_images, STRING_AGG(sr.reference, '; ') AS all_references
    FROM especies e 
    JOIN speciesImage si ON e.id = si.specieId join specieReferences sr on e.id = sr.specieId
        WHERE e.id = ${id} 
    GROUP BY e.id, e.nomePopular, e.nomeCientifico;
  `;

  // Verificar se a consulta retornou resultados
  if (specie.length === 0) {
    return {
      error: true,
      mode: "warning",
      data: [],
      message: "No species available",
    };
  }

  return specie[0]; // Retornar o primeiro elemento se houver resultados
}

export async function getSpecieContributions(id) {
  // Executar a consulta SQL
  const contributions = await sql`
    SELECT e.*, STRING_AGG(si.speciesImage, ', ') AS all_images, STRING_AGG(sr.reference, '; ') AS all_references
    FROM especies e 
    JOIN speciesImage si ON e.id = si.specieId join specieReferences sr on e.id = sr.specieId
        WHERE e.id = ${id} 
    GROUP BY e.id, e.nomePopular, e.nomeCientifico;
  `;

  // Verificar se a consulta retornou resultados
  if (contributions.length === 0) {
    return {
      error: true,
      mode: "warning",
      data: [],
      message: "No contributions available",
    };
  }

  return contributions[0]; // Retornar o primeiro elemento se houver resultados
}

export async function getAllSpeciesCatalog() {
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

export async function getallSpeciesCrud() {

  const getallSpeciesCrud = await sql`SELECT e.* FROM especies e;`;

  if (getallSpeciesCrud.length === 0) {
      return {
        error: true,
        mode: "warning",
        data: [],
        message: "No species available",
      };
    }

  return getallSpeciesCrud;
}

export async function createSpecie(specie, thumb) {
  const specieId = randomUUID();

  // Desestruturando as propriedades do objeto specie
  const { 
    nomePopular, 
    nomeCientifico, 
    reino, 
    filo, 
    classe, 
    ordem, 
    familia, 
    genero, 
    especie: especieField, // Renomeando a propriedade 'especie' para 'especieField'
    descricao 
  } = specie;

  try {
    await sql`
      INSERT INTO especies (
        id, nomePopular, nomeCientifico, reino, filo, classe, ordem, familia, genero, especie, descricao, catalogThumb
      ) VALUES (
        ${specieId}, ${nomePopular}, ${nomeCientifico}, ${reino}, ${filo}, ${classe}, ${ordem}, ${familia}, ${genero}, ${especieField}, ${descricao}, ${thumb}
      );
    `;
    return { success: true, message: "Espécie criada com sucesso." };
  } catch (error) {
    console.error('Erro ao criar a espécie:', error.message);
    return {
      error: true,
      mode: "error",
      message: "Erro ao criar a espécie. " + error.message,
    };
  }
}

