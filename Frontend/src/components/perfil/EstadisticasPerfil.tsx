import React from 'react';
import { Card, CardContent, Grid, Paper, Typography, Box } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';

interface EstadisticasPerfilProps {
  usuario: any;
  estadisticas?: {
    rutinasCreadas: number;
    diasEntrenados: number;
    nivel: string;
    miembroDesde: string;
  };
}

const EstadisticasPerfil: React.FC<EstadisticasPerfilProps> = ({
  estadisticas = {
    rutinasCreadas: 5,
    diasEntrenados: 24,
    nivel: 'Intermedio',
    miembroDesde: 'Ene 2024'
  }
}) => {
  const stats = [
    { 
      label: 'Rutinas creadas', 
      value: estadisticas.rutinasCreadas.toString(), 
      icon: <FitnessCenterIcon /> 
    },
    { 
      label: 'Días entrenados', 
      value: estadisticas.diasEntrenados.toString(), 
      icon: <CalendarTodayIcon /> 
    },
    { 
      label: 'Nivel', 
      value: estadisticas.nivel, 
      icon: <SecurityIcon /> 
    },
    { 
      label: 'Miembro desde', 
      value: estadisticas.miembroDesde, 
      icon: <PersonIcon /> 
    },
  ];

  return (
    <Card sx={{ 
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      height: '100%'
    }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#FFDE00' }}>
          Estadísticas
        </Typography>
        
        <Grid container spacing={2}>
          {stats.map((stat, index) => (
            <Grid item xs={6} sm={3} key={index} {...{} as any}>
              <Paper sx={{ 
                p: 2, 
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(59, 76, 202, 0.2)',
                border: '1px solid rgba(255, 222, 0, 0.3)',
                minHeight: 100
              }}>
                <Box sx={{ 
                  color: '#FFDE00',
                  mb: 1 
                }}>
                  {stat.icon}
                </Box>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#FFFFFF' }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default EstadisticasPerfil;