import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Rating } from '@mui/material';

export interface Testimonio {
  id: number;
  nombre: string;
  avatar: string; // Puede ser una URL de imagen o iniciales
  avatarType: 'image' | 'initials'; // Nuevo: para distinguir tipo
  ocupacion: string;
  comentario: string;
  rating: number;
}

interface TestimonioCardProps {
  testimonio: Testimonio;
}

const TestimonioCard: React.FC<TestimonioCardProps> = ({ testimonio }) => {
  return (
    <Box>
      <Card sx={{ 
        height: 280,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: 2,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'box-shadow 0.3s',
        '&:hover': {
          boxShadow: 4,
        },
      }}>
        <CardContent sx={{ 
          flexGrow: 1, 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}>
          {/* Comentario */}
          <Box sx={{ 
            flexGrow: 4,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Typography 
              variant="body1" 
              align="center"
              sx={{ 
                fontStyle: 'italic',
                color: 'white',
                lineHeight: 1.5,
                maxHeight: '72px',
                overflow: 'hidden',
              }}
            >
              "{testimonio.comentario}"
            </Typography>
          </Box>

          {/* Rating */}
          <Box sx={{ 
            mb: 2, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <Rating 
              value={testimonio.rating} 
              readOnly 
              size="small"
              sx={{ color: '#ffb400' }}
            />
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mt: 0.5 }}
            >
              {testimonio.rating}.0/5.0
            </Typography>
          </Box>

          {/* Información del usuario */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}>
            {/* Avatar con imagen o iniciales */}
            {testimonio.avatarType === 'image' ? (
              <Avatar 
                src={testimonio.avatar} // Usa src para imagen
                alt={testimonio.nombre}
                sx={{ 
                  width: 50,
                  height: 50,
                  mb: 1.5,
                  border: '2px solid',
                  borderColor: 'primary.main',
                }}
              />
            ) : (
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main',
                  width: 50,
                  height: 50,
                  mb: 1.5,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
              >
                {testimonio.avatar}
              </Avatar>
            )}
            <Box>
              <Typography 
                variant="subtitle1" 
                fontWeight="bold"
                sx={{ fontSize: '1rem' }}
              >
                {testimonio.nombre}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: '0.85rem' }}
              >
                {testimonio.ocupacion}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default TestimonioCard;