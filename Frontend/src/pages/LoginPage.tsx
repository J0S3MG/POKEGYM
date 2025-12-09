import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Paper, TextField, Button, Typography, Box, Alert, CircularProgress } from '@mui/material';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // CORREGIDO: Pasar parámetros separados, no un objeto
      await login(username, password);
      navigate('/rutinas');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 222, 0, 0.3)',
          }}
        >
          <Typography variant="h4" align="center" gutterBottom sx={{ color: '#FFDE00' }}>
            Iniciar Sesión
          </Typography>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Username"  
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              autoComplete="username"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#FFFFFF',
                  '& fieldset': {
                    borderColor: 'rgba(255, 222, 0, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FFDE00',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 222, 0, 0.8)',
                },
              }}
            />
            
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              autoComplete="current-password"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#FFFFFF',
                  '& fieldset': {
                    borderColor: 'rgba(255, 222, 0, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FFDE00',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 222, 0, 0.8)',
                },
              }}
            />
            
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mt: 3,
                backgroundColor: '#3B4CCA',
                color: '#FFDE00',
                border: '2px solid #FFDE00',
                '&:hover': {
                  backgroundColor: '#2B3CAA',
                },
                '&:disabled': {
                  backgroundColor: 'rgba(59, 76, 202, 0.5)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#FFDE00' }} /> : 'Iniciar Sesión'}
            </Button>
          </form>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              ¿No tienes cuenta?{' '}
              <Button
                sx={{ color: '#FFDE00' }}
                onClick={() => navigate('/register')}
                disabled={loading}
              >
                Regístrate
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;