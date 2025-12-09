import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { EjercicioResponse } from '../../types/Rutina_Models';

interface WeekSummaryProps {
  exercisesByDay: Record<string, EjercicioResponse[]>;
  totalExercises: number;
  activeDays: number;
}

const WeekSummary: React.FC<WeekSummaryProps> = ({
  exercisesByDay,
  totalExercises,
  activeDays
}) => {
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const shortDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <Card sx={{ mt: 3, backgroundColor: 'rgba(59, 76, 202, 0.1)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#FFDE00' }}>
          Resumen de la Semana
        </Typography>
        <Grid container spacing={2}>
          {daysOfWeek.map((day, index) => {
            const exercises = exercisesByDay[day] || [];
            return (
              <Grid item xs={6} sm={4} md={3} lg={2} key={day} {...{} as any}>
                <Box sx={{ 
                  textAlign: 'center',
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: exercises.length > 0 
                    ? 'rgba(76, 175, 80, 0.2)' 
                    : 'rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 2
                  }
                }}>
                  <Typography variant="caption" display="block" color="textSecondary">
                    {shortDays[index]}
                  </Typography>
                  <Typography variant="h6" color={exercises.length > 0 ? '#4CAF50' : 'text.secondary'}>
                    {exercises.length}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    ej.
                  </Typography>
                </Box>
              </Grid>
            );
          })}
          <Grid item xs={12} {...{} as any}>
            <Box sx={{ 
              textAlign: 'center',
              p: 2,
              mt: 1,
              backgroundColor: 'rgba(255, 222, 0, 0.1)',
              borderRadius: 2,
              border: '1px solid rgba(255, 222, 0, 0.3)'
            }}>
              <Typography variant="body1">
                <strong>Total semanal:</strong> {totalExercises} ejercicios en {activeDays} días
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WeekSummary;