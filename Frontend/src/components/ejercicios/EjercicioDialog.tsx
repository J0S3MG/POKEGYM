import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Typography, IconButton, Button, CircularProgress, Alert, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { DiaSemana } from '../../types/Value_objects';

interface ExerciseDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (exerciseData: {
    nombre: string;
    dia_semana: DiaSemana;
    series: number;
    repeticiones: number;
    peso: number | null;
    notas: string | null;
    orden: number;
  }) => Promise<void>;
  mode: 'add' | 'edit';
  day: string;
  initialData: {
    nombre: string;
    dia_semana: DiaSemana;
    series: number;
    repeticiones: number;
    peso: number | null;
    notas: string | null;
    orden: number;
  };
  exerciseName?: string;
}

const EjercicioDialog: React.FC<ExerciseDialogProps> = ({
  open,
  onClose,
  onSubmit,
  mode,
  day,
  initialData,
  exerciseName
}) => {
  const [exerciseData, setExerciseData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Validaciones
    if (!exerciseData.nombre.trim()) {
      setError('El nombre del ejercicio es requerido');
      return;
    }

    if (exerciseData.series < 1) {
      setError('Las series deben ser al menos 1');
      return;
    }

    if (exerciseData.repeticiones < 1) {
      setError('Las repeticiones deben ser al menos 1');
      return;
    }

    if (exerciseData.peso !== null && exerciseData.peso < 0) {
      setError('El peso no puede ser negativo');
      return;
    }

    if (exerciseData.orden < 1) {
      setError('El orden debe ser al menos 1');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit(exerciseData);
    } catch (err: any) {
      setError(err.message || `Error al ${mode === 'add' ? 'agregar' : 'editar'} ejercicio`);
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setExerciseData(initialData);
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(7, 12, 44, 0.1)', // MUY transparente
          backdropFilter: 'blur(35px)', // Más blur
          border: '1px solid rgba(255, 222, 0, 0.3)', // Borde muy sutil
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: 'rgba(7, 12, 44, 0.05)', // Casi transparente
        borderBottom: '1px solid rgba(255, 222, 0, 0.2)',
        py: 1.5,
        backdropFilter: 'blur(15px)'
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ 
            color: '#FFDE00',
            textShadow: '0px 0px 10px rgba(255, 222, 0, 0.5)',
            fontWeight: 600
          }}>
            {mode === 'add' ? `Agregar Ejercicio - ${day}` : `Editar Ejercicio - ${exerciseName}`}
          </Typography>
          <IconButton 
            onClick={handleClose}
            disabled={loading}
            size="small"
            sx={{ 
              color: 'rgba(255, 222, 0, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 222, 0, 0.1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers sx={{ 
        backgroundColor: 'rgba(7, 12, 44, 0.03)', // CASI invisible
        backdropFilter: 'blur(15px)'
      }}>
        {error && (
          <Alert severity="error" sx={{ 
            mb: 2,
            backgroundColor: 'rgba(211, 47, 47, 0.15)',
            color: '#ffcdd2',
            border: '1px solid rgba(244, 67, 54, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ pt: 1 }}>
          {/* Nombre del ejercicio */}
          <TextField
            fullWidth
            label="Nombre del ejercicio*"
            value={exerciseData.nombre}
            onChange={(e) => setExerciseData({...exerciseData, nombre: e.target.value})}
            disabled={loading}
            sx={{ mb: 2 }}
            autoFocus
            InputLabelProps={{
              sx: { 
                color: 'rgba(255, 222, 0, 0.9)',
                fontWeight: 500 
              }
            }}
            InputProps={{
              sx: {
                color: '#FFFFFF',
                backgroundColor: 'rgba(7, 12, 44, 0.08)', // Muy transparente
                '& fieldset': {
                  borderColor: 'rgba(255, 222, 0, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 222, 0, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFDE00',
                  borderWidth: '1px'
                }
              }
            }}
          />

          {/* Día de la semana - Solo en modo edición se puede cambiar */}
          {mode === 'edit' && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ 
                color: 'rgba(255, 222, 0, 0.9)',
                fontWeight: 500 
              }}>Día</InputLabel>
              <Select
                value={exerciseData.dia_semana}
                label="Día"
                onChange={(e) => setExerciseData({
                  ...exerciseData, 
                  dia_semana: e.target.value as DiaSemana
                })}
                disabled={loading}
                sx={{
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(7, 12, 44, 0.08)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 222, 0, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 222, 0, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FFDE00',
                    borderWidth: '1px'
                  }
                }}
              >
                <MenuItem value={DiaSemana.LUNES}>Lunes</MenuItem>
                <MenuItem value={DiaSemana.MARTES}>Martes</MenuItem>
                <MenuItem value={DiaSemana.MIERCOLES}>Miércoles</MenuItem>
                <MenuItem value={DiaSemana.JUEVES}>Jueves</MenuItem>
                <MenuItem value={DiaSemana.VIERNES}>Viernes</MenuItem>
                <MenuItem value={DiaSemana.SABADO}>Sábado</MenuItem>
                <MenuItem value={DiaSemana.DOMINGO}>Domingo</MenuItem>
              </Select>
            </FormControl>
          )}
          
          {/* Series y Repeticiones */}
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="Series*"
              type="number"
              value={exerciseData.series}
              onChange={(e) => setExerciseData({...exerciseData, series: parseInt(e.target.value) || 0})}
              disabled={loading}
              sx={{ flex: 1 }}
              InputLabelProps={{
                sx: { 
                  color: 'rgba(255, 222, 0, 0.9)',
                  fontWeight: 500 
                }
              }}
              InputProps={{ 
                inputProps: { min: 1 },
                sx: {
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(7, 12, 44, 0.08)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 222, 0, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 222, 0, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FFDE00',
                    borderWidth: '1px'
                  }
                }
              }}
            />
            
            <TextField
              label="Repeticiones*"
              type="number"
              value={exerciseData.repeticiones}
              onChange={(e) => setExerciseData({...exerciseData, repeticiones: parseInt(e.target.value) || 0})}
              disabled={loading}
              sx={{ flex: 1 }}
              InputLabelProps={{
                sx: { 
                  color: 'rgba(255, 222, 0, 0.9)',
                  fontWeight: 500 
                }
              }}
              InputProps={{ 
                inputProps: { min: 1 },
                sx: {
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(7, 12, 44, 0.08)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 222, 0, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 222, 0, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FFDE00',
                    borderWidth: '1px'
                  }
                }
              }}
            />
          </Box>

          {/* Línea divisoria */}
          <Divider sx={{ 
            borderColor: 'rgba(255, 222, 0, 0.15)',
            my: 2
          }} />

          {/* Peso */}
          <Typography variant="subtitle2" sx={{ 
            color: 'rgba(255, 222, 0, 0.9)',
            mb: 1,
            fontWeight: 500
          }}>
            Peso (kg) - Opcional
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={exerciseData.peso || ''}
            onChange={(e) => setExerciseData({
              ...exerciseData, 
              peso: e.target.value === '' ? null : Number(e.target.value)
            })}
            disabled={loading}
            sx={{ mb: 2 }}
            InputLabelProps={{
              sx: { 
                color: 'rgba(255, 222, 0, 0.9)',
                fontWeight: 500 
              }
            }}
            InputProps={{ 
              inputProps: { min: 0, step: 0.5 },
              sx: {
                color: '#FFFFFF',
                backgroundColor: 'rgba(7, 12, 44, 0.08)',
                '& fieldset': {
                  borderColor: 'rgba(255, 222, 0, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 222, 0, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFDE00',
                  borderWidth: '1px'
                }
              }
            }}
            placeholder="0.0"
          />

          {/* Notas */}
          <Typography variant="subtitle2" sx={{ 
            color: 'rgba(255, 222, 0, 0.9)',
            mb: 1,
            fontWeight: 500
          }}>
            Notas - Opcional
          </Typography>
          <TextField
            fullWidth
            value={exerciseData.notas || ''}
            onChange={(e) => setExerciseData({
              ...exerciseData, 
              notas: e.target.value || null
            })}
            disabled={loading}
            multiline
            rows={2}
            sx={{ mb: 2 }}
            InputLabelProps={{
              sx: { 
                color: 'rgba(255, 222, 0, 0.9)',
                fontWeight: 500 
              }
            }}
            InputProps={{
              sx: {
                color: '#FFFFFF',
                backgroundColor: 'rgba(7, 12, 44, 0.08)',
                '& fieldset': {
                  borderColor: 'rgba(255, 222, 0, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 222, 0, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFDE00',
                  borderWidth: '1px'
                }
              }
            }}
          />

          {/* Orden - Solo en modo edición */}
          {mode === 'edit' && (
            <>
              <Typography variant="subtitle2" sx={{ 
                color: 'rgba(255, 222, 0, 0.9)',
                mb: 1,
                fontWeight: 500
              }}>
                Orden
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={exerciseData.orden}
                onChange={(e) => setExerciseData({
                  ...exerciseData, 
                  orden: parseInt(e.target.value) || 1
                })}
                disabled={loading}
                InputLabelProps={{
                  sx: { 
                    color: 'rgba(255, 222, 0, 0.9)',
                    fontWeight: 500 
                  }
                }}
                InputProps={{ 
                  inputProps: { min: 1 },
                  sx: {
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(7, 12, 44, 0.08)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 222, 0, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 222, 0, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FFDE00',
                      borderWidth: '1px'
                    }
                  }
                }}
              />
            </>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 2, 
        py: 1.5,
        backgroundColor: 'rgba(7, 12, 44, 0.03)', // CASI invisible
        borderTop: '1px solid rgba(255, 222, 0, 0.15)',
        backdropFilter: 'blur(15px)'
      }}>
        <Button 
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: 'rgba(255, 222, 0, 0.9)',
            border: '1px solid rgba(255, 222, 0, 0.3)',
            backgroundColor: 'rgba(7, 12, 44, 0.05)',
            padding: '6px 16px',
            fontSize: '0.875rem',
            '&:hover': {
              backgroundColor: 'rgba(255, 222, 0, 0.1)',
              borderColor: 'rgba(255, 222, 0, 0.7)',
            }
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          startIcon={loading ? <CircularProgress size={18} sx={{ color: '#FFDE00' }} /> : 
            mode === 'add' ? <AddIcon /> : <EditIcon />}
          sx={{
            background: mode === 'add' 
              ? 'linear-gradient(45deg, rgba(76, 175, 80, 0.4) 30%, rgba(56, 142, 60, 0.4) 90%)'
              : 'linear-gradient(45deg, rgba(33, 150, 243, 0.4) 30%, rgba(25, 118, 210, 0.4) 90%)',
            color: '#FFDE00',
            border: '1px solid rgba(255, 222, 0, 0.4)',
            padding: '6px 16px',
            fontSize: '0.875rem',
            '&:hover': {
              background: mode === 'add'
                ? 'linear-gradient(45deg, rgba(56, 142, 60, 0.6) 30%, rgba(76, 175, 80, 0.6) 90%)'
                : 'linear-gradient(45deg, rgba(25, 118, 210, 0.6) 30%, rgba(33, 150, 243, 0.6) 90%)',
              borderColor: 'rgba(255, 222, 0, 0.8)',
            },
            '& .MuiButton-startIcon': {
              marginRight: '4px'
            }
          }}
        >
          {loading ? (mode === 'add' ? 'Agregando...' : 'Guardando...') : 
            (mode === 'add' ? '+ Agregar' : 'Guardar Cambios')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EjercicioDialog;