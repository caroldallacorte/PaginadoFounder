import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Container, Tabs, Tab, Paper
} from '@mui/material';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus !== 'true') {
      router.push('/admin');
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>Gerenciar Benefícios</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
              {[
                ['marketing-vendas', 'Marketing/Vendas'],
                ['cs-suporte', 'CS/Suporte'],
                ['gestao-adm', 'Gestão/ADM'],
                ['cloud-tech', 'Cloud/Tech'],
                ['people', 'People']
              ].map(([rota, titulo]) => (
                <Paper
                  key={rota}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                  onClick={() => router.push(`/admin/beneficios/${rota}`)}
                >
                  <Typography variant="h6">{titulo}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Editar benefícios desta categoria
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>Gerenciar Materiais de Apoio</Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => router.push('/admin/materiais')}
            >
              Gerenciar Materiais
            </Button>

            <Typography variant="body1" sx={{ mt: 3 }}>
              Aqui você pode adicionar, editar e remover materiais com nome, ano e link de acesso.
            </Typography>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>Gerenciar Fundos Parceiros</Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => router.push('/admin/fundos-parceiros')}
            >
              Gerenciar Fundos Parceiros
            </Button>

            <Typography variant="body1" sx={{ mt: 3 }}>
              Aqui você pode cadastrar informações como logo, tipo de investimento, tamanho de cheque, tese e contato.
            </Typography>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>Gerenciar Mentores</Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => router.push('/admin/mentores')}
            >
              Gerenciar Mentores
            </Button>

            <Typography variant="body1" sx={{ mt: 3 }}>
              Aqui você pode adicionar, editar e remover mentores, com foto, cargo, empresa, especialidades e contato.
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{
        bgcolor: 'primary.main',
        color: 'white',
        p: 2,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
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
        <Typography variant="h4" gutterBottom>
          Bem-vindo ao Painel de Administração
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="admin tabs">
            <Tab label="Benefícios" />
            <Tab label="Materiais de Apoio" />
            <Tab label="Fundos Parceiros" />
            <Tab label="Mentores" />
          </Tabs>
        </Box>

        {renderTabContent()}
      </Container>
    </Box>
  );
}