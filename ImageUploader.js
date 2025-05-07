import React, { useState } from 'react';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';

const ImageUploader = ({ onUploadSuccess, label = "Selecionar Imagem", acceptedFormats = "image/jpeg, image/png, application/pdf" }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Verificar tipo de arquivo
    if (!file.type.match(acceptedFormats.replace(/\s/g, '').split(',').join('|'))) {
      setError(`Formato de arquivo não suportado. Por favor, use ${acceptedFormats}.`);
      return;
    }

    // Verificar tamanho (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. O tamanho máximo é 5MB.');
      return;
    }

    setSelectedFile(file);
    setError('');

    // Criar preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      setPreview('/uploads/pdf-icon.png');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setLoading(false);
        if (onUploadSuccess) {
          onUploadSuccess(response.data.filePath);
        }
      }
    } catch (error) {
      setError('Erro ao fazer upload do arquivo. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>
      
      <input
        accept={acceptedFormats}
        style={{ display: 'none' }}
        id="upload-file"
        type="file"
        onChange={handleFileChange}
      />
      
      <label htmlFor="upload-file">
        <Button variant="contained" component="span" color="primary">
          Escolher Arquivo
        </Button>
      </label>
      
      {selectedFile && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
          </Typography>
          
          {preview && (
            <Paper 
              elevation={2} 
              sx={{ 
                mt: 2, 
                p: 1, 
                maxWidth: 200, 
                maxHeight: 200, 
                display: 'flex', 
                justifyContent: 'center' 
              }}
            >
              <img 
                src={preview} 
                alt="Preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '180px', 
                  objectFit: 'contain' 
                }} 
              />
            </Paper>
          )}
          
          <Button 
            variant="contained" 
            color="success" 
            onClick={handleUpload} 
            disabled={loading} 
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </Box>
      )}
      
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUploader;
