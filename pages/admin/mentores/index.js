import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Chip, Autocomplete, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageUploader from '../../../src/components/ImageUploader';
import { useAuth } from '../../../contexts/AuthContext';
import { useMentors } from '../../../hooks/useMentors';

// Lista de especialidades pré-definidas
const especialidadesDisponiveis = [
  'Vendas', 'Marketing', 'Inbound', 'Outbound', 'Parceiros', 
  'Produto', 'CS', 'Finanças', 'People'
];

export default function Mentores() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { mentors, isLoading, error, addMentor, updateMentor, deleteMentor } = useMentors();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMentor, setEditingMentor] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    empresa: '',
    especialidades: [],
    contato: '',
    foto: ''
  });
  const [novaEspecialidade, setNovaEspecialidade] = useState('');
  const [especialidades, setEspecialidades] = useState(especialidadesDisponiveis);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleOpenDialog = (mentor = null) => {
    if (mentor) {
      // Modo edição
      setEditingMentor(mentor);
      setFormData({
        id: mentor.id,
        nome: mentor.nome,
        cargo: mentor.cargo,
        empresa: mentor.empresa,
        especialidades: mentor.especialidades || [],
        contato: mentor.contato,
        foto: mentor.foto
      });
    } else {
      // Modo adição
      setEditingMentor(null);
      setFormData({
        nome: '',
        cargo: '',
        empresa: '',
        especialidades: [],
        contato: '',
        foto: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNovaEspecialidade('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFotoUpload = (filePath) => {
    setFormData({
      ...formData,
      foto: filePath
    });
  };

  const handleEspecialidadesChange = (event, newValue) => {
    setFormData({
      ...formData,
      especialidades: newValue
    });
  };

  const handleAddEspecialidade = () => {
    if (novaEspecialidade && !especialidades.includes(novaEspecialidade)) {
      const updatedEspecialidades = [...especialidades, novaEspecialidade];
      setEspecialidades(updatedEspecialidades);
      setFormData({
        ...formData,
        especialidades: [...formData.especialidades, novaEspecialidade]
      });
      setNovaEspecialidade('');
    }
  };

  const handleSave = async () => {
    try {
      if (editingMentor) {
        // Update existing mentor
        await updateMentor(formData);
      } else {
        // Add new mentor
        await addMentor(formData);
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving mentor:', err);
      // Show error to user
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este mentor?')) {
      try {
        await deleteMentor(id);
      } catch (err) {
        console.error('Error deleting mentor:', err);
        // Show error to user
      }
    }
  };

  if (authLoading) {
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
          Gerenciar Mentores
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleOpenDialog()}
          sx={{ mt: 2, mb: 4 }}
        >
          Adicionar Novo Mentor
        </Button>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">Erro ao carregar mentores: {error}</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell>Foto</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Cargo</TableCell>
                  <TableCell>Empresa</TableCell>
                  <TableCell>Especialidades</TableCell>
                  <TableCell>Contato</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mentors.map((mentor) => (
                  <TableRow key={mentor.id}>
                    <TableCell>
                      {mentor.foto ? (
                        <img 
                          src={mentor.foto} 
                          alt={`Foto ${mentor.nome}`} 
                          style={{ maxWidth: 50, maxHeight: 50, objectFit: 'cover', borderRadius: '50%' }} 
                        />
                      ) : (
                        <Box sx={{ width: 50, height: 50, bgcolor: '#f5f5f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="caption" color="text.secondary">Sem foto</Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>{mentor.nome}</TableCell>
                    <TableCell>{mentor.cargo}</TableCell>
                    <TableCell>{mentor.empresa}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {mentor.especialidades && mentor.especialidades.map((especialidade) => (
                          <Chip key={especialidade} label={especialidade} size="small" />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>{mentor.contato}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleOpenDialog(mentor)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(mentor.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {mentors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Nenhum mentor cadastrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
      
      {/* Diálogo para adicionar/editar mentor */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingMentor ? 'Editar Mentor' : 'Adicionar Novo Mentor'}
        </DialogTitle>
        <DialogContent>
          <ImageUploader 
            onUploadSuccess={handleFotoUpload} 
            initialImage={formData.foto || null}
          />
          
          <TextField
            autoFocus
            margin="dense"
            name="nome"
            label="Nome"
            type="text"
            fullWidth
            value={formData.nome}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="cargo"
            label="Cargo"
            type="text"
            fullWidth
            value={formData.cargo}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="empresa"
            label="Empresa"
            type="text"
            fullWidth
            value={formData.empresa}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <Autocomplete
            multiple
            id="especialidades"
            options={especialidades}
            value={formData.especialidades}
            onChange={handleEspecialidadesChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Especialidades"
                placeholder="Selecione ou adicione especialidades"
                margin="dense"
                fullWidth
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} />
              ))
            }
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', mb: 2 }}>
            <TextField
              margin="dense"
              label="Nova Especialidade"
              value={novaEspecialidade}
              onChange={(e) => setNovaEspecialidade(e.target.value)}
              sx={{ flexGrow: 1, mr: 1 }}
            />
            <Button 
              variant="contained" 
              onClick={handleAddEspecialidade}
              sx={{ mt: 1 }}
              disabled={!novaEspecialidade}
            >
              Adicionar
            </Button>
          </Box>
          
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