// import React from 'react';
// import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
// import { purple } from '@mui/material/colors';

// Criar um tema personalizado com cores roxas

// function MyApp({ Component, pageProps }) {
  //   return (
    //     <ThemeProvider theme={theme}>
    //       <CssBaseline />
    //       <Component {...pageProps} />
//     </ThemeProvider>
//   );
// }

// export default MyApp;

import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from '../contexts/AuthContext';
import { purple } from '@mui/material/colors';

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
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#1976d2',
//     },
//     secondary: {
//       main: '#dc004e',
//     },
//   },
//   typography: {
//     fontFamily: [
//       'Roboto',
//       'Arial',
//       'sans-serif',
//     ].join(','),
//   },
// });

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;