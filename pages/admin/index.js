import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Container } from '@mui/material';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const storedHashedPassword = '3c177b7b8a4da8da41ccdfe0fb800b58147aca59dff04098180e145791582476';

  const handleLogin = async (e) => {
    e.preventDefault();

    // Gera hash da senha digitada
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedInputPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (hashedInputPassword === storedHashedPassword) {
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

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