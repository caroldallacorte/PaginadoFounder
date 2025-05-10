import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, Container, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext'; 

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth(); 

  // Check if user is already authenticated and redirect if needed
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Call the context's login function instead of directly setting sessionStorage
        login(data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Senha incorreta. Tente novamente.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Erro ao tentar fazer login. Por favor, tente novamente.');
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  // If already authenticated, we'll redirect in the useEffect
  // This prevents the login form from briefly appearing during redirect
  if (isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Acesso Administrativo
        </Typography>

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
          >
            Entrar
          </Button>

          <Button
            fullWidth
            variant="text"
            onClick={() => router.push('/')}
            sx={{ mt: 2 }}
          >
            Voltar para o site
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}