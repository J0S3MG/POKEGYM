import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3B4CCA',
      light: '#6A7BFF',
      dark: '#1D2C9E',
      contrastText: '#FFDE00',
    },
    secondary: {
      main: '#FF0000',
      light: '#FF5252',
      dark: '#B71C1C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: 'transparent', // Cambiado a transparente
      paper: 'rgba(255, 255, 255, 0.85)', // Más transparente
    },
    pokemon: {
     
    } as any,
  },
  typography: {
    fontFamily: '"Press Start 2P", "Orbitron", "Roboto", sans-serif',
    h1: {
      fontFamily: '"Press Start 2P", cursive',
      fontWeight: 400,
      fontSize: '2.8rem',
      color: '#FFDE00', // Blanco para mejor contraste
     textShadow: '4px 4px 0 #3B4CCA, 6px 6px 0 rgba(0,0,0,0.2)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      textAlign: 'center',
    },
    h2: {
      fontFamily: '"Press Start 2P", cursive',
      fontWeight: 400,
      fontSize: '2rem',
      color: '#FFDE00',
      textShadow: '3px 3px 0 #3B4CCA, 6px 6px 0 rgba(0,0,0,0.2)',
      letterSpacing: '0.05em',
    },
    h3: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 700,
      fontSize: '1.8rem',
      color: '#FFFFFF',
      textShadow: '0 0 10px rgba(255, 222, 0, 0.8)',
      textTransform: 'uppercase',
    },
    h4: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#FFDE00',
      textShadow: '2px 2px 0 #FF0000',
    },
    h5: {
      fontFamily: '"Press Start 2P", cursive',
      fontWeight: 400,
      fontSize: '1.1rem',
      color: '#FFFFFF',
      textShadow: '1px 1px 0 #3B4CCA',
    },
    h6: {
      fontFamily: '"Press Start 2P", cursive',
      fontWeight: 400,
      fontSize: '0.9rem',
      color: '#FFDE00',
    },
    body1: {
      fontFamily: '"Roboto", sans-serif',
      fontSize: '1rem',
      color: '#FFFFFF',
      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
    },
    body2: {
      fontFamily: '"Roboto", sans-serif',
      fontSize: '0.875rem',
      color: 'rgba(255, 255, 255, 0.9)',
    },
    button: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
  },
  components: {
     MuiAlert: {
    styleOverrides: {
      root: {
        fontFamily: '"Press Start 2P", cursive',
        '&.MuiAlert-success': {
          '& .MuiAlert-icon': {
            color: '#4CAF50',
          }
        },
        '&.MuiAlert-error': {
          '& .MuiAlert-icon': {
            color: '#F44336',
          }
        },
        '&.MuiAlert-warning': {
          '& .MuiAlert-icon': {
            color: '#FFC107',
          }
        },
        '&.MuiAlert-info': {
          '& .MuiAlert-icon': {
            color: '#2196F3',
          }
        }
      },
      message: {
        fontFamily: '"Roboto", sans-serif',
      }
    }},
    MuiCssBaseline: {
      styleOverrides: {
        '@import': `url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Rubik+Mono+One&family=Orbitron:wght@400;500;600;700;800;900&display=swap')`,
        body: {
          backgroundImage: `
            linear-gradient(
              to bottom,
              rgba(7, 3, 22, 0.7) 0%,
              rgba(59, 76, 202, 0.4) 50%,
              rgba(255, 0, 0, 0.3) 100%
            ),
            url('/images/FondoGYM.jpg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          margin: 0,
          fontFamily: '"Roboto", sans-serif',
          color: '#FFFFFF',
        },
        // Overlay más sutil
        'body::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(7, 3, 22, 0.4)', // Overlay oscuro pero transparente
          zIndex: -1,
          backdropFilter: 'blur(2px)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, rgba(59, 76, 202, 0.95) 0%, rgba(29, 44, 158, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '3px solid #FFDE00',
          boxShadow: '0 4px 30px rgba(255, 222, 0, 0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '25px',
          fontWeight: 700,
          textTransform: 'uppercase',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, rgba(59, 76, 202, 0.9) 30%, rgba(29, 44, 158, 0.9) 90%)',
          color: '#FFDE00',
          border: '2px solid #FFDE00',
          backdropFilter: 'blur(5px)',
          '&:hover': {
            background: 'linear-gradient(45deg, rgba(29, 44, 158, 0.9) 30%, rgba(59, 76, 202, 0.9) 90%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, rgba(255, 0, 0, 0.9) 30%, rgba(204, 0, 0, 0.9) 90%)',
          color: '#FFFFFF',
          border: '2px solid #FFDE00',
          backdropFilter: 'blur(5px)',
          '&:hover': {
            background: 'linear-gradient(45deg, rgba(204, 0, 0, 0.9) 30%, rgba(255, 0, 0, 0.9) 90%)',
          },
        },
        outlined: {
          border: '2px solid #FFDE00',
          color: '#FFDE00',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 222, 0, 0.1)',
            border: '2px solid #FFFFFF',
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 3,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.15)', // Muy transparente
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 222, 0, 0.3)',
          color: '#FFFFFF',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.12)', // Transparente
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(255, 222, 0, 0.4)',
          borderRadius: '20px',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #FF0000, #FFDE00, #3B4CCA)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    // Inputs transparentes
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px)',
            color: '#FFFFFF',
            '& fieldset': {
              borderColor: 'rgba(255, 222, 0, 0.5)',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: '#FFDE00',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF0000',
              boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 222, 0, 0.8)',
            '&.Mui-focused': {
              color: '#FF0000',
            },
          },
        },
      },
    },
    
    // Transparencia para otros componentes
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(7, 3, 22, 0.9)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(7, 3, 22, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 222, 0, 0.3)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: 'rgba(59, 76, 202, 0.3)',
            color: '#FFDE00',
          },
        },
      },
    },
    
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 2px 10px rgba(0, 0, 0, 0.2)',
    '0 5px 20px rgba(255, 222, 0, 0.2)',
    '0 8px 30px rgba(59, 76, 202, 0.3)',
    '0 10px 40px rgba(255, 0, 0, 0.2)',
    ...Array(20).fill('0 15px 50px rgba(0, 0, 0, 0.4)'),
  ] as any,
});

declare module '@mui/material/styles' {
  interface Palette {
    pokemon: {
      yellow: string;
      blue: string;
      red: string;
      darkBlue: string;
      lightBlue: string;
    };
  }
  interface PaletteOptions {
    pokemon?: {
      yellow: string;
      blue: string;
      red: string;
      darkBlue: string;
      lightBlue: string;
    };
  }
}