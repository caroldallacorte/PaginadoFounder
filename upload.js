// Middleware para processar uploads de imagens
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

// Configurar o diretório de uploads
const uploadDir = path.join(process.cwd(), 'public/uploads');

// Garantir que o diretório existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar o armazenamento para o multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Criar um nome de arquivo único com timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtro para permitir apenas imagens e PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos JPG, PNG e PDF são permitidos!'), false);
  }
};

// Configuração do multer
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5MB
  }
});

// Função para processar o upload
export const uploadMiddleware = upload.single('file');

// Função para lidar com erros do multer
export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Handler para a API de upload
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    await runMiddleware(req, res, uploadMiddleware);
    
    // Se não houver arquivo
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado' });
    }
    
    // Retornar o caminho do arquivo salvo
    const filePath = `/uploads/${req.file.filename}`;
    return res.status(200).json({ 
      message: 'Arquivo enviado com sucesso',
      filePath: filePath
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    return res.status(500).json({ 
      message: error.message || 'Erro no servidor durante o upload' 
    });
  }
}
