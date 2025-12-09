import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Box, Alert, CircularProgress} from '@mui/material';

const RegisterPage: React.FC = () => {

  const [formData, setFormData] = useState({
    username: '',      
    password: '',
    confirmPassword: '',
    full_name: '',    
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      setSuccess('¡Registro exitoso! Redirigiendo al login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      // Manejar errores específicos de FastAPI
      const errorDetail = err.response?.data?.detail;
      
      if (typeof errorDetail === 'string') {
        setError(errorDetail);
      } else if (Array.isArray(errorDetail)) {
        // Si es una lista de errores (common en Pydantic)
        const errorMessages = errorDetail.map((e: any) => {
          if (e.msg && e.loc) {
            return `${e.loc.join('.')}: ${e.msg}`;
          }
          return JSON.stringify(e);
        }).join(', ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.detail || 'Error al registrar usuario');
      }
      
      console.error('Error en registro:', err.response?.data || err.message);
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
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Registrarse
          </Typography>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            
           {/* Campo Username */}
            <Box sx={{ mt: 2, mb: 1 }}>
                <Typography 
                    variant="body1" 
                    color="white"
                    sx={{ 
                        display: 'block',
                        mb: 1,
                        fontSize: '0.9rem',
                        fontWeight: 500
                    }}
                    align="center"
                >
                    Este será tu nombre de usuario para iniciar sesión
                </Typography>
                <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    autoComplete="username"
                    size="medium"
                />
            </Box>

            
            {/* CAMBIADO: full_name en lugar de nombre/apellido */}
            <TextField
              fullWidth
              label="Nombre completo (opcional)"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              margin="normal"
              disabled={loading}
              autoComplete="name"
            />
            
    
            {/* Campo Contraseña */}
            <Box sx={{ mt: 2, mb: 1 }}>
                <Typography 
                    variant="body1"
                    color="white"
                    sx={{ 
                        display: 'block',
                        mb: 1,
                        fontSize: '1rem',
                        fontWeight: 500
                    }}
                    align="center"
                >
                    Mínimo 8 caracteres
                </Typography>
                <TextField
                    fullWidth
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    autoComplete="new-password"
                    size="medium"
                />
            </Box>
            <TextField
              fullWidth
              label="Confirmar Contraseña"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              autoComplete="new-password"
            />
            
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Registrarse'}
            </Button>
          </form>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body1" color="white">
              ¿Ya tienes cuenta?{' '}
              <Button
                sx={{ color: '#FFDE00' }}
                onClick={() => navigate('/login')}
                disabled={loading}
              >
                Iniciar Sesion
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;