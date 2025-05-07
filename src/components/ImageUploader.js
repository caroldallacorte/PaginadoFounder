import React, { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ImageUploader = ({ onUploadSuccess, initialImage = null }) => {
  const [imagePreview, setImagePreview] = useState(initialImage);
  const [error, setError] = useState('');

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Verificar o tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de arquivo não permitido. Use JPEG, PNG ou PDF.');
      return;
    }

    // Verificar o tamanho do arquivo (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setError('O arquivo é muito grande. O tamanho máximo é 5MB.');
      return;
    }

    setError('');

    // Criar preview da imagem usando FileReader
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setImagePreview(dataUrl);
      
      // Simular um caminho de arquivo para o callback
      const simulatedPath = `data-url-${Date.now()}`;
      
      // Chamar o callback com o dataUrl como caminho
      if (onUploadSuccess) {
        onUploadSuccess(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Logo do Parceiro
      </Typography>

      <input
        accept="image/jpeg,image/png,application/pdf"
        style={{ display: 'none' }}
        id="logo-upload"
        type="file"
        onChange={handleUpload}
      />

      <label htmlFor="logo-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          Selecionar Arquivo
        </Button>
      </label>

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      {imagePreview && (
        <Paper elevation={2} sx={{ mt: 2, p: 2, maxWidth: 200 }}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: 150, objectFit: 'contain' }}
          />
        </Paper>
      )}
    </Box>
  );
};

export default ImageUploader;