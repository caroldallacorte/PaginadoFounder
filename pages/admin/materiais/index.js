import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Container, CircularProgress
} from '@mui/material';
import { useRouter } from 'next/router';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../../../contexts/AuthContext';
import { useMaterials } from '../../../hooks/useMaterials';

export default function MateriaisAdmin() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { materials, isLoading, error, addMaterial, updateMaterial, deleteMaterial } = useMaterials();
  
  const [nome, setNome] = useState('');
  const [ano, setAno] = useState('');
  const [link, setLink] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [authLoading, isAuthenticated, router]);

  const limparCampos = () => {
    setNome('');
    setAno('');
    setLink('');
    setEditandoId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !ano || !link) return;

    try {
      if (editandoId) {
        // Update existing material
        await updateMaterial({
          id: editandoId,
          nome,
          ano,
          link
        });
      } else {
        // Add new material
        await addMaterial({
          nome,
          ano,
          link
        });
      }
      
      limparCampos();
    } catch (err) {
      console.error('Error saving material:', err);
      // Show error to user
    }
  };

  const handleEditar = (material) => {
    setNome(material.nome);
    setAno(material.ano);
    setLink(material.link);
    setEditandoId(material.id);
  };

  const handleExcluir = async (id) => {
    if (confirm('Tem certeza que deseja excluir este material?')) {
      try {
        await deleteMaterial(id);
      } catch (err) {
        console.error('Error deleting material:', err);
        // Show error to user
      }
    }
  };

  if (authLoading || isLoading) {
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
      
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => router.push('/admin/dashboard')}
          sx={{ mb: 3 }}
        >
          Voltar para o painel
        </Button>

        <Typography variant="h4" gutterBottom>
          Gerenciar Materiais de Apoio
        </Typography>

        <Paper sx={{ p: 3, mb: 4 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nome do Material"
              fullWidth
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Ano"
              fullWidth
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Link de Acesso"
              fullWidth
              value={link}
              onChange={(e) => setLink(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Box display="flex" gap={2}>
              <Button type="submit" variant="contained" color="primary">
                {editandoId ? 'Atualizar' : 'Adicionar'}
              </Button>
              {editandoId && (
                <Button variant="outlined" onClick={limparCampos}>
                  Cancelar
                </Button>
              )}
            </Box>
          </form>
        </Paper>

        {error ? (
          <Typography color="error" sx={{ mb: 2 }}>Erro ao carregar materiais: {error}</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Nome do Material</TableCell>
                  <TableCell>Ano</TableCell>
                  <TableCell>Link</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {materials.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.nome}</TableCell>
                    <TableCell>{item.ano}</TableCell>
                    <TableCell>
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        {item.link}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        onClick={() => handleEditar(item)}
                        sx={{ mr: 1 }}
                        startIcon={<EditIcon />}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="text"
                        color="error"
                        onClick={() => handleExcluir(item.id)}
                        startIcon={<DeleteIcon />}
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {materials.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Nenhum material cadastrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
}