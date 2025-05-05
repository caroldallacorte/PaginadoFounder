import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Container, Grid, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(null);
  const [benefitsData, setBenefitsData] = useState({});
  const [fundosData, setFundosData] = useState([]);
  const [mentoresData, setMentoresData] = useState([]);
  const [materiaisData, setMateriaisData] = useState([]);
  const [selectedBenefitCategory, setSelectedBenefitCategory] = useState('marketing-vendas');
  const [isClient, setIsClient] = useState(false);

  const categoryNames = {
    'marketing-vendas': 'Marketing/Vendas',
    'cs-suporte': 'CS/Suporte',
    'gestao-adm': 'Gestão/ADM',
    'cloud-tech': 'Cloud/Tech',
    'people': 'People'
  };

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== 'undefined') {
      Object.keys(categoryNames).forEach(category => {
        const saved = localStorage.getItem(`benefits-${category}`);
        if (saved) {
          try {
            setBenefitsData(prev => ({ ...prev, [category]: JSON.parse(saved) }));
          } catch (e) {
            console.error(`Erro ao carregar benefícios da categoria ${category}:`, e);
          }
        }
      });

      const savedFundos = localStorage.getItem('fundos-parceiros');
      if (savedFundos) setFundosData(JSON.parse(savedFundos));

      const savedMentores = localStorage.getItem('mentores');
      if (savedMentores) setMentoresData(JSON.parse(savedMentores));

      const savedMateriais = localStorage.getItem('materiais-apoio');
      if (savedMateriais) setMateriaisData(JSON.parse(savedMateriais));
    }
  }, []);

  const handleCategoryClick = (category) => setActiveCategory(category);
  const handleBenefitCategoryClick = (category) => setSelectedBenefitCategory(category);

  const renderContent = () => {
    if (!isClient) return <Typography>A carregar...</Typography>;

    if (activeCategory === null) {
      return (
        <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>Bem-vindo à Página do Founder!</Typography>
          <Typography paragraph>Explore os recursos exclusivos disponíveis para os founders da nossa comunidade.</Typography>
          <Typography paragraph>Navegue pelas categorias acima para encontrar benefícios, materiais de apoio, fundos parceiros e mentores.</Typography>
        </Paper>
      );
    }

    switch (activeCategory) {
      case 'beneficios':
        const currentBenefits = benefitsData[selectedBenefitCategory] || [];
        return (
          <>
            <Typography variant="h4" gutterBottom>Benefícios</Typography>
            <Typography paragraph>Selecione uma subcategoria:</Typography>
            <Grid container spacing={2} sx={{ mt: 2, mb: 4 }}>
              {Object.keys(categoryNames).map((category) => (
                <Grid item xs={6} sm={4} md={2.4} key={category}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      bgcolor: selectedBenefitCategory === category ? '#e3f2fd' : 'white',
                      '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                    onClick={() => handleBenefitCategoryClick(category)}
                  >
                    {categoryNames[category]}
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell>Logo</TableCell>
                    <TableCell>Parceiro</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Benefício</TableCell>
                    <TableCell>Como Ativar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentBenefits.map((benefit) => (
                    <TableRow key={benefit.id}>
                      <TableCell>{benefit.logo ? <img src={benefit.logo} alt="" style={{ maxWidth: 50 }} /> : 'Sem logo'}</TableCell>
                      <TableCell>{benefit.parceiro}</TableCell>
                      <TableCell>{benefit.descricao}</TableCell>
                      <TableCell>{benefit.beneficio}</TableCell>
                      <TableCell>{benefit.comoAtivar}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );

      case 'materiais':
        return (
          <>
            <Typography variant="h4" gutterBottom>Materiais de Apoio</Typography>
            <Typography paragraph>Lista de materiais disponíveis.</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell>Nome do Material</TableCell>
                    <TableCell>Ano</TableCell>
                    <TableCell>Link de Acesso</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {materiaisData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.nome}</TableCell>
                      <TableCell>{item.ano}</TableCell>
                      <TableCell><a href={item.link} target="_blank" rel="noopener noreferrer">{item.link}</a></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );

      case 'fundos':
        return (
          <>
            <Typography variant="h4" gutterBottom>Fundos Parceiros</Typography>
            <Typography paragraph>Informações sobre fundos de investimento parceiros.</Typography>
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fundosData.map((fundo) => (
                    <TableRow key={fundo.id}>
                      <TableCell>{fundo.logo ? <img src={fundo.logo} alt={fundo.parceiro} style={{ maxWidth: 50 }} /> : 'Sem logo'}</TableCell>
                      <TableCell>{fundo.parceiro}</TableCell>
                      <TableCell>{fundo.tipoInvestimento}</TableCell>
                      <TableCell>{fundo.tamanhoCheque}</TableCell>
                      <TableCell>{fundo.tese}</TableCell>
                      <TableCell>{fundo.contato}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );

      case 'mentores':
        return (
          <>
            <Typography variant="h4" gutterBottom>Mentores</Typography>
            <Typography paragraph>Lista de mentores disponíveis para startups.</Typography>
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mentoresData.map((mentor) => (
                    <TableRow key={mentor.id}>
                      <TableCell>{mentor.foto ? <img src={mentor.foto} alt={mentor.nome} style={{ maxWidth: 50, borderRadius: '50%' }} /> : 'Sem foto'}</TableCell>
                      <TableCell>{mentor.nome}</TableCell>
                      <TableCell>{mentor.cargo}</TableCell>
                      <TableCell>{mentor.empresa}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {mentor.especialidades?.map((esp) => (
                            <Chip key={esp} label={esp} size="small" />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>{mentor.contato}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{
        bgcolor: 'primary.main',
        color: 'white',
        px: 3,
        py: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ width: '150px', height: '50px' }}>
          <img src="/images/logo.png" alt="Logo" style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)'
          }} />
        </Box>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>
          PÁGINA DO FOUNDER
        </Typography>
        <Button variant="contained" color="secondary" onClick={() => router.push('/admin')}>
          ADM
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Container maxWidth="md">
          <Button variant={activeCategory === 'beneficios' ? 'contained' : 'text'} onClick={() => handleCategoryClick('beneficios')} sx={{ mx: 1 }}>Benefícios</Button>
          <Button variant={activeCategory === 'materiais' ? 'contained' : 'text'} onClick={() => handleCategoryClick('materiais')} sx={{ mx: 1 }}>Materiais de Apoio</Button>
          <Button variant={activeCategory === 'fundos' ? 'contained' : 'text'} onClick={() => handleCategoryClick('fundos')} sx={{ mx: 1 }}>Fundos Parceiros</Button>
          <Button variant={activeCategory === 'mentores' ? 'contained' : 'text'} onClick={() => handleCategoryClick('mentores')} sx={{ mx: 1 }}>Mentores</Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {renderContent()}
      </Container>
    </Box>
  );
}