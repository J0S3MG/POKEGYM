import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, AlertTitle, Typography, IconButton, Grow, GrowProps, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

interface NotificationProps {
  notification: NotificationData;
  onClose: (id: string) => void;
  index?: number; // Para posicionamiento
  total?: number; // Total de notificaciones
}

function GrowTransition(props: GrowProps) {
  return <Grow {...props} />;
}

const Notification: React.FC<NotificationProps> = ({ 
  notification, 
  onClose,
  index = 0,
}) => {
  const [open, setOpen] = useState(true);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setTimeout(() => onClose(notification.id), 300);
  };

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, notification.duration);
      
      return () => clearTimeout(timer);
    }
  }, [notification.duration]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircleIcon fontSize="inherit" />;
      case 'error':
        return <ErrorIcon fontSize="inherit" />;
      case 'warning':
        return <WarningIcon fontSize="inherit" />;
      case 'info':
        return <InfoIcon fontSize="inherit" />;
      default:
        return <InfoIcon fontSize="inherit" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1))';
      case 'error':
        return 'linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(244, 67, 54, 0.1))';
      case 'warning':
        return 'linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 193, 7, 0.1))';
      case 'info':
        return 'linear-gradient(135deg, rgba(33, 150, 243, 0.2), rgba(33, 150, 243, 0.1))';
      default:
        return 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))';
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      case 'warning':
        return '#FFC107';
      case 'info':
        return '#2196F3';
      default:
        return '#FFFFFF';
    }
  };

  // Calcular posición basada en el índice
  const bottomOffset = 20 + (index * 80); // 80px entre notificaciones

  return (
    <Snackbar
      open={open}
      autoHideDuration={notification.duration || 5000}
      onClose={handleClose}
      TransitionComponent={GrowTransition}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{ 
        position: 'fixed',
        bottom: `${bottomOffset}px`,
        right: '20px',
        zIndex: 9999 - index, // Las más nuevas encima
        '& .MuiPaper-root': {
          background: getBackgroundColor(),
          backdropFilter: 'blur(20px)',
          border: `2px solid ${getBorderColor()}`,
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
          maxWidth: 380,
          minWidth: 320,
          borderLeft: `6px solid ${getBorderColor()}`,
          overflow: 'hidden',
        }
      }}
    >
      <Alert
        severity={notification.type}
        icon={getIcon()}
        onClose={handleClose}
        sx={{
          width: '100%',
          alignItems: 'flex-start',
          padding: '12px 16px',
          '& .MuiAlert-icon': {
            fontSize: '1.8rem',
            marginRight: 2,
            padding: '4px 0',
          },
          '& .MuiAlert-message': {
            flex: 1,
            padding: 0,
          },
          '& .MuiAlert-action': {
            padding: 0,
            marginLeft: 2,
            alignItems: 'flex-start'
          }
        }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
            sx={{ 
              padding: '4px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AlertTitle sx={{ 
            margin: 0,
            fontWeight: 600,
            fontSize: '1rem',
            color: 'text.primary'
          }}>
            {notification.title}
          </AlertTitle>
        </Box>
        <Typography variant="body2" sx={{ 
          color: 'text.secondary',
          lineHeight: 1.5,
          fontSize: '0.875rem'
        }}>
          {notification.message}
        </Typography>
      </Alert>
    </Snackbar>
  );
};

export default Notification;