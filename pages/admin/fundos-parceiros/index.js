import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageUploader from '../../../src/components/ImageUploader';

// Dados iniciais de exemplo
const initialFundos = [
  { 
    id: 1, 
    parceiro: 'Fundo Investimentos A', 
    tipoInvestimento: 'Seed', 
    tamanhoCheque: 'R$ 500K - R$ 2M', 
    tese: 'Fintechs e Marketplaces em estágio inicial', 
    contato: 'investimentos@fundoa.com',
    logo: '' 
  },
  { 
    id: 2, 
    parceiro: 'Venture Capital XYZ', 
    tipoInvestimento: 'Series A', 
    tamanhoCheque: 'R$ 1M - R$ 5M', 
    tese: 'Healthtechs e Edtechs em estágio de crescimento', 
    contato: 'parcerias@vcxyz.com',
    logo: '' 
  }
];

export default function FundosParceiros() {
  const router = useRouter();
  const [fundos, setFundos] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingFundo, setEditingFundo] = useState(null);
  const [formData, setFormData] = useState({
    parceiro: '',
    tipoInvestimento: '',
    tamanhoCheque: '',
    tese: '',
    contato: '',
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

    // Carregar fundos quando o componente montar
    const savedFundos = localStorage.getItem('fundos-parceiros');
    if (savedFundos) {
      setFundos(JSON.parse(savedFundos));
    } else {
      // Se não houver dados salvos, usar os dados iniciais
      setFundos(initialFundos);
      // E salvar no localStorage
      localStorage.setItem('fundos-parceiros', JSON.stringify(initialFundos));
    }
  }, [router]);

  const handleOpenDialog = (fundo = null) => {
    if (fundo) {
      // Modo edição
      setEditingFundo(fundo);
      setFormData({
        parceiro: fundo.parceiro,
        tipoInvestimento: fundo.tipoInvestimento,
        tamanhoCheque: fundo.tamanhoCheque,
        tese: fundo.tese,
        contato: fundo.contato,
        logo: fundo.logo
      });
    } else {
      // Modo adição
      setEditingFundo(null);
      setFormData({
        parceiro: '',
        tipoInvestimento: '',
        tamanhoCheque: '',
        tese: '',
        contato: '',
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
    let updatedFundos;
    
    if (editingFundo) {
      // Atualizar fundo existente
      updatedFundos = fundos.map(f => 
        f.id === editingFundo.id ? { ...f, ...formData } : f
      );
    } else {
      // Adicionar novo fundo
      const newFundo = {
        id: Date.now(), // ID temporário baseado no timestamp
        ...formData
      };
      updatedFundos = [...fundos, newFundo];
    }
    
    // Atualizar o estado
    setFundos(updatedFundos);
    
    // Salvar no localStorage
    localStorage.setItem('fundos-parceiros', JSON.stringify(updatedFundos));
    
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este fundo parceiro?')) {
      const updatedFundos = fundos.filter(f => f.id !== id);
      
      // Atualizar o estado
      setFundos(updatedFundos);
      
      // Salvar no localStorage
      localStorage.setItem('fundos-parceiros', JSON.stringify(updatedFundos));
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
          Gerenciar Fundos Parceiros
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleOpenDialog()}
          sx={{ mt: 2, mb: 4 }}
        >
          Adicionar Novo Fundo Parceiro
        </Button>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Logo</TableCell>
                <TableCell>Parceiro</TableCell>
                <TableCell>Tipo de Investimento</TableCell>
                <TableCell>Tamanho de Cheque</TableCell>
                <TableCell>Tese</TableCell>
                <TableCell>Contato</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fundos.map((fundo) => (
                <TableRow key={fundo.id}>
                  <TableCell>
                    {fundo.logo ? (
                      <img 
                        src={fundo.logo} 
                        alt={`Logo ${fundo.parceiro}`} 
                        style={{ maxWidth: 50, maxHeight: 50, objectFit: 'contain' }} 
                      />
                    ) : (
                      <Box sx={{ width: 50, height: 50, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="caption" color="text.secondary">Sem logo</Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>{fundo.parceiro}</TableCell>
                  <TableCell>{fundo.tipoInvestimento}</TableCell>
                  <TableCell>{fundo.tamanhoCheque}</TableCell>
                  <TableCell>{fundo.tese}</TableCell>
                  <TableCell>{fundo.contato}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleOpenDialog(fundo)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(fundo.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {fundos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Nenhum fundo parceiro cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      
      {/* Diálogo para adicionar/editar fundo */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingFundo ? 'Editar Fundo Parceiro' : 'Adicionar Novo Fundo Parceiro'}
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
            name="tipoInvestimento"
            label="Tipo de Investimento"
            type="text"
            fullWidth
            value={formData.tipoInvestimento}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="tamanhoCheque"
            label="Tamanho de Cheque"
            type="text"
            fullWidth
            value={formData.tamanhoCheque}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="tese"
            label="Tese"
            type="text"
            fullWidth
            value={formData.tese}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="contato"
            label="Contato"
            type="text"
            fullWidth
            value={formData.contato}
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