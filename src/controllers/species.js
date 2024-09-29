import axios from 'axios';
import 'dotenv/config';
import { createSpecie } from '../models/species.js';

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


