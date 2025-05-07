import React from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { purple } from '@mui/material/colors';

// Criar um tema personalizado com cores roxas
const theme = createTheme({
  palette: {
    primary: {
      main: purple[700], // Cor roxa como cor principal
    },
    secondary: {
      main: purple[500], // Cor roxa mais clara como secundária
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;