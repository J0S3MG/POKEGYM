import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTestimonios } from '../context/TestimonioContext';
import { Container, Box, Typography, Button, Grid, Paper, Avatar, Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import Carousel from '../components/common/Carousel';
import TestimonioCard from '../components/testimonios/TestimonioCard';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { testimonios, isLoading, error } = useTestimonios();
  
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          py: 8,
          textAlign: 'center',
          color: 'white',
          background: 'linear-gradient(135deg, rgba(7, 3, 22, 0.2) 0%, rgba(7, 3, 22, 0.2) 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(7, 3, 22, 0.2) 0%, transparent 50%)',
            zIndex: 0,
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 4, 
            mb: 4,
            flexDirection: { xs: 'column', md: 'row' }
          }}>
            <Box
              component="img"
              src="/images/KubfuIzq.png" 
              alt="Pokémon izquierdo"
              sx={{
                height: { xs: 140, md: 220 },
                width: 'auto',
                filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))',
                animation: 'float 3s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-20px)' },
                }
              }}
            />
            
            <Box sx={{ textAlign: 'center' }}>
              <Box
                component="img"
                src="/images/Logo.png" 
                alt="Logo"
                sx={{
                  height: { xs: 70, md: 100 },
                  width: 'auto',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                  mb: 3
                }}
              />
              <Typography 
                variant="h1"
                gutterBottom
                sx={{ 
                   color: 'pokemon'
                }}
              >
                POKEGYM
              </Typography>
             
              <Typography 
                variant="h5" 
                sx={{ 
                  opacity: 0.95,
                  maxWidth: 600,
                  mx: 'auto',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                }}
              >
                Tu compañero perfecto para gestionar tus rutinas de entrenamiento
              </Typography>
            </Box>
          
            <Box
              component="img"
              src="/images/KubfuDer.png"
              alt="Pokémon derecho"
              sx={{
                height: { xs: 140, md: 220 },
                width: 'auto',
                filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))',
                animation: 'float 3s ease-in-out infinite',
                animationDelay: '0.5s',
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Sección de Testimonios con Carrusel */}
      <Box sx={{ 
        py: 10, 
        bgcolor: 'rgba(7, 3, 22, 0.2)', 
      }}>
        <Container maxWidth="lg">
          {isLoading ? (
            <Typography align="center">Cargando testimonios...</Typography>
          ) : error ? (
            <Typography align="center" color="error">{error}</Typography>
          ) : (
            <>
              {/* Carrusel para pantallas grandes */}
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Carousel 
                  slidesToShow={3}
                  autoplay={true}
                  autoplaySpeed={3200}
                  dots={true}
                  infinite={true}
                >
                  {testimonios.map((testimonio) => (
                    <Box key={testimonio.id} sx={{ p: 1 }}>
                      <TestimonioCard testimonio={testimonio} />
                    </Box>
                  ))}
                </Carousel>
              </Box>
              
              {/* Versión estática para móviles */}
              <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <Grid container spacing={3} justifyContent="center">
                  {testimonios.slice(0, 2).map((testimonio) => (
                    <Grid item xs={12} sm={6} key={testimonio.id} {...{} as any}>
                      <Paper 
                        elevation={3}
                        sx={{ 
                          p: 3, 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(5px)',
                          borderRadius: 2,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: 'primary.main',
                              mr: 2,
                              width: 50,
                              height: 50,
                              fontSize: '1rem',
                              fontWeight: 'bold',
                            }}
                          >
                            {testimonio.avatar}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight={600}>
                              {testimonio.nombre}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {testimonio.ocupacion}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            mb: 2, 
                            fontStyle: 'italic',
                            fontSize: '0.95rem',
                          }}
                        >
                          "{testimonio.comentario}"
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating
                            value={testimonio.rating}
                            readOnly
                            size="small"
                            icon={<StarIcon fontSize="small" sx={{ color: '#ffb400' }} />}
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {testimonio.rating}.0/5.0
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </>
          )}
        </Container>
      </Box>

  
      {/* Features Section con fondo semitransparente */}
      <Box sx={{ 
        bgcolor: 'rgba(7, 3, 22, 0.2)',
        py: 6,
      }}>
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              mb: 4,
              color: 'pokemon',
              fontWeight: 700,
            }}
          >
            Características principales
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
            gap: 4,
            textAlign: 'center',
          }}>
            <Box>
               <Box
                component="img"
                src="/images/solrock.png" 
                alt="Logo"
                sx={{
                  height: { xs: 70, md: 100 },
                  width: 'auto',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                  mb: 3
                }}
              />
              <Typography variant="h6" gutterBottom>
                Planificación por Día
              </Typography>
              <Typography variant="body1" color="white">
                Organiza tus ejercicios por día de la semana para un entrenamiento estructurado
              </Typography>
            </Box>
            
            <Box>
             <Box
                component="img"
                src="/images/machampc.png" 
                alt="Logo"
                sx={{
                  height: { xs: 70, md: 100 },
                  width: 'auto',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                  mb: 3
                }}
              />
              <Typography variant="h6" gutterBottom>
                Gestión Intuitiva
              </Typography>
              <Typography variant="body1" color="white">
                Crea, edita y elimina rutinas con una interfaz fácil de usar
              </Typography>
            </Box>
            
            <Box>
               <Box
                component="img"
                src="/images/lucario.png" 
                alt="Logo"
                sx={{
                  height: { xs: 70, md: 100 },
                  width: 'auto',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                  mb: 3
                }}
              />
              <Typography variant="h6" gutterBottom>
                Seguimiento de Progreso
              </Typography>
              <Typography variant="body1" color="white">
                Lleva registro de pesos, repeticiones y observaciones
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          textAlign: 'center',
          bgcolor: 'primary.main',
          background: 'linear-gradient(135deg, rgba(7, 3, 22, 0.2) 0%, rgba(7, 3, 22, 0.2) 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 800, mb: 3 }}>
            ¿Listo para comenzar?
          </Typography>
          <Typography variant="h5" paragraph sx={{ mb: 4, opacity: 0.95 }}>
            Únete a nuestra comunidad y lleva tu entrenamiento al siguiente nivel.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate(isAuthenticated ? '/rutinas' : '/register')}
            sx={{ 
              px: 8,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              borderRadius: 3,
              boxShadow: 4,
              '&:hover': {
                boxShadow: 8,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s'
            }}
          >
            {isAuthenticated ? 'Ir a Mis Rutinas' : 'Comenzar Gratis'}
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;