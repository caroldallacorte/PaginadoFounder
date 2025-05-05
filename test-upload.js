import React, { useState } from 'react';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';
import ImageUploader from '../src/components/ImageUploader';

const TestUpload = () => {
  const [uploadedFile, setUploadedFile] = useState('');

  const handleUploadSuccess = (filePath) => {
    setUploadedFile(filePath);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Teste de Upload de Imagens
      </Typography>
      
      <ImageUploader onUploadSuccess={handleUploadSuccess} />
      
      {uploadedFile && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Arquivo enviado com sucesso!
          </Typography>
          <Typography variant="body1">
            Caminho: {uploadedFile}
          </Typography>
          {uploadedFile.match(/\.(jpg|jpeg|png|gif)$/i) && (
            <Paper elevation={3} sx={{ mt: 2, p: 2, maxWidth: 500 }}>
              <img 
                src={uploadedFile} 
                alt="Uploaded file" 
                style={{ maxWidth: '100%' }} 
              />
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TestUpload;
