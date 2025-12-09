import React, { useState, useEffect } from 'react';
import { EjercicioUpdate, RutinaModificarRequest, RutinaResponse } from '../../types/Rutina_Models';
import { DiaSemana } from '../../types/Value_objects';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Paper, Button, Box, Typography, IconButton, CircularProgress, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import EjercicioForm from '../ejercicios/EjercicioForm';

// Tipo extendido compatible con EjercicioForm
interface EjercicioLocal {
  id: number; // Positivo para existentes, 0 o negativo para nuevos
  nombre: string;
  dia_semana: DiaSemana;
  series: number;
  repeticiones: number;
  peso: number | null;
  notas: string;
  orden: number;
}

interface ModalEditarRutinaProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rutinaId: number, data: RutinaModificarRequest) => Promise<void>;
  loading?: boolean;
  rutina?: RutinaResponse | null;
  title?: string;
}

const ModalEditarRutina: React.FC<ModalEditarRutinaProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  rutina,
  title = "Editar Rutina"
}) => {
  const [rutinaData, setRutinaData] = useState<{
    nombre: string;
    descripcion: string;
    ejercicios: EjercicioLocal[];
  }>({
    nombre: '',
    descripcion: '',
    ejercicios: []
  });
  
  const [ejerciciosAEliminar, setEjerciciosAEliminar] = useState<number[]>([]);
  const [errores, setErrores] = useState<Record<string, string>>({});

  // Inicializar datos cuando se abre el modal o cambia la rutina
  useEffect(() => {
    if (rutina && open) {
      setRutinaData({
        nombre: rutina.nombre,
        descripcion: rutina.descripcion || '',
        ejercicios: rutina.ejercicios.map(ej => ({
          id: ej.id, // Número positivo para existentes
          nombre: ej.nombre,
          dia_semana: ej.dia_semana,
          series: ej.series,
          repeticiones: ej.repeticiones,
          peso: ej.peso,
          notas: ej.notas || '',
          orden: ej.orden
        }))
      });
      setEjerciciosAEliminar([]);
      setErrores({});
    } else if (!open) {
      // Resetear cuando se cierra
      setRutinaData({
        nombre: '',
        descripcion: '',
        ejercicios: []
      });
      setEjerciciosAEliminar([]);
      setErrores({});
    }
  }, [rutina, open]);

  const handleRutinaChange = (field: 'nombre' | 'descripcion', value: string) => {
    setRutinaData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errores[field]) {
      setErrores(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEjercicioChange = (index: number, field: keyof EjercicioLocal, value: any) => {
    const nuevosEjercicios = [...rutinaData.ejercicios];
    nuevosEjercicios[index] = {
      ...nuevosEjercicios[index],
      [field]: value
    };
    
    setRutinaData(prev => ({
      ...prev,
      ejercicios: nuevosEjercicios
    }));
    
    // Limpiar error
    const errorKey = `ejercicios.${index}.${field}`;
    if (errores[errorKey]) {
      setErrores(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const agregarEjercicio = () => {
    const nuevosEjercicios = [...rutinaData.ejercicios];
    nuevosEjercicios.push({
      id: 0, // 0 indica "nuevo ejercicio" (enviará null al backend)
      nombre: '',
      dia_semana: DiaSemana.LUNES,
      series: 3,
      repeticiones: 10,
      peso: null,
      notas: '',
      orden: nuevosEjercicios.length + 1
    });
    setRutinaData(prev => ({
      ...prev,
      ejercicios: nuevosEjercicios
    }));
  };

  const eliminarEjercicio = (index: number) => {
    const ejercicio = rutinaData.ejercicios[index];
    if (!ejercicio) return;

    const nuevosEjercicios = [...rutinaData.ejercicios];
    
    // Solo agregar a eliminación si es ejercicio existente (ID > 0)
    if (ejercicio.id > 0) {
      setEjerciciosAEliminar(prev => [...prev, ejercicio.id]);
    }
    
    // Eliminar del array local
    nuevosEjercicios.splice(index, 1);
    
    // Reordenar los ejercicios restantes
    nuevosEjercicios.forEach((ej, idx) => {
      ej.orden = idx + 1;
    });
    
    setRutinaData(prev => ({
      ...prev,
      ejercicios: nuevosEjercicios
    }));
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    // Validar nombre de rutina
    if (!rutinaData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre de la rutina es requerido';
    } else if (rutinaData.nombre.length > 100) {
      nuevosErrores.nombre = 'El nombre no puede tener más de 100 caracteres';
    }

    // Validar descripción
    if (rutinaData.descripcion && rutinaData.descripcion.length > 500) {
      nuevosErrores.descripcion = 'La descripción no puede tener más de 500 caracteres';
    }

    // Validar ejercicios
    rutinaData.ejercicios.forEach((ejercicio, index) => {
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

      if (ejercicio.peso !== null && ejercicio.peso < 0) {
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
    if (!rutina || !validarFormulario()) {
      return;
    }

    try {
      // Preparar datos para enviar según RutinaModificarRequest
      const ejerciciosParaEnviar: EjercicioUpdate[] = rutinaData.ejercicios.map(ej => {
        // ID: number para existentes, null para nuevos
        const id = ej.id > 0 ? ej.id : null;
        
        return {
          id: id,
          nombre: ej.nombre.trim(),
          dia_semana: ej.dia_semana,
          series: ej.series,
          repeticiones: ej.repeticiones,
          peso: ej.peso,
          notas: ej.notas?.trim() || null,
          orden: ej.orden
        };
      });

      const datosModificacion: RutinaModificarRequest = {
        nombre: rutinaData.nombre.trim(),
        descripcion: rutinaData.descripcion?.trim() || null,
        ejercicios_a_modificar_o_crear: ejerciciosParaEnviar.length > 0 ? ejerciciosParaEnviar : undefined,
        ids_ejercicios_a_eliminar: ejerciciosAEliminar.length > 0 ? ejerciciosAEliminar : undefined
      };
      await onSubmit(rutina.id, datosModificacion);
      onClose();
    } catch (error) {
      console.error('Error en handleSubmit:', error);
    }
  };

  const getError = (field: string): string | undefined => {
    return errores[field];
  };

  const canDeleteEjercicio = rutinaData.ejercicios.length > 0;

  return (
    <Dialog 
      open={open} 
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title}</Typography>
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
          <Typography variant="body1" align='center' color='rgba(240, 34, 34, 1)' sx={{ mb: 2 }}>
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
                  value={rutinaData.nombre}
                  onChange={(e) => handleRutinaChange('nombre', e.target.value)}
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
                    value={rutinaData.descripcion || ''}
                    onChange={(e) => handleRutinaChange('descripcion', e.target.value)}
                    disabled={loading}
                    error={!!getError('descripcion')}
                    helperText={getError('descripcion')}
                    multiline
                    rows={3}  
                    variant="outlined"
                    size="small"
                
                  />
                </Box>  
                <Box
                  component="img"
                  src="/images/medititeC.png" 
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
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h6">
                  Ejercicios ({rutinaData.ejercicios.length})
                </Typography>
                {ejerciciosAEliminar.length > 0 && (
                  <Chip 
                    label={`${ejerciciosAEliminar.length} marcado(s) para eliminar`}
                    color="error" 
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
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

            {rutinaData.ejercicios.map((ejercicio, index) => (
              <EjercicioForm
                key={ejercicio.id > 0 ? `existente-${ejercicio.id}` : `nuevo-${index}`}
                ejercicio={{
                  nombre: ejercicio.nombre,
                  dia_semana: ejercicio.dia_semana,
                  series: ejercicio.series,
                  repeticiones: ejercicio.repeticiones,
                  peso: ejercicio.peso,
                  notas: ejercicio.notas || '',
                  orden: ejercicio.orden
                }}
                index={index}
                onChange={handleEjercicioChange}
                onDelete={eliminarEjercicio}
                loading={loading}
                errors={errores}
                canDelete={canDeleteEjercicio}
              />
            ))}

            {rutinaData.ejercicios.length === 0 && (
              <Box textAlign="center" py={4}>
                <Typography variant="body2" color="textSecondary">
                  No hay ejercicios en esta rutina. Agrega al menos un ejercicio.
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
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEditarRutina;