import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Container
} from '@mui/material';
import { useRouter } from 'next/router';

export default function MateriaisAdmin() {
  const router = useRouter();
  const [materiais, setMateriais] = useState([]);
  const [nome, setNome] = useState('');
  const [ano, setAno] = useState('');
  const [link, setLink] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    const armazenados = localStorage.getItem('materiais-apoio');
    if (armazenados) {
      setMateriais(JSON.parse(armazenados));
    }
  }, []);

  const salvarMateriais = (dados) => {
    setMateriais(dados);
    localStorage.setItem('materiais-apoio', JSON.stringify(dados));
  };

  const limparCampos = () => {
    setNome('');
    setAno('');
    setLink('');
    setEditandoId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nome || !ano || !link) return;

    if (editandoId) {
      const atualizados = materiais.map((item) =>
        item.id === editandoId ? { id: editandoId, nome, ano, link } : item
      );
      salvarMateriais(atualizados);
    } else {
      const novo = {
        id: Date.now().toString(),
        nome,
        ano,
        link
      };
      salvarMateriais([...materiais, novo]);
    }

    limparCampos();
  };

  const handleEditar = (item) => {
    setNome(item.nome);
    setAno(item.ano);
    setLink(item.link);
    setEditandoId(item.id);
  };

  const handleExcluir = (id) => {
    const filtrados = materiais.filter((item) => item.id !== id);
    salvarMateriais(filtrados);
    limparCampos();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
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
            {materiais.map((item) => (
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
                  >
                    Editar
                  </Button>
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => handleExcluir(item.id)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {materiais.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Nenhum material cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 4 }}>
        <Button variant="contained" onClick={() => router.push('/admin/dashboard')}>
          Voltar ao Painel
        </Button>
      </Box>
    </Container>
  );
}