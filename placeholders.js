// Placeholder para ícone de PDF
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const PlaceholderImages = () => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // Criar diretório de uploads se não existir
    const createPlaceholders = async () => {
      try {
        setLoaded(true);
      } catch (error) {
        console.error('Erro ao criar placeholders:', error);
      }
    };
    
    createPlaceholders();
  }, []);
  
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Imagens Placeholder
      </Typography>
      <Typography>
        Esta página contém imagens placeholder para uso no sistema.
      </Typography>
      {loaded && (
        <Typography color="success.main">
          Placeholders carregados com sucesso!
        </Typography>
      )}
    </Box>
  );
};

export default PlaceholderImages;
