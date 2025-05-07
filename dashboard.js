import { useState } from 'react';
import { Container, Typography, Box, Button, AppBar, Toolbar, Tabs, Tab, Paper, Grid } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    router.push('/admin');
  };

  return (
    <>
      <Head>
        <title>Painel de Administração - Página do Founder</title>
        <meta name="description" content="Painel de administração da Página do Founder" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Painel de Administração
          </Typography>
          <Button color="inherit" onClick={() => router.push('/')}>
            Ver Site
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Gerenciar Conteúdo
          </Typography>
          
          <Paper sx={{ width: '100%', mb: 4 }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="Benefícios" />
              <Tab label="Benchmark Report" />
              <Tab label="Fundos Parceiros" />
              <Tab label="Mentores" />
            </Tabs>
          </Paper>
          
          {tabValue === 0 && (
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Gerenciar Benefícios
              </Typography>
              <Grid container spacing={2}>
                {['Marketing/Vendas', 'CS/Suporte', 'Gestão/ADM', 'Cloud/Tech', 'People'].map((category) => (
                  <Grid item xs={12} sm={6} md={4} key={category}>
                    <Paper 
                      sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }
                      }}
                      onClick={() => router.push(`/admin/beneficios/${category.toLowerCase().replace('/', '-')}`)}
                    >
                      <Typography variant="h6">{category}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Editar benefícios desta categoria
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          
          {tabValue === 1 && (
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Gerenciar Benchmark Report
              </Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                onClick={() => router.push('/admin/benchmark')}
              >
                Editar Benchmark Report
              </Button>
            </Box>
          )}
          
          {tabValue === 2 && (
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Gerenciar Fundos Parceiros
              </Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                onClick={() => router.push('/admin/fundos-parceiros')}
              >
                Editar Fundos Parceiros
              </Button>
            </Box>
          )}
          
          {tabValue === 3 && (
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Gerenciar Mentores
              </Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                onClick={() => router.push('/admin/mentores')}
              >
                Editar Mentores
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
}
