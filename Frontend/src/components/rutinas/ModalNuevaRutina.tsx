import React, { useState } from 'react';
import { RutinaConEjerciciosCreate, EjercicioCreate } from '../../types/Rutina_Models';
import { DiaSemana } from '../../types/Value_objects';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Paper, Button, Box, Typography, IconButton, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EjercicioForm from '../ejercicios/EjercicioForm';

interface ModalNuevaRutinaProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rutinaData: RutinaConEjerciciosCreate) => Promise<void>;
  loading?: boolean;
}

const ModalNuevaRutina: React.FC<ModalNuevaRutinaProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [nuevaRutina, setNuevaRutina] = useState<RutinaConEjerciciosCreate>({
    nombre: '',
    descripcion: '',
    ejercicios: [{
      nombre: '',
      dia_semana: DiaSemana.LUNES,
      series: 3,
      repeticiones: 10,
      peso: null,
      notas: '',
      orden: 1
    }]
  });

  const [errores, setErrores] = useState<Record<string, string>>({});

  const handleNuevaRutinaChange = (field: keyof RutinaConEjerciciosCreate, value: string) => {
    setNuevaRutina(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar error al modificar
    if (errores[field]) {
      setErrores(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEjercicioChange = (index: number, field: keyof EjercicioCreate, value: any) => {
    const nuevosEjercicios = [...(nuevaRutina.ejercicios || [])];
    nuevosEjercicios[index] = {
      ...nuevosEjercicios[index],
      [field]: value
    };
    setNuevaRutina(prev => ({
      ...prev,
      ejercicios: nuevosEjercicios
    }));
    // Limpiar error al modificar
    const errorKey = `ejercicios.${index}.${field}`;
    if (errores[errorKey]) {
      setErrores(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const agregarEjercicio = () => {
    const nuevosEjercicios = [...(nuevaRutina.ejercicios || [])];
    nuevosEjercicios.push({
      nombre: '',
      dia_semana: DiaSemana.LUNES,
      series: 3,
      repeticiones: 10,
      peso: null,
      notas: '',
      orden: nuevosEjercicios.length + 1
    });
    setNuevaRutina(prev => ({
      ...prev,
      ejercicios: nuevosEjercicios
    }));
  };

  const eliminarEjercicio = (index: number) => {
    if ((nuevaRutina.ejercicios?.length || 0) > 1) {
      const nuevosEjercicios = [...(nuevaRutina.ejercicios || [])];
      nuevosEjercicios.splice(index, 1);
      
      // Reordenar los ejercicios restantes
      nuevosEjercicios.forEach((ej, idx) => {
        ej.orden = idx + 1;
      });
      
      setNuevaRutina(prev => ({
        ...prev,
        ejercicios: nuevosEjercicios
      }));
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    // Validar nombre de rutina
    if (!nuevaRutina.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre de la rutina es requerido';
    } else if (nuevaRutina.nombre.length > 100) {
      nuevosErrores.nombre = 'El nombre no puede tener más de 100 caracteres';
    }

    // Validar descripción
    if (nuevaRutina.descripcion && nuevaRutina.descripcion.length > 500) {
      nuevosErrores.descripcion = 'La descripción no puede tener más de 500 caracteres';
    }

    // Validar ejercicios
    nuevaRutina.ejercicios?.forEach((ejercicio, index) => {
      const prefix = `ejercicios.${index}`;

      if (!ejercicio.nombre.trim()) {
        nuevosErrores[`${prefix}.nombre`] = 'El nombre del ejercicio es requerido';
      } else if (ejercicio.nombre.length > 100) {
        nuevosErrores[`${prefix}.nombre`] = 'El nombre no puede tener más de 100 caracteres';
      }

      if (ejercicio.series < 1) {
        nuevosErrores[`${prefix}.series`] = 'Las series deben ser al menos 1';
      }

      if (ejercicio.repeticiones < 1) {
        nuevosErrores[`${prefix}.repeticiones`] = 'Las repeticiones deben ser al menos 1';
      }

      if (ejercicio.peso !== null && (ejercicio.peso ?? 0) < 0) {
        nuevosErrores[`${prefix}.peso`] = 'El peso no puede ser negativo';
      }

      if (ejercicio.notas && ejercicio.notas.length > 500) {
        nuevosErrores[`${prefix}.notas`] = 'Las notas no pueden tener más de 500 caracteres';
      }

      if (ejercicio.orden < 0) {
        nuevosErrores[`${prefix}.orden`] = 'El orden no puede ser negativo';
      }
    });

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      await onSubmit(nuevaRutina);
      // Resetear formulario después de éxito
      setNuevaRutina({
        nombre: '',
        descripcion: '',
        ejercicios: [{
          nombre: '',
          dia_semana: DiaSemana.LUNES,
          series: 3,
          repeticiones: 10,
          peso: null,
          notas: '',
          orden: 1
        }]
      });
      setErrores({});
    } catch (error) {
      // El error será manejado por el componente padre
    }
  };

  const getError = (field: string): string | undefined => {
    return errores[field];
  };

  const canDeleteEjercicio = (nuevaRutina.ejercicios?.length || 0) > 1;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Crear Nueva Rutina</Typography>
          <IconButton onClick={onClose} size="small" disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
   <DialogContent dividers
    sx={{
      // Estilos del contenido
      background: 'rgba(0, 0, 0, 0.1)',
      
      // Estilos personalizados del scrollbar
      '&::-webkit-scrollbar': {
        width: '14px',
        height: '14px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '10px',
        margin: '4px',
        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'linear-gradient(135deg, #3B4CCA, #FFDE00)',
        borderRadius: '10px',
        border: '3px solid transparent',
        backgroundClip: 'padding-box',
        minHeight: '40px',
        '&:hover': {
          background: 'linear-gradient(135deg, #FFDE00, #3B4CCA)',
        },
        '&:active': {
          background: 'linear-gradient(135deg, #CC0000, #3B4CCA)',
        }
      },
      '&::-webkit-scrollbar-button': {
        display: 'none',
      },
      '&::-webkit-scrollbar-corner': {
        background: 'transparent',
      },
      
      // Para Firefox
      scrollbarWidth: 'thin',
      scrollbarColor: '#3b4ccadd rgba(255, 255, 255, 0.09)',
      scrollbarGutter: 'stable',
      
      // Comportamiento del scroll
      scrollBehavior: 'smooth',
      overflowY: 'auto',
      maxHeight: 'calc(80vh - 140px)', // Altura dinámica
      
      // Padding para que no quede pegado al scrollbar
      pr: 1,
       // Prevenir scroll cuando el mouse está sobre campos numéricos
    '& input[type="number"]:focus, & input[type="number"]:hover': {
      '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
        // Hacer los botones de spinner más visibles
        opacity: 1,
      }
    }
    }}
  >
        <Box sx={{ pt: 2 }}>
          {/* Mensaje informativo sobre campos obligatorios */}
            <Typography variant="body1"  align='center' color='rgba(240, 34, 34, 1)'>
              Los campos marcados con <strong>*</strong> son obligatorios.
            </Typography>
          {/* Información de la rutina */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información de la Rutina
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} {...{} as any}>
                <TextField
                  fullWidth
                  label="Nombre de la rutina *"
                  value={nuevaRutina.nombre}
                  onChange={(e) => handleNuevaRutinaChange('nombre', e.target.value)}
                  disabled={loading}
                  error={!!getError('nombre')}
                  helperText={getError('nombre')}
                  required
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Box sx={{ width: '100%', maxWidth: 400 }}>
                <TextField
                  fullWidth
                  label="Descripción (opcional)"
                  value={nuevaRutina.descripcion || ''}
                  onChange={(e) => handleNuevaRutinaChange('descripcion', e.target.value)}
                  disabled={loading}
                  error={!!getError('descripcion')}
                  helperText={getError('descripcion')}
                  multiline
                  rows={3}  
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      minHeight: '50px'  // Altura mínima aumentada
                    }
                  }}
                />
              </Box>
              <Box
                component="img"
                src="/images/machopC.png" 
                alt="Logo"
                sx={{
                      height: { xs: 70, md: 120 },
                      width: 'auto',
                      mb: 3,
                      animation: 'circularMotion 4s linear infinite',
                      '@keyframes circularMotion': {
                        '0%': { transform: 'translate(0px, 0px)' },
                        '25%': { transform: 'translate(20px, -20px)' },
                        '50%': { transform: 'translate(0px, -40px)' },
                        '75%': { transform: 'translate(-20px, -20px)' },
                        '100%': { transform: 'translate(0px, 0px)' },
                      }
                }}
              />
            </Grid>
          </Paper>

          {/* Ejercicios */}
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">
                Ejercicios {nuevaRutina.ejercicios && `${nuevaRutina.ejercicios.length}`}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={agregarEjercicio}
                disabled={loading}
                size="small"
              >
                Agregar Ejercicio
              </Button>
            </Box>

            {nuevaRutina.ejercicios?.map((ejercicio, index) => (
              <EjercicioForm
                key={index}
                ejercicio={ejercicio}
                index={index}
                onChange={handleEjercicioChange}
                onDelete={eliminarEjercicio}
                loading={loading}
                errors={errores}
                canDelete={canDeleteEjercicio}
              />
            ))}

            {(!nuevaRutina.ejercicios || nuevaRutina.ejercicios.length === 0) && (
              <Box textAlign="center" py={4}>
                <Typography variant="body2" color="textSecondary">
                  No hay ejercicios agregados. Agrega al menos un ejercicio para crear la rutina.
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose}
          disabled={loading}
          color="inherit"
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
        >
          {loading ? 'Creando...' : 'Crear Rutina'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalNuevaRutina;