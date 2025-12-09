import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AppBar, Box, Toolbar, Typography, Button, Container, IconButton, Menu, MenuItem, Avatar, Tabs, Tab, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const MainLayout: React.FC = () => {
  const { usuario, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  // Cargar avatar del localStorage
  useEffect(() => {
    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar) {
      setUserAvatar(savedAvatar);
    }
  }, []);

  // Escuchar cambios en el avatar (para actualizar cuando cambia en PerfilPage)
  useEffect(() => {
    const handleAvatarChange = () => {
      const savedAvatar = localStorage.getItem('user_avatar');
      setUserAvatar(savedAvatar);
    };

    // Escuchar evento personalizado para actualizar avatar
    window.addEventListener('avatarUpdated', handleAvatarChange);
    
    // También verificar cada vez que cambia la ubicación
    const interval = setInterval(() => {
      const savedAvatar = localStorage.getItem('user_avatar');
      if (savedAvatar !== userAvatar) {
        setUserAvatar(savedAvatar);
      }
    }, 1000);

    return () => {
      window.removeEventListener('avatarUpdated', handleAvatarChange);
      clearInterval(interval);
    };
  }, [userAvatar]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };

  // Determinar la pestaña activa
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.startsWith('/rutinas')) return 1;
    if (path.startsWith('/calendario')) return 2;
    if (path.startsWith('/perfil')) return 3;
    return 0;
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/rutinas');
        break;
      case 3:
        navigate('/perfil');
        break;
    }
  };

  // Obtener iniciales para el avatar por defecto
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#1D2C9E' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo y título */}
            <Box
              component="img"
              src="/images/Logo.png"
              alt="Logo"
              sx={{
                height: { xs: 25, md: 25 },
                width: 'auto',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                mr: 1,
                ml: -1,
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontFamily: "'Press Start 2P', monospace",
                fontWeight: 400,
                fontSize: { xs: '0.9rem', md: '1.1rem' },
                color: '#fadf15ff',
                textShadow: `
                  3px 3px 0 #3B4CCA,
                  3px 3px 0 #3B4CCA,
                  3px 3px 0 #3B4CCA,
                  3px 3px 0 #3B4CCA,
                  3px 3px 0 #3B4CCA
                `,
                letterSpacing: { xs: '.05rem', md: '.1rem' },
                lineHeight: 1.2,
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            >
              POKEGYM
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            {/* Menú móvil */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="mobile-menu"
                aria-haspopup="true"
                onClick={handleMobileMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="mobile-menu"
                anchorEl={mobileMenuAnchor}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleClose}
                sx={{ mt: 1 }}
              >
                {isAuthenticated ? (
                  // Usa un array en lugar de Fragment
                  [
                    <MenuItem key="home" onClick={() => { navigate('/'); handleClose(); }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={userAvatar || undefined}
                          sx={{ width: 24, height: 24, mr: 1 }}
                        >
                          {!userAvatar && getInitials()}
                        </Avatar>
                        Inicio
                      </Box>
                    </MenuItem>,
                    <MenuItem key="routines" onClick={() => { navigate('/rutinas'); handleClose(); }}>
                      Mis Rutinas
                    </MenuItem>,
                    <MenuItem key="profile" onClick={() => { navigate('/perfil'); handleClose(); }}>
                      Mi Perfil
                    </MenuItem>,
                    <MenuItem key="logout" onClick={handleLogout}>
                      Cerrar Sesión
                    </MenuItem>
                  ]
                ) : (
                  // Usa un array en lugar de Fragment
                  [
                    <MenuItem key="login" onClick={() => { navigate('/login'); handleClose(); }}>
                      Iniciar Sesión
                    </MenuItem>,
                    <MenuItem key="register" onClick={() => { navigate('/register'); handleClose(); }}>
                      Registrarse
                    </MenuItem>
                  ]
                )}
              </Menu>
            </Box>

            {/* Navegación para desktop */}
            {isAuthenticated ? (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                <Tabs
                  value={getActiveTab()}
                  onChange={handleTabChange}
                  textColor="inherit"
                  indicatorColor="secondary"
                  sx={{ minHeight: 64 }}
                >
                  <Tab 
                    label="Inicio" 
                    sx={{ 
                      color: '#FFFFFF',
                      '&.Mui-selected': { color: '#FFDE00' }
                    }} 
                  />
                  <Tab 
                    label="Rutinas" 
                    sx={{ 
                      color: '#FFFFFF',
                      '&.Mui-selected': { color: '#FFDE00' }
                    }} 
                  />
                </Tabs>

                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#4CAF50',
                        color: '#4CAF50',
                        boxShadow: `0 0 0 2px #1D2C9E`,
                        '&::after': {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          animation: 'ripple 1.2s infinite ease-in-out',
                          border: '1px solid currentColor',
                          content: '""',
                        },
                      },
                      '@keyframes ripple': {
                        '0%': {
                          transform: 'scale(.8)',
                          opacity: 1,
                        },
                        '100%': {
                          transform: 'scale(2.4)',
                          opacity: 0,
                        },
                      },
                    }}
                  >
                    <Avatar 
                      src={userAvatar || undefined}
                      sx={{ 
                        width: 40, 
                        height: 40,
                        border: '2px solid #FFDE00',
                        backgroundColor: userAvatar ? 'transparent' : '#3B4CCA',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          transition: 'transform 0.3s ease'
                        }
                      }}
                    >
                      {!userAvatar && getInitials()}
                    </Avatar>
                  </Badge>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  sx={{ mt: 1 }}
                >
                  {/* Info del usuario en el menú */}
                  <Box sx={{ px: 2, py: 1, borderBottom: '1px solid rgba(255, 222, 0, 0.2)' }}>
                    <Typography variant="subtitle2" sx={{ color: '#3B4CCA', fontWeight: 'bold' }}>
                      {usuario?.full_name || usuario?.username}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'white' }}>
                      {usuario?.email || usuario?.username}
                    </Typography>
                  </Box>

                  {/* Usa un array en lugar de Fragment */}
                  {[
                    <MenuItem 
                      key="profile" 
                      onClick={() => { navigate('/perfil'); handleClose(); }}
                      sx={{ py: 1.5 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={userAvatar || undefined}
                          sx={{ width: 24, height: 24, mr: 1.5 }}
                        >
                          {!userAvatar && getInitials()}
                        </Avatar>
                        Mi Perfil
                      </Box>
                    </MenuItem>,
                    <MenuItem 
                      key="logout" 
                      onClick={handleLogout}
                      sx={{ py: 1.5, color: '#f44336' }}
                    >
                      Cerrar Sesión
                    </MenuItem>
                  ]}
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/login')}
                  sx={{ 
                    color: '#FFFFFF',
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 222, 0, 0.1)',
                      color: '#FFDE00'
                    }
                  }}
                >
                  Iniciar Sesión
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/register')}
                  sx={{ 
                    color: '#FFFFFF',
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 222, 0, 0.1)',
                      color: '#FFDE00'
                    }
                  }}
                >
                  Registrarse
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'rgba(7, 3, 22, 0.2)',
          borderTop: '1px solid rgba(255, 222, 0, 0.1)'
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body1" color="white" align="center">
            © {new Date().getFullYear()} POKEGYM. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;