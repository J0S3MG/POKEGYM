import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { rutinasApi, ejerciciosApi } from '../api/Api';
import { RutinaResponse, EjercicioResponse, EjercicioUpdate } from '../types/Rutina_Models';
import { DiaSemana } from '../types/Value_objects';
import { Box, Typography, Button, CircularProgress, Alert, useTheme, useMediaQuery } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNotifications } from '../context/NotificationContext';
import DayCard from '../components/ejercicios/DayCard';
import Encabezado from '../components/rutinas/EncabezadoRutina';
import WeekSummary from '../components/rutinas/WeekSummary';

// Utils functions
const getWeekDates = (weekOffset = 0) => {
  const now = new Date();
  const currentDay = now.getDay();
  const dayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + dayOffset + (weekOffset * 7));
  
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(date);
  }
  
  return weekDates;
};

const RutinaDetallePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rutina, setRutina] = useState<RutinaResponse | null>(null);
  const { showSuccess, showError } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const diasSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
  
  // Obtener fechas de la semana
  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const currentWeekStart = weekDates[0];
  const currentWeekEnd = weekDates[6];

  // Referencia para el scroll horizontal
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Función para agregar ejercicio
  const handleAddExercise = async (exerciseData: {
    nombre: string;
    dia_semana: DiaSemana;
    series: number;
    repeticiones: number;
    peso: number | null;
    notas: string | null;
    orden: number;
  }) => {
    try {
      if (!id) throw new Error('ID de rutina no válido');
      
      console.log('Agregando ejercicio:', exerciseData);
      
      const response = await ejerciciosApi.create(parseInt(id), {
        nombre: exerciseData.nombre.trim(),
        dia_semana: exerciseData.dia_semana,
        series: exerciseData.series,
        repeticiones: exerciseData.repeticiones,
        peso: exerciseData.peso,
        notas: exerciseData.notas,
        orden: exerciseData.orden
      });

      console.log('Ejercicio agregado exitosamente:', response.data);
      
      // Actualizar la rutina con la nueva versión
      setRutina(response.data);
      
      showSuccess(
        'Ejercicio agregado',
        `"${exerciseData.nombre}" ha sido agregado a ${exerciseData.dia_semana}`
      );
      
      return response.data;
    } catch (err: any) {
      console.error('Error al agregar ejercicio:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.detail || 'Error al agregar ejercicio';
      showError('Error al agregar', errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Función para eliminar ejercicio
  const handleDeleteExercise = async (exerciseId: number) => {
    try {
      console.log('Eliminando ejercicio ID:', exerciseId);
      await ejerciciosApi.delete(exerciseId);
      
      // Actualizar la rutina localmente eliminando el ejercicio
      if (rutina) {
        const updatedExercises = rutina.ejercicios.filter(ej => ej.id !== exerciseId);
        setRutina({
          ...rutina,
          ejercicios: updatedExercises
        });
      }
      
      showSuccess(
        'Ejercicio eliminado',
        'El ejercicio ha sido eliminado exitosamente'
      );
    } catch (err: any) {
      console.error('Error al eliminar ejercicio:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.detail || 'Error al eliminar ejercicio';
      showError('Error al eliminar', errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Función para editar ejercicio CORREGIDA
  const handleEditExercise = async (exerciseId: number, exerciseData: {
    nombre: string;
    dia_semana: DiaSemana;
    series: number;
    repeticiones: number;
    peso: number | null;
    notas: string | null;
    orden: number;
  }) => {
    try {
      console.log('Editando ejercicio ID:', exerciseId);
      console.log('Datos a enviar:', exerciseData);

      // IMPORTANTE: El ID debe estar presente en el objeto de actualización
      const updateData: EjercicioUpdate = {
        id: exerciseId, // El ID es obligatorio para identificar qué ejercicio modificar
        nombre: exerciseData.nombre.trim(),
        dia_semana: exerciseData.dia_semana,
        series: exerciseData.series,
        repeticiones: exerciseData.repeticiones,
        peso: exerciseData.peso === 0 ? null : exerciseData.peso, // Convertir 0 a null
        notas: exerciseData.notas,
        orden: exerciseData.orden
      };

      console.log('Enviando datos de actualización:', updateData);

      const response = await ejerciciosApi.update(exerciseId, updateData);

      console.log('Respuesta del backend:', response.data);

      // Actualizar la rutina localmente con la nueva versión
      if (rutina) {
        // Forzar un refresh completo de la rutina desde el backend
        // para asegurar que los cambios se reflejen correctamente
        fetchRutina();
      }
      
      showSuccess(
        'Ejercicio actualizado',
        `"${exerciseData.nombre}" ha sido actualizado`
      );
      
      return response.data;
    } catch (err: any) {
      console.error('Error detallado al actualizar ejercicio:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.detail || 'Error al actualizar ejercicio';
      showError('Error al actualizar', errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Función para refrescar la rutina
  const refreshRutina = () => {
    fetchRutina();
  };

  useEffect(() => {
    if (id) {
      fetchRutina();
    }
  }, [id]);

  const fetchRutina = async () => {
    try {
      setLoading(true);
      console.log('Cargando rutina ID:', id);
      const response = await rutinasApi.getById(id!);
      console.log('Rutina cargada:', response.data);
      setRutina(response.data);
      setError('');
    } catch (err: any) {
      console.error('Error cargando rutina:', err.response?.data || err.message);
      setError('Error al cargar la rutina: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Agrupar ejercicios por día
  const exercisesByDay = useMemo(() => {
    if (!rutina) return {};
    console.log('Agrupando ejercicios por día para rutina:', rutina.id);
    const grupos: Record<string, EjercicioResponse[]> = {};
    rutina.ejercicios.forEach(ejercicio => {
      if (!grupos[ejercicio.dia_semana]) {
        grupos[ejercicio.dia_semana] = [];
      }
      grupos[ejercicio.dia_semana].push(ejercicio);
    });
    console.log('Ejercicios agrupados:', grupos);
    return grupos;
  }, [rutina]);

  // Obtener ejercicios para un día específico
  const getExercisesForDay = (day: string) => {
    const exercises = exercisesByDay[day] || [];
    console.log(`Ejercicios para ${day}:`, exercises);
    return exercises;
  };

  // Calcular días activos
  const activeDays = useMemo(() => {
    const count = Object.keys(exercisesByDay).length;
    console.log('Días activos:', count);
    return count;
  }, [exercisesByDay]);

  const handleCurrentWeek = () => setWeekOffset(0);

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/rutinas')}
        >
          Volver a rutinas
        </Button>
      </Box>
    );
  }

  // No rutina found
  if (!rutina) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Rutina no encontrada
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/rutinas')}
        >
          Volver a rutinas
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header con botón volver y editar */}
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'flex-start' }} mb={3} gap={2}>
        <Box flex={1}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/rutinas')}
            sx={{ mb: 2 }}
          >
            Volver a rutinas
          </Button>
        </Box>
      </Box>

      {/* Encabezado con información de la rutina */}
      <Encabezado
        Title={rutina.nombre}
        desc={rutina.descripcion}
        startDate={currentWeekStart}
        endDate={currentWeekEnd}
        cantej={rutina.ejercicios.length}
        fecha={rutina.fecha_creacion}
        activeDays={activeDays}
        onCurrentWeek={handleCurrentWeek}
      />

      {isMobile ? (
        // Versión móvil: Grid responsive
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)'
            },
            gap: 2,
            width: '100%',
            mb: 3,
            '& > *': {
              minWidth: 0
            }
          }}
        >
          {diasSemana.map((dia, index) => {
            const fecha = weekDates[index];
            const esHoy = new Date().toDateString() === fecha.toDateString();
            const ejerciciosDia = getExercisesForDay(dia);
            
            return (
              <DayCard
                key={dia}
                day={dia}
                date={fecha}
                exercises={ejerciciosDia}
                isToday={esHoy}
                rutinaId={parseInt(id!)}
                onAddExercise={handleAddExercise}
                onEditExercise={handleEditExercise} 
                onDeleteExercise={handleDeleteExercise}
                onRefresh={refreshRutina}
              />
            );
          })}
        </Box>
      ) : (
        // Versión desktop: Scroll horizontal con tarjetas más grandes
        <Box
          ref={scrollContainerRef}
          sx={{
            display: 'flex',
            gap: 3,
            width: '100%',
            mb: 4,
            overflowX: 'auto',
            overflowY: 'hidden',
            py: 2,
            px: 1,
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              height: '12px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'linear-gradient(90deg, #3B4CCA, #FFDE00)',
              borderRadius: '10px',
              '&:hover': {
                background: 'linear-gradient(90deg, #FFDE00, #3B4CCA)',
              }
            },
            // Para Firefox
            scrollbarWidth: 'thin',
            scrollbarColor: '#3B4CCA rgba(255, 255, 255, 0.1)',
          }}
        >
          {diasSemana.map((dia, index) => {
            const fecha = weekDates[index];
            const esHoy = new Date().toDateString() === fecha.toDateString();
            const ejerciciosDia = getExercisesForDay(dia);
            
            return (
              <Box
                key={dia}
                sx={{
                  flex: '0 0 auto',
                  width: {
                    md: '320px',
                    lg: '350px',
                    xl: '350px'
                  },
                  height: '500px',
                }}
              >
                <DayCard
                  day={dia}
                  date={fecha}
                  exercises={ejerciciosDia}
                  isToday={esHoy}
                  rutinaId={parseInt(id!)}
                  onAddExercise={handleAddExercise}
                  onDeleteExercise={handleDeleteExercise}
                  onEditExercise={handleEditExercise}
                  onRefresh={refreshRutina}
                />
              </Box>
            );
          })}
        </Box>
      )}
      
      {/* Week Summary */}
      <WeekSummary
        exercisesByDay={exercisesByDay}
        totalExercises={rutina.ejercicios.length}
        activeDays={activeDays}
      />
    </Box>
  );
};

export default RutinaDetallePage;