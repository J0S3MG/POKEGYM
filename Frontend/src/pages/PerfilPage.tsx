// pages/PerfilPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Typography,
  Grid
} from '@mui/material';
import PerfilInfo from '../components/perfil/PerfilInfo';
import EstadisticasPerfil from '../components/perfil/EstadisticasPerfil';
import AvatarSelector from '../components/perfil/AvatarSelector';
import NotificationHistory from '../components/common/NotificationHistory';

const PerfilPage: React.FC = () => {
  const { usuario } = useAuth();
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  // Cargar avatar guardado en localStorage
  useEffect(() => {
    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar) {
      setUserAvatar(savedAvatar);
    }
  }, []);

  const handleEditProfile = () => {
    // Abrir modal de selección de avatar
    setAvatarDialogOpen(true);
  };

  const handleSelectAvatar = (avatarUrl: string) => {
  // Guardar avatar seleccionado
  setUserAvatar(avatarUrl);
  localStorage.setItem('user_avatar', avatarUrl);
  
  // Disparar evento para actualizar el layout
  const event = new CustomEvent('avatarUpdated');
  window.dispatchEvent(event);
  
  // Aquí podrías enviar el avatar al backend si lo necesitas
  console.log('Avatar seleccionado:', avatarUrl);
};


  return (
    <Box sx={{ p: 3 }}>
  <Typography variant="h4" gutterBottom sx={{ color: '#FFDE00', mb: 4 }}>
    Mi Perfil
  </Typography>

  {/* Contenedor principal usando flexbox */}
  <Box sx={{ 
    display: 'flex', 
    flexDirection: { xs: 'column', md: 'row' },
    gap: 2,
    alignItems: 'stretch'
  }}>
    {/* Información del usuario - Ocupa 1/3 en desktop */}
    <Box sx={{ 
      width: { xs: '100%', md: '33.33%' },
      flexShrink: 0
    }}>
      <PerfilInfo 
        usuario={usuario}
        currentAvatar={userAvatar || undefined}
        onEditProfile={handleEditProfile}
      />
    </Box>

    {/* Estadísticas - Ocupa 2/3 en desktop */}
    <Box sx={{ 
      width: { xs: '100%', md: '66.67%' },
      flexGrow: 1
    }}>
      <EstadisticasPerfil usuario={usuario} />
    </Box>
  </Box>

  {/* Historial de Actividad/Notificaciones - Debajo en todas las pantallas */}
  <Box sx={{ mt: 3 }}>
    <NotificationHistory />
  </Box>

  {/* Diálogo para seleccionar avatar */}
  <AvatarSelector
    open={avatarDialogOpen}
    onClose={() => setAvatarDialogOpen(false)}
    currentAvatar={userAvatar || undefined}
    onSelectAvatar={handleSelectAvatar}
  />
</Box>
  );
};

export default PerfilPage;