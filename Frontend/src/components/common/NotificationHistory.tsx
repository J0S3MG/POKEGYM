import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography, Paper, Chip, IconButton, Divider, Button, Menu, MenuItem, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, CircularProgress } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Error as ErrorIcon, Warning as WarningIcon, Info as InfoIcon, Notifications as NotificationsIcon,
Delete as DeleteIcon, FilterList as FilterListIcon, Refresh as RefreshIcon, Schedule as ScheduleIcon } from '@mui/icons-material';
import { useNotifications, ExtendedNotificationData } from '../../context/NotificationContext';

type FilterType = 'all' | 'unread' | 'success' | 'error' | 'warning' | 'info';

const NotificationHistory: React.FC = () => {
  const { getNotificationHistory, markAsRead,  clearNotificationHistory } = useNotifications();
  const [notifications, setNotifications] = useState<ExtendedNotificationData[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    setLoading(true);
    setTimeout(() => {
      const history = getNotificationHistory();
      setNotifications(history);
      setLoading(false);
    }, 300);
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      if (filter === 'all') return true;
      if (filter === 'unread') return !notification.read;
      return notification.type === filter;
    });
  }, [notifications, filter]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircleIcon color="success" />;
      case 'error': return <ErrorIcon color="error" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'info': return <InfoIcon color="info" />;
      default: return <InfoIcon />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'warning': return '#FFC107';
      case 'info': return '#2196F3';
      default: return '#757575';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} d`;
    
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (newFilter?: FilterType) => {
    if (newFilter) {
      setFilter(newFilter);
    }
    setAnchorEl(null);
  };


  const handleClearHistory = () => {
    clearNotificationHistory();
    setNotifications([]);
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6">
            Historial de Actividad
          </Typography>
          <Chip 
            label={`${filteredNotifications.length} notificaciones`} 
            size="small" 
            variant="outlined"
          />
        </Box>
        
        <Box display="flex" gap={1}>
          <IconButton 
            size="small" 
            onClick={loadNotifications}
            title="Actualizar"
          >
            <RefreshIcon />
          </IconButton>
          
          <IconButton 
            size="small" 
            onClick={handleFilterClick}
            title="Filtrar"
          >
            <FilterListIcon />
          </IconButton>
          
          
          {notifications.length > 0 && (
            <Button 
              size="small" 
              startIcon={<DeleteIcon />}
              onClick={handleClearHistory}
              variant="outlined"
              color="error"
            >
              Limpiar historial
            </Button>
          )}
        </Box>
      </Box>

      {/* Filtro Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleFilterClose()}
      >
        <MenuItem onClick={() => handleFilterClose('all')}>
          <Chip size="small" label="Todas" sx={{ mr: 1 }} />
          <Typography>Todas ({notifications.length})</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleFilterClose('unread')}>
          <Chip size="small" label="No leídas" color="error" sx={{ mr: 1 }} />
          <Typography>No leídas ({unreadCount})</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleFilterClose('success')}>
          <Chip size="small" label="Éxito" color="success" sx={{ mr: 1 }} />
          <Typography>Éxito</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleFilterClose('error')}>
          <Chip size="small" label="Error" color="error" sx={{ mr: 1 }} />
          <Typography>Error</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleFilterClose('warning')}>
          <Chip size="small" label="Advertencia" color="warning" sx={{ mr: 1 }} />
          <Typography>Advertencia</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleFilterClose('info')}>
          <Chip size="small" label="Información" color="info" sx={{ mr: 1 }} />
          <Typography>Información</Typography>
        </MenuItem>
      </Menu>

      {/* Lista de notificaciones */}
      {filteredNotifications.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
          <NotificationsIcon sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No hay notificaciones
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {filter === 'all' 
              ? 'Todas las acciones aparecerán aquí.' 
              : `No hay notificaciones ${filter === 'unread' ? 'no leídas' : `de tipo ${filter}`}.`}
          </Typography>
        </Paper>
      ) : (
        <List sx={{ 
          maxHeight: 400, 
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '10px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(180deg, #3B4CCA, #FFDE00)',
            borderRadius: '10px',
            '&:hover': {
              background: 'linear-gradient(180deg, #FFDE00, #3B4CCA)',
            }
          },
          // Para Firefox
          scrollbarWidth: 'thin',
          scrollbarColor: '#3B4CCA rgba(255, 255, 255, 0.1)',
        }}>
          {filteredNotifications.map((notification) => (
            <Paper 
              key={notification.id} 
              sx={{ 
                mb: 1, 
                backgroundColor: notification.read 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 222, 0, 0.1)',
                borderLeft: `4px solid ${getTypeColor(notification.type)}`,
              }}
              onClick={() => handleNotificationClick(notification.id)}
            >
              <ListItem>
                <ListItemIcon>
                  {getIcon(notification.type)}
                </ListItemIcon>
                
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle2" fontWeight={notification.read ? "normal" : "bold"}>
                        {notification.title}
                      </Typography>
                      {notification.action && (
                        <Chip 
                          label={notification.action} 
                          size="small" 
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        <ScheduleIcon fontSize="small" sx={{ fontSize: 12 }} />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(notification.timestamp)}
                        </Typography>
                      </Box>
                    </>
                  }
                />
                
                <ListItemSecondaryAction>
                  <Box display="flex" alignItems="center" gap={1}>
                    {!notification.read && (
                      <Chip 
                        label="Nuevo" 
                        size="small" 
                        color="error" 
                        sx={{ height: 20, fontSize: '0.65rem' }}
                      />
                    )}              
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          ))}
        </List>
      )}

      {/* Estadísticas */}
      <Paper sx={{ mt: 3, p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
        <Typography variant="subtitle2" gutterBottom>
          Resumen de Actividad
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Chip 
            icon={<CheckCircleIcon />} 
            label={`Éxito: ${notifications.filter(n => n.type === 'success').length}`} 
            color="success" 
            variant="outlined"
          />
          <Chip 
            icon={<ErrorIcon />} 
            label={`Error: ${notifications.filter(n => n.type === 'error').length}`} 
            color="error" 
            variant="outlined"
          />
          <Chip 
            icon={<WarningIcon />} 
            label={`Advertencia: ${notifications.filter(n => n.type === 'warning').length}`} 
            color="warning" 
            variant="outlined"
          />
          <Chip 
            icon={<InfoIcon />} 
            label={`Información: ${notifications.filter(n => n.type === 'info').length}`} 
            color="info" 
            variant="outlined"
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default NotificationHistory;