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

      <Grid container spacing={3}>
        {/* Información del usuario */}
        <Grid item xs={12} md={4} {...{} as any}>
          <PerfilInfo 
            usuario={usuario}
            currentAvatar={userAvatar || undefined}
            onEditProfile={handleEditProfile}
          />
        </Grid>

        {/* Estadísticas */}
        <Grid item xs={12} md={8} {...{} as any}>
          <EstadisticasPerfil usuario={usuario} />
        </Grid>
      </Grid>

      {/* Historial de Actividad/Notificaciones */}
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