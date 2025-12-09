import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, CircularProgress, Alert, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface DeleteExerciseDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  exerciseName: string;
}

const EjercicioDeleteDialog: React.FC<DeleteExerciseDialogProps> = ({
  open,
  onClose,
  onSubmit,
  exerciseName
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      await onSubmit();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar ejercicio');
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
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
          backgroundColor: 'rgba(5, 12, 62, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '3px solid #FF0000',
          borderRadius: '16px',
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: 'rgba(57, 10, 7, 0.18)',
        borderBottom: '2px solid #FFDE00',
        py: 2
      }}>
        <Box display="flex" alignItems="center" gap={1}>
          <DeleteIcon sx={{ color: '#FFDE00' }} />
          <Typography variant="h6" sx={{ 
            color: '#FFDE00',
            textShadow: '2px 2px 0 #1D2C9E'
          }}>
            Eliminar Ejercicio
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ 
        backgroundColor: 'rgba(11, 22, 100, 0.2)',
        pt: 3
      }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Typography variant="body1" sx={{ color: '#FFFFFF', mb: 2 }}>
          ¿Estás seguro de eliminar el ejercicio "<strong style={{ color: '#FFDE00' }}>{exerciseName}</strong>"?
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        py: 2,
        backgroundColor: 'rgba(6, 11, 49, 0.21)',
        borderTop: '2px solid rgba(255, 222, 0, 0.4)'
      }}>
        <Button 
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: '#FFDE00',
            border: '2px solid #FFDE00',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 222, 0, 0.1)',
              borderColor: '#FFFFFF',
            }
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} sx={{ color: '#FFDE00' }} /> : <DeleteIcon />}
          sx={{
            background: 'linear-gradient(45deg, rgba(244, 67, 54, 0.9) 30%, rgba(211, 47, 47, 0.9) 90%)',
            color: '#FFDE00',
            border: '2px solid #FFDE00',
            '&:hover': {
              background: 'linear-gradient(45deg, rgba(211, 47, 47, 0.9) 30%, rgba(244, 67, 54, 0.9) 90%)',
              borderColor: '#FFFFFF',
            }
          }}
        >
          {loading ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EjercicioDeleteDialog;