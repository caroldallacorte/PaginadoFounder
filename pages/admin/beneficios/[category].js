import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageUploader from '../../../src/components/ImageUploader';
import { useAuth } from '../../../contexts/AuthContext';
import { useBenefits } from '../../../hooks/useBenefits';

// Mapeamento de slugs para nomes de exibição
const categoriasNomes = {
  'marketing-vendas': 'Marketing/Vendas',
  'cs-suporte': 'CS/Suporte',
  'gestao-adm': 'Gestão/ADM',
  'cloud-tech': 'Cloud/Tech',
  'people': 'People'
};

export default function BeneficiosCategoria() {
  const router = useRouter();
  const { category } = router.query;
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { benefits, isLoading, error, addBenefit, updateBenefit, deleteBenefit } = useBenefits(category);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState(null);
  const [formData, setFormData] = useState({
    parceiro: '',
    descricao: '',
    beneficio: '',
    comoAtivar: '',
    logo: ''
  });

  // Get the display name for the category
  const categoriaNome = categoriasNomes[category] || category;

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleOpenDialog = (benefit = null) => {
    if (benefit) {
      // Modo edição
      setEditingBenefit(benefit);
      setFormData({
        id: benefit.id,
        parceiro: benefit.parceiro,
        descricao: benefit.descricao,
        beneficio: benefit.beneficio,
        comoAtivar: benefit.como_ativar, // Note: DB uses snake_case
        logo: benefit.logo
      });
    } else {
      // Modo adição
      setEditingBenefit(null);
      setFormData({
        parceiro: '',
        descricao: '',
        beneficio: '',
        comoAtivar: '',
        logo: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLogoUpload = (filePath) => {
    setFormData({
      ...formData,
      logo: filePath
    });
  };

  const handleSave = async () => {
    try {
      if (editingBenefit) {
        // Update existing benefit
        await updateBenefit(formData);
      } else {
        // Add new benefit
        await addBenefit(formData);
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving benefit:', err);
      // Show error to user
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este benefício?')) {
      try {
        await deleteBenefit(id);
      } catch (err) {
        console.error('Error deleting benefit:', err);
        // Show error to user
      }
    }
  };

  // If category is undefined (during initial load) or auth is loading, show loading spinner
  if (!category || authLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Painel de Administração</Typography>
        <Box>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => router.push('/')}
            sx={{ mr: 2 }}
          >
            Ver Site
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={logout}
          >
            Sair
          </Button>
        </Box>
      </Box>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => router.push('/admin/dashboard')}
          sx={{ mb: 3 }}
        >
          Voltar para o painel
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Gerenciar Benefícios: {categoriaNome}
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleOpenDialog()}
          sx={{ mt: 2, mb: 4 }}
        >
          Adicionar Novo Benefício
        </Button>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">Erro ao carregar benefícios: {error}</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell>Logo</TableCell>
                  <TableCell>Parceiro</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Benefício</TableCell>
                  <TableCell>Como Ativar</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {benefits.map((benefit) => (
                  <TableRow key={benefit.id}>
                    <TableCell>
                      {benefit.logo ? (
                        <img 
                          src={benefit.logo} 
                          alt={`Logo ${benefit.parceiro}`} 
                          style={{ maxWidth: 50, maxHeight: 50, objectFit: 'contain' }} 
                        />
                      ) : (
                        <Box sx={{ width: 50, height: 50, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="caption" color="text.secondary">Sem logo</Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>{benefit.parceiro}</TableCell>
                    <TableCell>{benefit.descricao}</TableCell>
                    <TableCell>{benefit.beneficio}</TableCell>
                    <TableCell>{benefit.como_ativar}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleOpenDialog(benefit)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(benefit.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {benefits.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Nenhum benefício cadastrado para esta categoria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
      
      {/* Diálogo para adicionar/editar benefício */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingBenefit ? 'Editar Benefício' : 'Adicionar Novo Benefício'}
        </DialogTitle>
        <DialogContent>
          <ImageUploader 
            onUploadSuccess={handleLogoUpload} 
            initialImage={formData.logo || null}
          />
          
          <TextField
            autoFocus
            margin="dense"
            name="parceiro"
            label="Parceiro"
            type="text"
            fullWidth
            value={formData.parceiro}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="descricao"
            label="Descrição"
            type="text"
            fullWidth
            value={formData.descricao}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="beneficio"
            label="Benefício"
            type="text"
            fullWidth
            value={formData.beneficio}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="comoAtivar"
            label="Como Ativar"
            type="text"
            fullWidth
            value={formData.comoAtivar}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancelar</Button>
          <Button onClick={handleSave} color="primary" variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}