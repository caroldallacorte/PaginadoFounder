import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Dados iniciais de exemplo
const initialReports = [
  { id: 1, periodo: '2024 - Q1', link: 'https://example.com/report-2024-q1' },
  { id: 2, periodo: '2023 - Ano Completo', link: 'https://example.com/report-2023-full' },
];

export default function BenchmarkAdmin()  {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [formData, setFormData] = useState({ periodo: '', link: '' });

  useEffect(() => {
    // Verificar login
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus !== 'true') {
      router.push('/admin');
    } else {
      setIsLoggedIn(true);
    }

    // Carregar dados do localStorage
    const savedReports = localStorage.getItem('benchmark-reports');
    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
      } catch (e) {
        console.error('Erro ao carregar relatórios:', e);
        localStorage.setItem('benchmark-reports', JSON.stringify(initialReports)); // Salva dados iniciais se houver erro
        setReports(initialReports);
      }
    } else {
      localStorage.setItem('benchmark-reports', JSON.stringify(initialReports));
      setReports(initialReports);
    }
  }, [router]);

  const handleOpenDialog = (report = null) => {
    setEditingReport(report);
    setFormData(report ? { periodo: report.periodo, link: report.link } : { periodo: '', link: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingReport(null);
    setFormData({ periodo: '', link: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    let updatedReports;
    if (editingReport) {
      updatedReports = reports.map(r => 
        r.id === editingReport.id ? { ...r, ...formData } : r
      );
    } else {
      const newReport = {
        id: Date.now(), // ID temporário
        ...formData
      };
      updatedReports = [...reports, newReport];
    }
    setReports(updatedReports);
    localStorage.setItem('benchmark-reports', JSON.stringify(updatedReports));
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este relatório?')) {
      const updatedReports = reports.filter(r => r.id !== id);
      setReports(updatedReports);
      localStorage.setItem('benchmark-reports', JSON.stringify(updatedReports));
    }
  };

  if (!isLoggedIn) {
    return null; // Ou um spinner de carregamento
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => router.push('/admin/dashboard')}
        sx={{ mb: 2 }}
      >
        Voltar ao Dashboard
      </Button>
      <Typography variant="h4" gutterBottom>Gerenciar Benchmark Reports</Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => handleOpenDialog()}
        sx={{ mb: 2 }}
      >
        Adicionar Novo Relatório
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Período</TableCell>
              <TableCell>Link de Acesso</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.periodo}</TableCell>
                <TableCell>
                  <a href={report.link} target="_blank" rel="noopener noreferrer">
                    {report.link}
                  </a>
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleOpenDialog(report)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(report.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {reports.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Nenhum relatório cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para Adicionar/Editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingReport ? 'Editar Relatório' : 'Adicionar Novo Relatório'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="periodo"
            label="Período"
            type="text"
            fullWidth
            value={formData.periodo}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="link"
            label="Link de Acesso"
            type="url" // Usar tipo url para validação básica
            fullWidth
            value={formData.link}
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