import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Container, Grid, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress
} from '@mui/material';
import { useRouter } from 'next/router';
import { useBenefits } from '../hooks/useBenefits';
import { useFunds } from '../hooks/useFunds';
import { useMentors } from '../hooks/useMentors';
import { useMaterials } from '../hooks/useMaterials';

export default function Home() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedBenefitCategory, setSelectedBenefitCategory] = useState('marketing-vendas');
  const [isClient, setIsClient] = useState(false);

  // Use the hooks to fetch data from API/database
  const { benefits: selectedBenefits, isLoading: benefitsLoading, error: benefitsError } = useBenefits(selectedBenefitCategory);
  const { funds, isLoading: fundsLoading, error: fundsError } = useFunds();
  const { mentors, isLoading: mentorsLoading, error: mentorsError } = useMentors();
  const { materials, isLoading: materialsLoading, error: materialsError } = useMaterials();

  const categoryNames = {
    'marketing-vendas': 'Marketing/Vendas',
    'cs-suporte': 'CS/Suporte',
    'gestao-adm': 'Gestão/ADM',
    'cloud-tech': 'Cloud/Tech',
    'people': 'People'
  };

  useEffect(() => {
    setIsClient(true);
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
            
            {benefitsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : benefitsError ? (
              <Typography color="error">Erro ao carregar benefícios: {benefitsError}</Typography>
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedBenefits.map((benefit) => (
                      <TableRow key={benefit.id}>
                        <TableCell>
                          {benefit.logo ? (
                            <img 
                              src={benefit.logo} 
                              alt={`Logo ${benefit.parceiro}`} 
                              style={{ maxWidth: 50, objectFit: 'contain' }} 
                            />
                          ) : (
                            <Typography variant="caption" color="text.secondary">Sem logo</Typography>
                          )}
                        </TableCell>
                        <TableCell>{benefit.parceiro}</TableCell>
                        <TableCell>{benefit.descricao}</TableCell>
                        <TableCell>{benefit.beneficio}</TableCell>
                        <TableCell>{benefit.como_ativar}</TableCell>
                      </TableRow>
                    ))}
                    {selectedBenefits.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          Nenhum benefício cadastrado para esta categoria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        );

      case 'materiais':
        return (
          <>
            <Typography variant="h4" gutterBottom>Materiais de Apoio</Typography>
            <Typography paragraph>Lista de materiais disponíveis.</Typography>
            
            {materialsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : materialsError ? (
              <Typography color="error">Erro ao carregar materiais: {materialsError}</Typography>
            ) : (
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
                    {materials.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.nome}</TableCell>
                        <TableCell>{item.ano}</TableCell>
                        <TableCell>
                          <a href={item.link} target="_blank" rel="noopener noreferrer">{item.link}</a>
                        </TableCell>
                      </TableRow>
                    ))}
                    {materials.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          Nenhum material cadastrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        );

      case 'fundos':
        return (
          <>
            <Typography variant="h4" gutterBottom>Fundos Parceiros</Typography>
            <Typography paragraph>Informações sobre fundos de investimento parceiros.</Typography>
            
            {fundsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : fundsError ? (
              <Typography color="error">Erro ao carregar fundos: {fundsError}</Typography>
            ) : (
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
                    {funds.map((fundo) => (
                      <TableRow key={fundo.id}>
                        <TableCell>
                          {fundo.logo ? (
                            <img 
                              src={fundo.logo} 
                              alt={`Logo ${fundo.parceiro}`} 
                              style={{ maxWidth: 50, objectFit: 'contain' }} 
                            />
                          ) : (
                            <Typography variant="caption" color="text.secondary">Sem logo</Typography>
                          )}
                        </TableCell>
                        <TableCell>{fundo.parceiro}</TableCell>
                        <TableCell>{fundo.tipo_investimento}</TableCell>
                        <TableCell>{fundo.tamanho_cheque}</TableCell>
                        <TableCell>{fundo.tese}</TableCell>
                        <TableCell>{fundo.contato}</TableCell>
                      </TableRow>
                    ))}
                    {funds.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          Nenhum fundo parceiro cadastrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        );

      case 'mentores':
        return (
          <>
            <Typography variant="h4" gutterBottom>Mentores</Typography>
            <Typography paragraph>Lista de mentores disponíveis para startups.</Typography>
            
            {mentorsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : mentorsError ? (
              <Typography color="error">Erro ao carregar mentores: {mentorsError}</Typography>
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
                            {mentor.especialidades?.map((esp) => (
                              <Chip key={esp} label={esp} size="small" />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>{mentor.contato}</TableCell>
                      </TableRow>
                    ))}
                    {mentors.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          Nenhum mentor cadastrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
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