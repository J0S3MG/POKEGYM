import React from 'react';
import { Card, CardContent, Avatar, Typography, Chip, Button, Box } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';

interface PerfilInfoProps {
  usuario: any;
  currentAvatar?: string;
  onEditProfile: () => void;
}

const PerfilInfo: React.FC<PerfilInfoProps> = ({
  usuario,
  currentAvatar,
  onEditProfile
}) => {
  const getInitials = () => {
    if (usuario?.full_name) {
      return usuario.full_name[0].toUpperCase();
    }
    if (usuario?.username) {
      return usuario.username[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <Card sx={{ 
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      height: '100%'
    }}>
      <CardContent sx={{ textAlign: 'center', py: 4 }}>
        <Avatar
          src={currentAvatar}
          sx={{
            width: 120,
            height: 120,
            mx: 'auto',
            mb: 3,
            bgcolor: currentAvatar ? 'transparent' : '#3B4CCA',
            fontSize: '2.5rem',
            border: '3px solid #FFDE00',
            backgroundSize: 'cover'
          }}
        >
          {!currentAvatar && getInitials()}
        </Avatar>
        
        <Typography variant="h5" gutterBottom sx={{ color: '#FFFFFF' }}>
          {usuario?.full_name || usuario?.username}
        </Typography>
        
        {usuario?.email && (
          <Chip
            icon={<EmailIcon />}
            label={usuario.email}
            variant="outlined"
            sx={{ 
              mb: 2,
              backgroundColor: 'rgba(255, 222, 0, 0.1)',
              borderColor: '#FFDE00',
              color: '#FFDE00'
            }}
          />
        )}
        
        <Chip
          icon={<EmailIcon />}
          label={usuario?.username}
          variant="outlined"
          sx={{ 
            mb: 3,
            backgroundColor: 'rgba(59, 76, 202, 0.2)',
            borderColor: '#3B4CCA',
            color: '#FFFFFF'
          }}
        />
        
        <Box sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            fullWidth
            onClick={onEditProfile}
            sx={{ 
              borderColor: '#3B4CCA',
              color: '#3B4CCA',
              '&:hover': {
                borderColor: '#FFDE00',
                backgroundColor: 'rgba(255, 222, 0, 0.1)'
              }
            }}
          >
            Editar perfil
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PerfilInfo;