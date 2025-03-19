import axios from 'axios';
import 'dotenv/config';
import { createSpecie, createContributionModel } from '../models/species.js';

export async function catalogSpecie(data, thumb) {

  const { extraImages } = data;
  let extraImagesUrl = [];

  try {
    // Criação do FormData para enviar a imagem
    const formData = new FormData();
    formData.append('key', process.env.IMGBB_API_KEY); // Sua chave da API
    formData.append('image', thumb); // Sua imagem em base64 ou binária

    // Envio da imagem para ImgBB
    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Verificar a URL retornada pela API ImgBB
    const imageUrl = response.data.data.url; // URL da imagem principal
    console.log('URL da imagem (thumb):', imageUrl);

    for (let i = 0; i < extraImages.length; i++) {
      const formDataExtra = new FormData();
      formDataExtra.append('key', process.env.IMGBB_API_KEY); // Sua chave da API
      formDataExtra.append('image', extraImages[i]); // Sua imagem em base64 ou binária

      const responseExtra = await axios.post('https://api.imgbb.com/1/upload', formDataExtra, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Verificar a URL retornada pela API ImgBB
      extraImagesUrl.push(responseExtra.data.data.url); // URL da imagem principal

    }



    // Chamar a função createSpecie com await e capturar possíveis erros
    try {
      await createSpecie(data, imageUrl, extraImagesUrl); // Passando os dados e a URL da imagem
      console.log('Espécie criada com sucesso:', data, imageUrl);
    } catch (modelError) {
      console.error('Erro ao criar a espécie:', modelError.message);
      throw new Error('Erro ao criar a espécie. ' + modelError.message);
    }

    return {
      data: response.data.data,
      success: response.data.success,
      status: response.data.status,
    };

  } catch (error) {
    console.error('Erro ao enviar para ImgBB:', error.message);
    console.error('Detalhes do erro:', error.response?.data || error);
    throw new Error('Erro ao enviar a imagem para ImgBB');
  }
}

export async function createContribution(data) {
  try {
    // Verificação se data e images estão definidos

    if (!data || !data.images || !data.imagesGps) {
      throw new Error('Dados incompletos: "images" ou "imagesGps" não estão definidos.');
    }

    const { images, imagesGps } = data; // Agora você pode desestruturar com segurança

    console.log("DATA RECEBIDA :::", imagesGps);

    let arrayObjContribuicao = [];
    for (let i = 0; i < images.length; i++) {
      const formData = new FormData();
      formData.append('key', process.env.IMGBB_API_KEY); // Sua chave da API
      formData.append('image', images[i]); // Sua imagem em base64 ou binária
      const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      images[i] = response.data.data.url;

      let objContribuicao = {
        image: images[i],
        latitude: imagesGps[i].latitude,
        longitude: imagesGps[i].longitude,
        date: imagesGps[i].dateFile,
      };

      arrayObjContribuicao.push(objContribuicao);
    }

    return await createContributionModel(data, arrayObjContribuicao);
  } catch (error) {
    console.error('Erro ao enviar para ImgBB:', error.message);
    console.error('Detalhes do erro:', error.response?.data || error);
    throw new Error('Erro ao enviar a imagem para ImgBB');
  }
}

export async function analyzeImage(imageUrl) {
  const invokeUrl = "https://ai.api.nvidia.com/v1/gr/meta/llama-3.2-90b-vision-instruct/chat/completions";
  const stream = true;

  // Verificação da chave de API
  const nvidiaApi = process.env.NVIDIA_API;
  if (!nvidiaApi) {
    throw new Error("Chave da API NVIDIA não configurada.");
  }

  // Validação da URL
  if (!imageUrl || typeof imageUrl !== "string") {
    throw new Error("URL da imagem inválida.");
  }

  const headers = {
    "Authorization": `Bearer ${nvidiaApi}`,
    "Accept": stream ? "text/event-stream" : "application/json"
  };

  const payload = {
    model: "meta/llama-3.2-90b-vision-instruct",
    messages: [
      {
        role: "user",
        content: `A imagem a seguir contém espécies típicas que podem ser encontradas no estado do Rio Grande do Sul, Brasil. Por favor, analise a imagem e forneça uma descrição detalhada, incluindo:
- O nome científico de cada espécie identificada;
- Alguns nomes populares relevantes para a região do Rio Grande do Sul;
- Uma breve descrição das características das espécies e informações sobre seu habitat típico ou comportamento.

Garanta que os nomes e informações sejam pertinentes à fauna e flora do Rio Grande do Sul e responda exclusivamente em português. <img src="${imageUrl}" />`
      }
    ],
    max_tokens: 512,
    temperature: 1.0,
    top_p: 1.0,
    stream: stream
  };

  try {
    const response = await axios.post(invokeUrl, payload, {
      headers: headers,
      responseType: stream ? "stream" : "json"
    });

    if (stream) {
      let result = "";
      response.data.on("data", (chunk) => {
        result += chunk.toString();
      });

      // Aguarda o término do stream
      return new Promise((resolve, reject) => {
        response.data.on("end", () => resolve(result));
        response.data.on("error", (err) => reject(err));
      });
    } else {
      return response.data;
    }
  } catch (error) {
    console.error("Erro ao enviar para análise:", error.message);
    console.error("Detalhes do erro:", error.response?.data || error);
    throw new Error("Erro ao enviar a imagem para análise.");
  }
}



