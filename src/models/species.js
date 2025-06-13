import { randomUUID } from "node:crypto"
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function getSpecie(id) {
  try {
    const specie = await prisma.especies.findUnique({
      where: { id },
      include: {
        speciesimage: true,
        speciereferences: true
      }
    });
    if (!specie) {
      return {
        error: true,
        mode: "warning",
        data: [],
        message: "No species available",
      };
    }
    return {
      ...specie,
      all_images: specie.speciesimage.map(img => img.speciesimage).join(', '),
      all_references: specie.speciereferences.map(ref => ref.reference).join('; ')
    };
  } catch (error) {
    return {
      error: true,
      mode: "error",
      data: [],
      message: "Erro ao buscar espécie: " + error.message,
    };
  }
}

export async function getSpecieLocations(id) {
  try {
    const locations = await prisma.speciecontributionimg.findMany({
      where: { specieid: id },
      select: { latitude: true, longitude: true }
    });
    if (!locations || locations.length === 0) {
      return {
        error: true,
        mode: "warning",
        data: [],
        message: "No locations available",
      };
    }
    const locationObj = locations.map(location => ({
      latitude: location.latitude,
      longitude: location.longitude
    }));
    return {
      error: false,
      data: locationObj
    };
  } catch (error) {
    return {
      error: true,
      mode: "error",
      data: [],
      message: "Erro ao buscar localizações: " + error.message,
    };
  }
}

export async function getSpecieContributions(id) {
  try {
    const contributions = await prisma.speciecontributionimg.findMany({
      where: { specieid: id },
      select: { image: true }
    });
    if (!contributions || contributions.length === 0) {
      return {
        error: true,
        mode: "warning",
        data: [],
        message: "No contributions available",
      };
    }
    return {
      all_images: contributions.map(c => c.image).join(', ')
    };
  } catch (error) {
    return {
      error: true,
      mode: "error",
      data: [],
      message: "Erro ao buscar contribuições: " + error.message,
    };
  }
}

export async function getAllSpeciesCatalog(limit, offset) {
  try {
    const allSpeciesCatalog = await prisma.especies.findMany({
      select: {
        id: true,
        nomepopular: true,
        nomecientifico: true,
        catalogthumb: true
      },
      skip: offset,
      take: limit
    });
    if (!allSpeciesCatalog || allSpeciesCatalog.length === 0) {
      return {
        error: true,
        mode: "warning",
        data: [],
        message: "No species available",
      };
    }
    return allSpeciesCatalog;
  } catch (error) {
    return {
      error: true,
      mode: "error",
      data: [],
      message: "Erro ao buscar catálogo: " + error.message,
    };
  }
}

export async function getSpecieCount() {
  try {
    const count = await prisma.especies.count();
    return count;
  } catch (error) {
    return 0;
  }
}

export async function getallSpeciesCrud() {
  try {
    const allSpecies = await prisma.especies.findMany();
    if (!allSpecies || allSpecies.length === 0) {
      return {
        error: true,
        mode: "warning",
        data: [],
        message: "No species available",
      };
    }
    return allSpecies;
  } catch (error) {
    return {
      error: true,
      mode: "error",
      data: [],
      message: "Erro ao buscar espécies: " + error.message,
    };
  }
}

export async function createSpecie(specie, thumb, extraImagesUrl) {
  const specieId = randomUUID();
  const {
    nomePopular,
    nomeCientifico,
    reino,
    filo,
    classe,
    ordem,
    familia,
    genero,
    especie: especieField,
    descricao,
    references
  } = specie;
  try {
    await prisma.especies.create({
      data: {
        id: specieId,
        nomepopular: nomePopular,
        nomecientifico: nomeCientifico,
        reino,
        filo,
        classe,
        ordem,
        familia,
        genero,
        especie: especieField,
        descricao,
        catalogthumb: thumb,
        speciereferences: {
          create: references.map(ref => ({ reference: ref }))
        },
        speciesimage: {
          create: extraImagesUrl.map(img => ({ speciesimage: img }))
        }
      }
    });
    return { success: true, message: "Espécie criada com sucesso." };
  } catch (error) {
    return {
      error: true,
      mode: "error",
      message: "Erro ao criar a espécie. " + error.message,
    };
  }
}

export async function createContributionModel(data, contributionObj) {
  const { name, email, location, date, phone } = data;
  try {
    for (let i = 0; i < contributionObj.length; i++) {
      let dateContribution = contributionObj[i].date;
      if (dateContribution === 'N/A') {
        dateContribution = date;
      }
      if (contributionObj[i].longitude === 'N/A') {
        contributionObj[i].longitude = null;
        contributionObj[i].latitude = null;
      }
      await prisma.speciecontributionimg.create({
        data: {
          image: contributionObj[i].image,
          latitude: contributionObj[i].latitude,
          longitude: contributionObj[i].longitude,
          data: dateContribution ? new Date(dateContribution) : undefined,
          email,
          location,
          phone,
          exibir: 'Não',
          name
        }
      });
    }
    return { success: true, message: "Contribuição criada com sucesso." };
  } catch (error) {
    return {
      error: true,
      mode: "error",
      message: "Erro ao criar a contribuição. " + error.message,
    };
  }
}

