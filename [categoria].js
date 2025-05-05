import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, AppBar, Toolbar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Head from 'next/head';

// Dados de exemplo - em produção, estes viriam de uma API ou banco de dados
const beneficiosMock = {
  'marketing-vendas': [
    { id: 1, parceiro: 'Empresa A', logo: '/uploads/logo-placeholder.png', descricao: 'Desconto em ferramentas de marketing digital', acesso: 'Contatar pelo email: contato@empresaa.com' },
    { id: 2, parceiro: 'Empresa B', logo: '/uploads/logo-placeholder.png', descricao: 'Consultoria gratuita em SEO', acesso: 'Acessar plataforma: www.empresab.com/parceiros' }
  ],
  'cs-suporte': [
    { id: 3, parceiro: 'Empresa C', logo: '/uploads/logo-placeholder.png', descricao: 'Software de atendimento ao cliente', acesso: 'Usar código: FOUNDER2025' }
  ],
  'gestao-adm': [
    { id: 4, parceiro: 'Empresa D', logo: '/uploads/logo-placeholder.png', descricao: 'Desconto em sistema de gestão', acesso: 'Contatar representante: (11) 9999-9999' }
  ],
  'cloud-tech': [
    { id: 5, parceiro: 'Empresa E', logo: '/uploads/logo-placeholder.png', descricao: 'Créditos em serviços de cloud', acesso: 'Registrar em: www.empresae.com/startup' },
    { id: 6, parceiro: 'Empresa F', logo: '/uploads/logo-placeholder.png', descricao: 'Ferramentas de desenvolvimento', acesso: 'Enviar solicitação para: parcerias@empresaf.com' }
  ],
  'people': [
    { id: 7, parceiro: 'Empresa G', logo: '/uploads/logo-placeholder.png', descricao: 'Plataforma de recrutamento', acesso: 'Usar código: FOUNDERHR2025' }
  ]
};

// Mapeamento de slugs para nomes de exibição
const categoriasNomes = {
  'marketing-vendas': 'Marketing/Vendas',
  'cs-suporte': 'CS/Suporte',
  'gestao-adm': 'Gestão/ADM',
  'cloud-tech': 'Cloud/Tech',
  'people': 'People'
};

export default function BeneficiosCategoria() {
  const router = useRouter();
  const { categoria } = router.query;
  const [beneficios, setBeneficios] = useState([]);
  const [categoriaNome, setCategoriaNome] = useState('');

  useEffect(() => {
    if (categoria) {
      // Em produção, aqui faria uma chamada à API para buscar os dados
      setBeneficios(beneficiosMock[categoria] || []);
      setCategoriaNome(categoriasNomes[categoria] || categoria);
    }
  }, [categoria]);

  if (!categoria) {
    return <Box sx={{ p: 4, textAlign: 'center' }}>Carregando...</Box>;
  }

  return (
    <>
      <Head>
        <title>Benefícios - {categoriaNome} | Página do Founder</title>
        <meta name="description" content={`Benefícios de parceiros na categoria ${categoriaNome}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Página do Founder
          </Typography>
          <Button color="inherit" onClick={() => router.push('/admin')}>
            Admin
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => router.push('/')}
            sx={{ mb: 3 }}
          >
            Voltar para categorias
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom>
            Benefícios: {categoriaNome}
          </Typography>
          
          {beneficios.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table sx={{ minWidth: 650 }} aria-label="tabela de benefícios">
                <TableHead>
                  <TableRow>
                    <TableCell>Logo</TableCell>
                    <TableCell>Parceiro</TableCell>
                    <TableCell>Descrição do Benefício</TableCell>
                    <TableCell>Como Acessar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {beneficios.map((beneficio) => (
                    <TableRow key={beneficio.id}>
                      <TableCell>
                        <Box 
                          component="img"
                          src={beneficio.logo}
                          alt={`Logo ${beneficio.parceiro}`}
                          sx={{ width: 80, height: 80, objectFit: 'contain' }}
                        />
                      </TableCell>
                      <TableCell>{beneficio.parceiro}</TableCell>
                      <TableCell>{beneficio.descricao}</TableCell>
                      <TableCell>{beneficio.acesso}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography sx={{ mt: 3 }}>
              Nenhum benefício cadastrado para esta categoria.
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
}
