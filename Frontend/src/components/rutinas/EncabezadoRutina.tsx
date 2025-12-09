import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Divider } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface WeekSelectorProps {
  Title: string;
  desc: string | null;
  startDate: Date;
  endDate: Date;
  cantej: number;
  fecha: string;
  activeDays: number;
  onCurrentWeek: () => void;
}

const EncabezadoRutina: React.FC<WeekSelectorProps> = ({
  Title,
  startDate,
  desc,
  endDate,
  cantej,
  fecha,
  activeDays
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
 <Card sx={{ 
  mb: 3, 
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
}}>
  <CardContent>
    {/* Contenedor principal para desktop (logos + contenido) */}
    <Box sx={{ 
      display: { xs: 'none', md: 'flex' }, // Solo visible en desktop
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
    }}>
      {/* Logo izquierdo */}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
        <Box
          component="img"
          src="/images/Urshifu.png"
          alt="Logo"
          sx={{
            height: 200,
            width: 'auto',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
          }}
        />
      </Box>
      
      {/* Contenido central - APILADO VERTICALMENTE */}
      <Box sx={{ 
        flex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
        {/* Título */}
        <Typography variant="h5" sx={{ 
          color: '#FFDE00',
          fontWeight: 'bold',
          mb: 1,
          textShadow: '2px 2px 0 #3B4CCA'
        }}>
          {Title}
        </Typography>
        
        {/* Fecha */}
        <Typography variant="caption" color="textSecondary" sx={{ mb: 2 }}>
          {formatDate(startDate)} - {formatDate(endDate)}
        </Typography>
        
        {/* Línea divisoria */}
        <Divider sx={{ 
          width: '80%', 
          my: 2, 
          borderColor: 'rgba(255, 222, 0, 0.3)' 
        }} />
        
        {/* Chips - APILADOS VERTICALMENTE (no horizontal) */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          mt: 1,
          mb: 2,
          width: '100%',
          maxWidth: '300px',
        }}>
          <Chip
            icon={<FitnessCenterIcon />}
            label={`${cantej} ejercicios`}
            size="small"
            variant="outlined"
            sx={{ 
              backgroundColor: 'rgba(255, 222, 0, 0.1)', 
              borderColor: '#FFDE00',
              color: '#FFDE00',
              width: '100%',
              justifyContent: 'flex-start',
            }}
          />
          <Chip
            icon={<ScheduleIcon />}
            label={`Creada: ${new Date(fecha).toLocaleDateString()}`}
            size="small"
            variant="outlined"
            sx={{ 
              color: 'white',
              width: '100%',
              justifyContent: 'flex-start',
            }}
          />
          <Chip
            icon={<CalendarTodayIcon />}
            label={`${activeDays} días activos`}
            size="small"
            variant="outlined"
            sx={{ 
              backgroundColor: 'rgba(59, 76, 202, 0.1)', 
              borderColor: '#3B4CCA',
              color: '#FFDE00',
              width: '100%',
              justifyContent: 'flex-start',
            }}
          />
        </Box>
        
        {/* Descripción */}
        {desc && (
          <Box sx={{ mt: 2, maxWidth: '600px' }}>
            <Typography 
              variant="body2" 
              color="white" 
              sx={{ 
                fontStyle: 'italic',
                opacity: 0.9
              }}
            >
              {desc}
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Logo derecho */}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Box
          component="img"
          src="/images/Hawlucha.png"
          alt="Logo"
          sx={{
            height: 200,
            width: 'auto',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            transform: 'scaleX(-1)',
          }}
        />
      </Box>
    </Box>
    
    {/* Versión móvil (sin logos, solo contenido apilado) */}
    <Box sx={{ 
      display: { xs: 'flex', md: 'none' }, // Solo visible en móvil
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      {/* Título */}
      <Typography variant="h5" sx={{ 
        color: '#FFDE00',
        fontWeight: 'bold',
        mb: 1,
        textShadow: '2px 2px 0 #3B4CCA'
      }}>
        {Title}
      </Typography>
      
      {/* Fecha */}
      <Typography variant="caption" color="textSecondary" sx={{ mb: 1 }}>
        {formatDate(startDate)} - {formatDate(endDate)}
      </Typography>
      
      {/* Línea divisoria */}
      <Divider sx={{ 
        width: '80%', 
        my: 2, 
        borderColor: 'rgba(255, 222, 0, 0.3)' 
      }} />
      
      {/* Chips - APILADOS VERTICALMENTE */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        mt: 1,
        mb: 2,
        width: '100%',
        maxWidth: '300px',
      }}>
        <Chip
          icon={<FitnessCenterIcon />}
          label={`${cantej} ejercicios`}
          size="small"
          variant="outlined"
          sx={{ 
            backgroundColor: 'rgba(255, 222, 0, 0.1)', 
            borderColor: '#FFDE00',
            color: '#FFDE00',
            width: '100%',
            justifyContent: 'flex-start',
          }}
        />
        <Chip
          icon={<ScheduleIcon />}
          label={`Creada: ${new Date(fecha).toLocaleDateString()}`}
          size="small"
          variant="outlined"
          sx={{ 
            color: 'white',
            width: '100%',
            justifyContent: 'flex-start',
          }}
        />
        <Chip
          icon={<CalendarTodayIcon />}
          label={`${activeDays} días activos`}
          size="small"
          variant="outlined"
          sx={{ 
            backgroundColor: 'rgba(59, 76, 202, 0.1)', 
            borderColor: '#3B4CCA',
            color: '#FFDE00',
            width: '100%',
            justifyContent: 'flex-start',
          }}
        />
      </Box>
      
      {/* Descripción */}
      {desc && (
        <Box sx={{ mt: 2, width: '100%' }}>
          <Typography 
            variant="body2" 
            color="white" 
            sx={{ 
              fontStyle: 'italic',
              opacity: 0.9
            }}
          >
            {desc}
          </Typography>
        </Box>
      )}
    </Box>
  </CardContent>
</Card>
  );
};

export default EncabezadoRutina;