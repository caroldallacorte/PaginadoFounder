import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    // Verificar se o diretório de uploads existe
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const file = files.file;
      if (!file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      // Caminho do arquivo
      const filePath = `/uploads/${path.basename(file.filepath)}`;
      
      return res.status(200).json({ 
        success: true, 
        filePath 
      });
    });
  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({ error: error.message });
  }
}