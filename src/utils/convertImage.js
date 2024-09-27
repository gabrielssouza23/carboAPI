export default async function convertImageToBase64(imageBuffer) {
    if (!Buffer.isBuffer(imageBuffer)) {
      throw new Error('O parâmetro fornecido não é um Buffer válido.');
    }
    
    const base64Image = imageBuffer.toString('base64'); // Converte para base64
    console.log('Base64 Image:', base64Image); // Apenas para depuração
    return base64Image; // Retorne a imagem em Base64
  }
  