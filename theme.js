'use client';
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
  typography: {
    fontFamily: '"Noto Sans","Helvetica","Arial",sans-serif',
    h1: {
      fontSize: '1.6em',
      fontWeight: 'bold',
      margin: '16px 0',
    },
    h2: {
      fontSize: '1.3em',
      fontWeight: 'bold',
      margin: '16px 0',
      border: '0',
      borderLeft: 'solid 5px dodgerblue',
      paddingLeft: '7px',
    },
    h3: {
      fontSize: '1.1em',
      fontWeight: 'bold',
      margin: '16px 0',
      borderLeft: 'solid 5px dodgerblue',
      backgroundColor: '#deebf7',
      display: 'block !important',
      padding: '7px 10px',
    },
  },
  palette: {
    primary: {
      main: '#f5f5f5',
    },
    secondary: {
      main: '#2196f3',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
