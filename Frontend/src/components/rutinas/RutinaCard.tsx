import React, { useState } from 'react';
import { RutinaResponse } from '../../types/Rutina_Models';
import { Card, CardContent, CardActions, Typography, Box, Chip, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

interface RutinaCardProps {
  rutina: RutinaResponse;
  onView: (id: number) => void;
  onEdit: (rutina: RutinaResponse) => void;
  onDelete: (id: number) => Promise<void>;
  onVerDetalle: (id: number) => void;
}

const RutinaCard: React.FC<RutinaCardProps> = ({
  rutina,
  onEdit,
  onDelete,
  onVerDetalle
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const contarEjerciciosPorDia = (ejercicios: any[]) => {
    const count: Record<string, number> = {};
    ejercicios.forEach(ej => {
      count[ej.dia_semana] = (count[ej.dia_semana] || 0) + 1;
    });
    return count;
  };

  const formatearDia = (dia: string) => {
    const diasFormateados: Record<string, string> = {
      'Lunes': 'Lun',
      'Martes': 'Mar',
      'Miércoles': 'Mié',
      'Miercoles': 'Mié',
      'Jueves': 'Jue',
      'Viernes': 'Vie',
      'Sábado': 'Sáb',
      'Sabado': 'Sáb',
      'Domingo': 'Dom'
    };
    return diasFormateados[dia] || dia.substring(0, 3);
  };

  const ejerciciosPorDia = contarEjerciciosPorDia(rutina.ejercicios);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    
    try {
      await onDelete(rutina.id);
      setDeleteDialogOpen(false);
    } catch (error: any) {
      setDeleteError(error.message || 'Error al eliminar la rutina');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = () => {
    onEdit(rutina);
  };

  const additionalInfo = (
    <>
      {rutina.descripcion && (
        <Typography variant="body2">
          <strong>Descripción:</strong> {rutina.descripcion}
        </Typography>
      )}
      <Typography variant="body2">
        <strong>Ejercicios:</strong> {rutina.ejercicios.length}
      </Typography>
      <Typography variant="body2">
        <strong>Creada:</strong> {new Date(rutina.fecha_creacion).toLocaleDateString()}
      </Typography>
    </>
  );

  return (
    <>
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom noWrap title={rutina.nombre}>
            {rutina.nombre}
          </Typography>
          
          {rutina.descripcion && (
            <Typography 
              color="white" 
              variant="body1"
              paragraph 
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
              title={rutina.descripcion}
            >
              {rutina.descripcion}
            </Typography>
          )}
          
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom color="textSecondary">
              Ejercicios por día:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {Object.entries(ejerciciosPorDia).map(([dia, count]) => (
                <Chip
                  key={dia}
                  label={`${formatearDia(dia)}: ${count}`}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.7rem',
                    backgroundColor: 'rgba(255, 222, 0, 0.1)',
                    borderColor: 'rgba(255, 222, 0, 0.3)',
                    color: '#FFFFFF'
                  }}
                />
              ))}
            </Box>
          </Box>
          
          <Typography variant="caption" display="block" mt={2} color="textSecondary">
            Total: {rutina.ejercicios.length} ejercicios
          </Typography>
          
          <Typography variant="caption" display="block" color="textSecondary">
            Creada: {new Date(rutina.fecha_creacion).toLocaleDateString()}
          </Typography>
        </CardContent>
        
        <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
          <Box>
            <Tooltip title="Ver detalle">
              <IconButton
                color="primary"
                onClick={() => onVerDetalle(rutina.id)}
                size="small"
                sx={{ 
                  '&:hover': {
                    backgroundColor: 'rgba(59, 76, 202, 0.1)'
                  }
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar rutina">
              <IconButton
                onClick={handleEditClick}
                size="small"
                sx={{ 
                    color: '#4CAF50', // Código HEX verde
                    '&:hover': {
                        backgroundColor: 'rgba(76, 175, 80, 0.1)'
                    }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Tooltip title="Eliminar rutina">
            <IconButton
              color="error"
              onClick={handleDeleteClick}
              size="small"
              sx={{ 
                '&:hover': {
                  backgroundColor: 'rgba(244, 67, 54, 0.1)'
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        error={deleteError}
        itemName={rutina.nombre}
        itemType="rutina"
        additionalInfo={additionalInfo}
      />
    </>
  );
};

export default RutinaCard;