import React, { useState } from 'react';
import { Card, CardContent, Typography, Chip, Divider, Box, Paper, Button, Tooltip, IconButton } from '@mui/material';
import NotesIcon from '@mui/icons-material/Notes';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { EjercicioResponse } from '../../types/Rutina_Models';
import { DiaSemana } from '../../types/Value_objects';
import ExerciseDialog from './EjercicioDialog';
import DeleteExerciseDialog from './EjercicioDeleteDialog';

interface DayCardProps {
  day: string;
  date: Date;
  exercises: EjercicioResponse[];
  isToday: boolean;
  rutinaId: number;
  onAddExercise: (exerciseData: {
    nombre: string;
    dia_semana: DiaSemana;
    series: number;
    repeticiones: number;
    peso: number | null;
    notas: string | null;
    orden: number;
  }) => Promise<void>;
  onEditExercise: (exerciseId: number, exerciseData: {
    nombre: string;
    dia_semana: DiaSemana;
    series: number;
    repeticiones: number;
    peso: number | null;
    notas: string | null;
    orden: number;
  }) => Promise<void>;
  onDeleteExercise: (exerciseId: number) => Promise<void>;
  onRefresh?: () => void;
}

// Función para convertir string de día a enum DiaSemana
const convertirDiaSemana = (diaString: string): DiaSemana => {
  const diasMap: Record<string, DiaSemana> = {
    'Lunes': DiaSemana.LUNES,
    'Martes': DiaSemana.MARTES,
    'Miercoles': DiaSemana.MIERCOLES,
    'Jueves': DiaSemana.JUEVES,
    'Viernes': DiaSemana.VIERNES,
    'Sabado': DiaSemana.SABADO,
    'Domingo': DiaSemana.DOMINGO
  };
  
  return diasMap[diaString] || DiaSemana.LUNES;
};

const DayCard: React.FC<DayCardProps> = ({
  day,
  date,
  exercises,
  isToday,
  onAddExercise,
  onEditExercise,
  onDeleteExercise,
  onRefresh
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<EjercicioResponse | null>(null);
  
  const hasExercises = exercises.length > 0;

  const handleAddClick = () => {
    setShowAddDialog(true);
  };

  const handleEditClick = (exercise: EjercicioResponse) => {
    setSelectedExercise(exercise);
    setShowEditDialog(true);
  };

  const handleDeleteClick = (exercise: EjercicioResponse) => {
    setSelectedExercise(exercise);
    setShowDeleteDialog(true);
  };

  const handleCloseAddDialog = () => {
    setShowAddDialog(false);
  };

  const handleCloseEditDialog = () => {
    setShowEditDialog(false);
    setSelectedExercise(null);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setSelectedExercise(null);
  };

  const handleAddSubmit = async (exerciseData: any) => {
    await onAddExercise(exerciseData);
    setShowAddDialog(false);
    onRefresh?.();
  };

  const handleEditSubmit = async (exerciseId: number, exerciseData: any) => {
    await onEditExercise(exerciseId, exerciseData);
    setShowEditDialog(false);
    setSelectedExercise(null);
    onRefresh?.();
  };

  const handleDeleteSubmit = async (exerciseId: number) => {
    await onDeleteExercise(exerciseId);
    setShowDeleteDialog(false);
    setSelectedExercise(null);
    onRefresh?.();
  };

  // Convertir el día string a enum DiaSemana
  const diaEnum = convertirDiaSemana(day);

 const initialAddExerciseData = {
  nombre: '',
  dia_semana: diaEnum,
  series: 3,
  repeticiones: 10,
  peso: null as number | null,
  notas: null as string | null,
  orden: 1  // CAMBIADO: Siempre empezar desde 1
};

  return (
    <>
      <Card sx={{ 
        height: '100%',
        minHeight: 450,
        border: isToday ? '2px solid #FFDE00' : '1px solid rgba(255, 222, 0, 0.3)',
        backgroundColor: hasExercises 
          ? 'rgba(76, 175, 80, 0.05)' 
          : 'rgba(255, 255, 255, 0.05)',
        opacity: hasExercises ? 1 : 0.7,
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}>
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Encabezado del día con botones */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ 
                color: hasExercises ? '#4CAF50' : 'text.secondary'
              }}>
                {day}
              </Typography>
              {isToday && (
                <Chip
                  label="HOY"
                  size="small"
                  color="warning"
                  sx={{ mt: 0.5, fontSize: '0.6rem', height: 18 }}
                />
              )}
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
               <Typography variant="body1" color="white">
                {date.toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'short' 
                })}
              </Typography>
            </Box>
           
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {/* Lista de ejercicios */}
          {hasExercises ? (
            <Box sx={{ 
              flex: 1, 
              overflowY: 'auto',
              maxHeight: 300,
              pr: 1
            }}>
              {exercises.map((exercise) => (
                <Paper
                  key={exercise.id}
                  elevation={0}
                  sx={{ 
                    p: 1.5, 
                    mb: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: '8px',
                    borderLeft: '3px solid #3B4CCA',
                    position: 'relative',
                    '&:hover .action-buttons': {
                      opacity: 1
                    }
                  }}
                >
                  {/* Botones de acción (solo visibles al hover) */}
                  <Box 
                    className="action-buttons"
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      display: 'flex',
                      gap: 0.5,
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      padding: '2px',
                    }}
                  >
                    <Tooltip title="Editar ejercicio">
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(exercise)}
                        sx={{
                          color: '#2196F3',
                          '&:hover': {
                            backgroundColor: 'rgba(33, 150, 243, 0.1)'
                          }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Eliminar ejercicio">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(exercise)}
                        sx={{
                          color: '#f44336',
                          '&:hover': {
                            backgroundColor: 'rgba(244, 67, 54, 0.1)'
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Typography variant="body2" fontWeight="medium">
                    {exercise.nombre}
                  </Typography>
                  
                  <Box display="flex" gap={2} mt={0.5}>
                    <Typography variant="caption" color="textSecondary">
                      {exercise.series}×{exercise.repeticiones}
                    </Typography>
                    {exercise.peso && (
                      <Typography variant="caption" color="textSecondary">
                        {exercise.peso}kg
                      </Typography>
                    )}
                  </Box>
                  
                  {exercise.notas && (
                    <Tooltip title={exercise.notas}>
                      <Box display="flex" alignItems="center" mt={0.5}>
                        <NotesIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.8rem' }} />
                        <Typography variant="caption" color="textSecondary" noWrap>
                          {exercise.notas.length > 20 
                            ? `${exercise.notas.substring(0, 20)}...` 
                            : exercise.notas}
                        </Typography>
                      </Box>
                    </Tooltip>
                  )}
                </Paper>
              ))}
            </Box>
          ) : (
            <Box sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center', 
              py: 3,
              color: 'text.secondary'
            }}>
              <FitnessCenterIcon sx={{ fontSize: 40, opacity: 0.3, mb: 1 }} />
              <Typography variant="body2">
                Sin ejercicios asignados
              </Typography>
              <Button 
                size="small" 
                variant="outlined" 
                startIcon={<AddIcon />}
                sx={{ mt: 1 }}
                onClick={handleAddClick}
              >
                Agregar ejercicio
              </Button>
            </Box>
          )}
          
          {/* Botón para agregar más ejercicios si ya tiene */}
          {hasExercises && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddClick}
                sx={{
                  borderColor: '#4CAF50',
                  color: '#4CAF50',
                  '&:hover': {
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 79, 0.28)'
                  }
                }}
              >
                Agregar Ejercicio
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para agregar ejercicio */}
      <ExerciseDialog
        open={showAddDialog}
        onClose={handleCloseAddDialog}
        onSubmit={handleAddSubmit}
        mode="add"
        day={day}
        initialData={initialAddExerciseData}
      />

      {/* Diálogo para editar ejercicio */}
      {selectedExercise && (
        <ExerciseDialog
          open={showEditDialog}
          onClose={handleCloseEditDialog}
          onSubmit={(exerciseData) => handleEditSubmit(selectedExercise.id, exerciseData)}
          mode="edit"
          day={day}
          initialData={{
            nombre: selectedExercise.nombre,
            dia_semana: selectedExercise.dia_semana,
            series: selectedExercise.series,
            repeticiones: selectedExercise.repeticiones,
            peso: selectedExercise.peso,
            notas: selectedExercise.notas,
            orden: selectedExercise.orden
          }}
          exerciseName={selectedExercise.nombre}
        />
      )}

      {/* Diálogo para eliminar ejercicio */}
      {selectedExercise && (
        <DeleteExerciseDialog
          open={showDeleteDialog}
          onClose={handleCloseDeleteDialog}
          onSubmit={() => handleDeleteSubmit(selectedExercise.id)}
          exerciseName={selectedExercise.nombre}
        />
      )}
    </>
  );
};

export default DayCard;