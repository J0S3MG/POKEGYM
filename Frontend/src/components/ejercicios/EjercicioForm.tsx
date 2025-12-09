import React from 'react';
import { EjercicioCreate } from '../../types/Rutina_Models';
import { DiaSemana } from '../../types/Value_objects';
import { Paper, Grid, Select, MenuItem, FormControl, InputLabel, IconButton, Box, Typography, Tooltip, TextField } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import NumericField from '../common/NumericField';

interface EjercicioFormProps {
  ejercicio: EjercicioCreate;
  index: number;
  onChange: (index: number, field: keyof EjercicioCreate, value: any) => void;
  onDelete: (index: number) => void;
  loading: boolean;
  errors: Record<string, string>;
  canDelete: boolean;
}

const EjercicioForm: React.FC<EjercicioFormProps> = ({
  ejercicio,
  index,
  onChange,
  onDelete,
  loading,
  errors,
  canDelete
}) => {
  const getError = (field: string): string | undefined => {
    return errors[`ejercicios.${index}.${field}`];
  };

  return (
    <Paper
      elevation={1}
      sx={{ 
        p: 2, 
        mb: 2,
        position: 'relative',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderLeft: '4px solid',
        borderColor: 'primary.main'
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle2" color="textSecondary">
          Ejercicio #{index + 1}
        </Typography>
        {canDelete && (
          <Tooltip title="Eliminar ejercicio">
            <IconButton
              size="small"
              onClick={() => onDelete(index)}
              disabled={loading}
              color="error"
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Grid container spacing={2} alignItems="center">

         {/* Día de la semana */}
        <Grid item xs={6} md={3} {...{} as any}>
          <FormControl fullWidth size="small">
            <InputLabel>Día</InputLabel>
            <Select
              value={ejercicio.dia_semana}
              label="Día"
              onChange={(e) => onChange(index, 'dia_semana', e.target.value)}
              disabled={loading}
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
        </Grid>

        {/* Nombre del ejercicio */}
        <Grid item xs={12} md={6} {...{} as any}>
          <TextField
            fullWidth
            label="Nombre del ejercicio *"
            value={ejercicio.nombre}
            onChange={(e) => onChange(index, 'nombre', e.target.value)}
            disabled={loading}
            error={!!getError('nombre')}
            helperText={getError('nombre')}
            required
            size="small"
            variant="outlined"
          />
        </Grid>

        {/* Orden con incremento/decremento por rueda */}
        <Grid item xs={6} md={3} {...{} as any}>
          <NumericField
            label="Orden"
            value={ejercicio.orden}
            onChange={(value) => onChange(index, 'orden', value)}
            disabled={loading}
            error={getError('orden')}
            helperText={getError('orden')}
            min={1}
            step={1}
          />
        </Grid>
        
        {/* Series con incremento/decremento por rueda */}
        <Grid item xs={6} md={3} {...{} as any}>
          <NumericField
            label="Series"
            value={ejercicio.series}
            onChange={(value) => onChange(index, 'series', value)}
            disabled={loading}
            error={getError('series')}
            helperText={getError('series')}
            min={1}
            step={1}
            required
          />
        </Grid>
        
        {/* Repeticiones con incremento/decremento por rueda */}
        <Grid item xs={6} md={3} {...{} as any}>
          <NumericField
            label="Repeticiones"
            value={ejercicio.repeticiones}
            onChange={(value) => onChange(index, 'repeticiones', value)}
            disabled={loading}
            error={getError('repeticiones')}
            helperText={getError('repeticiones')}
            min={1}
            step={1}
            required
          />
        </Grid>
        
        {/* Peso (opcional) - AHORA CON NUMERICFIELD */}
        <Grid item xs={6} md={3} {...{} as any}>
          <NumericField
            label="Peso (kg)"
            value={ejercicio.peso || 0}
            onChange={(value) => onChange(index, 'peso', value === 0 ? null : value)}
            disabled={loading}
            error={getError('peso')}
            helperText={getError('peso')}
            min={0}
            step={2.5}
          />
        </Grid>
        
        {/* Notas (opcional) */}
        <Box sx={{ width: '100%', maxWidth: 800 }}>
          <TextField
            fullWidth
            label="Notas (opcional)"
            value={ejercicio.notas || ''}
            onChange={(e) => onChange(index, 'notas', e.target.value)}
            disabled={loading}
            error={!!getError('notas')}
            helperText={getError('notas')}
            multiline
            rows={2}
            size="small"
            variant="outlined"
          />
        </Box>
      </Grid>
    </Paper>
  );
};

export default EjercicioForm;