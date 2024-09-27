import axios from 'axios';
import 'dotenv/config';
import { createSpecie } from '../models/species.js';

export async function catalogSpecie(data, thumb) {
  // Certifique-se de que 'data' contém as propriedades esperadas
  console.log('Imagem thumb:', thumb);
  console.log('Dados da espécie:', data); // Isso contém as outras propriedades de data

  try {
    // Criação do FormData para enviar a imagem
    const formData = new FormData();
    // formData.append('key', process.env.IMGBB_API_KEY); // Sua chave da API
    formData.append('key', '7725ca9ebc645660b3ff805605a53dcb'); // Sua chave da API
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

    // Chamar a função createSpecie com await e capturar possíveis erros
    try {
      await createSpecie(data, imageUrl); // Passando os dados e a URL da imagem
      console.log('Espécie criada com sucesso:', data, imageUrl);
    } catch (modelError) {
      console.error('Erro ao criar a espécie:', modelError.message);
      throw new Error('Erro ao criar a espécie. ' + modelError.message);
    }

    return {
      teste: imageUrl,
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


