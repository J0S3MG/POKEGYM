// context/NotificationContext.tsx - VERSIÓN MEJORADA
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Notification, { NotificationData, NotificationType } from '../components/common/Notification';

interface NotificationContextType {
  showNotification: (type: NotificationType, title: string, message: string, duration?: number, action?: string) => void;
  showSuccess: (title: string, message: string, duration?: number, action?: string) => void;
  showError: (title: string, message: string, duration?: number, action?: string) => void;
  showWarning: (title: string, message: string, duration?: number, action?: string) => void;
  showInfo: (title: string, message: string, duration?: number, action?: string) => void;
  getNotificationHistory: () => ExtendedNotificationData[];
  clearNotificationHistory: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export interface ExtendedNotificationData extends NotificationData {
  timestamp: Date;
  read: boolean;
  action?: string;
  apiEndpoint?: string;
  apiMethod?: string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
  maxHistory?: number;
}

const STORAGE_KEY = 'fitrack_notification_history';

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ 
  children, 
  maxNotifications = 5,
  maxHistory = 200 // Aumentado para más historial
}) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [history, setHistory] = useState<ExtendedNotificationData[]>(() => {
    // Cargar historial desde localStorage al iniciar
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
      } catch (error) {
        console.error('Error cargando historial de notificaciones:', error);
        return [];
      }
    }
    return [];
  });
  
  const historyRef = useRef<ExtendedNotificationData[]>(history);

  // Persistir historial en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    historyRef.current = history;
  }, [history]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const addToHistory = useCallback((
    notification: NotificationData, 
    action?: string,
    apiEndpoint?: string,
    apiMethod?: string
  ) => {
    const extendedNotification: ExtendedNotificationData = {
      ...notification,
      timestamp: new Date(),
      read: false,
      action,
      apiEndpoint,
      apiMethod
    };

    setHistory(prev => {
      const updated = [extendedNotification, ...prev];
      // Limitar el historial
      if (updated.length > maxHistory) {
        return updated.slice(0, maxHistory);
      }
      return updated;
    });
  }, [maxHistory]);

  const showNotification = useCallback((
    type: NotificationType, 
    title: string, 
    message: string, 
    duration: number = 5000,
    action?: string,
    apiEndpoint?: string,
    apiMethod?: string
  ) => {
    const id = uuidv4();
    const newNotification: NotificationData = {
      id,
      type,
      title,
      message,
      duration
    };

    // Agregar al historial
    addToHistory(newNotification, action, apiEndpoint, apiMethod);

    // Mostrar como notificación activa
    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      if (updated.length > maxNotifications) {
        return updated.slice(0, maxNotifications);
      }
      return updated;
    });
  }, [maxNotifications, addToHistory]);

  const showSuccess = useCallback((title: string, message: string, duration?: number, action?: string, apiEndpoint?: string, apiMethod?: string) => {
    showNotification('success', title, message, duration, action, apiEndpoint, apiMethod);
  }, [showNotification]);

  const showError = useCallback((title: string, message: string, duration?: number, action?: string, apiEndpoint?: string, apiMethod?: string) => {
    showNotification('error', title, message, duration || 7000, action, apiEndpoint, apiMethod);
  }, [showNotification]);

  const showWarning = useCallback((title: string, message: string, duration?: number, action?: string, apiEndpoint?: string, apiMethod?: string) => {
    showNotification('warning', title, message, duration, action, apiEndpoint, apiMethod);
  }, [showNotification]);

  const showInfo = useCallback((title: string, message: string, duration?: number, action?: string, apiEndpoint?: string, apiMethod?: string) => {
    showNotification('info', title, message, duration, action, apiEndpoint, apiMethod);
  }, [showNotification]);

  const getNotificationHistory = useCallback(() => {
    return [...history].sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }, [history]);

  const clearNotificationHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setHistory(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setHistory(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  return (
    <NotificationContext.Provider value={{
      showNotification,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      getNotificationHistory,
      clearNotificationHistory,
      markAsRead,
      markAllAsRead
    }}>
      {children}
      
      {/* Renderizar notificaciones activas */}
      {notifications.map((notification, index) => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
          index={index}
          total={notifications.length}
        />
      ))}
    </NotificationContext.Provider>
  );
};