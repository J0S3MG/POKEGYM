import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, CircularProgress, Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
  error: string | null;
  itemName: string;
  itemType?: string;
  additionalInfo?: React.ReactNode;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  loading,
  error,
  itemType = 'rutina',
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      // Error ya manejado por el componente padre
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      aria-labelledby="delete-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle align='center'>Confirmar eliminación</DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Typography variant="body1" paragraph align='center'>
          ¿Estás seguro de que deseas eliminar la {itemType}?
        </Typography>
        
        <Box sx={{ 
          p: 2, 
          backgroundColor: 'rgba(66, 11, 6, 0.4)',
          borderRadius: 1,
          mt: 2,
          border: '1px solid rgba(244, 67, 54, 0.21)'
        }}>
          <Typography variant="caption" color="error">
            <strong>Advertencia:</strong> Esta acción no se puede deshacer.
          </Typography>
        </Box>
      
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        py: 2,
        borderTop: '1px solid rgba(0, 0, 0, 0.1)'
      }}>
        <Button
          onClick={onClose}
          disabled={loading}
          color="inherit"
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
          color="error"
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
          sx={{
            backgroundColor: '#f44336',
            '&:hover': {
              backgroundColor: '#d32f2f',
            }
          }}
        >
          {loading ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;