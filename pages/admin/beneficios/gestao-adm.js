import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageUploader from '../../../src/components/ImageUploader';

// Categoria fixa para esta página
const CATEGORIA = 'gestao-adm';

// Dados iniciais de exemplo
const initialBenefits = [
  { id: 1, parceiro: 'Google Ads', descricao: 'Créditos para campanhas', beneficio: 'R$ 2.000 em créditos', comoAtivar: 'Código: STARTUP2023', logo: '' },
  { id: 2, parceiro: 'HubSpot', descricao: 'Plano de marketing', beneficio: '50% de desconto por 12 meses', comoAtivar: 'Formulário no site parceiro', logo: '' }
];

export default function BeneficiosCategoria() {
  const router = useRouter();
  const [benefits, setBenefits] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState(null);
  const [formData, setFormData] = useState({
    parceiro: '',
    descricao: '',
    beneficio: '',
    comoAtivar: '',
    logo: ''
  });

  useEffect(() => {
    // Verificar se o usuário está logado
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus !== 'true') {
      router.push('/admin');
    } else {
      setIsLoggedIn(true);
    }

    // Carregar benefícios da categoria
    const savedBenefits = localStorage.getItem(`benefits-${CATEGORIA}`);
    if (savedBenefits) {
      setBenefits(JSON.parse(savedBenefits));
    } else {
      // Se não houver dados salvos, usar os dados iniciais
      setBenefits(initialBenefits);
      // E salvar no localStorage
      localStorage.setItem(`benefits-${CATEGORIA}`, JSON.stringify(initialBenefits));
    }
  }, [router]);

  const handleOpenDialog = (benefit = null) => {
    if (benefit) {
      // Modo edição
      setEditingBenefit(benefit);
      setFormData({
        parceiro: benefit.parceiro,
        descricao: benefit.descricao,
        beneficio: benefit.beneficio,
        comoAtivar: benefit.comoAtivar,
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

  const handleSave = () => {
    let updatedBenefits;
    
    if (editingBenefit) {
      // Atualizar benefício existente
      updatedBenefits = benefits.map(b => 
        b.id === editingBenefit.id ? { ...b, ...formData } : b
      );
    } else {
      // Adicionar novo benefício
      const newBenefit = {
        id: Date.now(), // ID temporário baseado no timestamp
        ...formData
      };
      updatedBenefits = [...benefits, newBenefit];
    }
    
    // Atualizar o estado
    setBenefits(updatedBenefits);
    
    // Salvar no localStorage
    localStorage.setItem(`benefits-${CATEGORIA}`, JSON.stringify(updatedBenefits));
    
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este benefício?')) {
      const updatedBenefits = benefits.filter(b => b.id !== id);
      
      // Atualizar o estado
      setBenefits(updatedBenefits);
      
      // Salvar no localStorage
      localStorage.setItem(`benefits-${CATEGORIA}`, JSON.stringify(updatedBenefits));
    }
  };

  if (!isLoggedIn) {
    return <Typography>Carregando...</Typography>;
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
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              router.push('/admin');
            }}
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
          Gerenciar Benefícios: Marketing/Vendas
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleOpenDialog()}
          sx={{ mt: 2, mb: 4 }}
        >
          Adicionar Novo Benefício
        </Button>
        
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
                  <TableCell>{benefit.comoAtivar}</TableCell>
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