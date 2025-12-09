import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Grid, IconButton, Button, Typography, Avatar, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

// Opciones de avatares disponibles
const AVATAR_OPTIONS = [
  { id: 1, src: '/images/Primate.jpg', alt: 'Primeape' },
  { id: 2, src: '/images/Machoque.jpg', alt: 'Machamp' },
  { id: 3, src: '/images/LuchaAgua.jpg', alt: 'Poliwrath' },
  { id: 4, src: '/images/Lucario.jpg', alt: 'Lucario' },
  { id: 5, src: '/images/BruceLee.jpg', alt: 'Hitmonlee' },
  { id: 6, src: '/images/LuchaKimono.jpg', alt: 'Throh' },
];

interface AvatarSelectorProps {
  open: boolean;
  onClose: () => void;
  currentAvatar?: string;
  onSelectAvatar: (avatarUrl: string) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  open,
  onClose,
  currentAvatar,
  onSelectAvatar
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(currentAvatar || null);

  const handleSelect = (avatarSrc: string) => {
    setSelectedAvatar(avatarSrc);
  };

  const handleConfirm = () => {
  if (selectedAvatar) {
    onSelectAvatar(selectedAvatar);
    // Disparar evento para actualizar el layout
    const event = new CustomEvent('avatarUpdated');
    window.dispatchEvent(event);
  }
  onClose();
};
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(29, 44, 158, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '3px solid #FFDE00',
          borderRadius: '16px',
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: 'rgba(59, 76, 202, 0.8)',
        borderBottom: '2px solid #FFDE00',
        py: 2
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ color: '#FFDE00' }}>
            Seleccionar Avatar
          </Typography>
          <IconButton 
            onClick={onClose}
            size="small"
            sx={{ color: '#FFDE00' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers sx={{ backgroundColor: 'rgba(29, 44, 158, 0.8)', py: 3 }}>
        <Typography variant="body2" sx={{ color: '#FFFFFF', mb: 3, textAlign: 'center' }}>
          Elige tu avatar preferido para personalizar tu perfil
        </Typography>
        
        <Grid container spacing={2}>
          {AVATAR_OPTIONS.map((avatar) => (
            <Grid item xs={4} sm={3} key={avatar.id} {...{} as any}>
              <Box
                onClick={() => handleSelect(avatar.src)}
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  '&:hover .avatar-hover': {
                    opacity: 1
                  }
                }}
              >
                <Tooltip title={avatar.alt} arrow>
                  <Avatar
                    src={avatar.src}
                    alt={avatar.alt}
                    sx={{
                      width: 80,
                      height: 80,
                      margin: '0 auto',
                      border: selectedAvatar === avatar.src 
                        ? '3px solid #FFDE00' 
                        : '2px solid rgba(255, 222, 0, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        borderColor: '#FFDE00'
                      }
                    }}
                  />
                </Tooltip>
                
                {selectedAvatar === avatar.src && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -5,
                      right: -5,
                      backgroundColor: '#4CAF50',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #FFFFFF'
                    }}
                  >
                    <CheckIcon sx={{ fontSize: 14, color: '#FFFFFF' }} />
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        py: 2,
        backgroundColor: 'rgba(29, 44, 158, 0.8)',
        borderTop: '2px solid rgba(255, 222, 0, 0.4)'
      }}>
        <Button 
          onClick={onClose}
          sx={{
            color: '#FFDE00',
            border: '2px solid #FFDE00',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 222, 0, 0.1)'
            }
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleConfirm}
          variant="contained"
          disabled={!selectedAvatar}
          sx={{
            background: 'linear-gradient(45deg, #4CAF50 30%, #2E7D32 90%)',
            color: '#FFFFFF',
            border: '2px solid #4CAF50',
            '&:hover': {
              background: 'linear-gradient(45deg, #2E7D32 30%, #4CAF50 90%)'
            },
            '&:disabled': {
              opacity: 0.5
            }
          }}
        >
          Confirmar Avatar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AvatarSelector;