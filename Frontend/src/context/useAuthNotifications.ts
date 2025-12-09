// Opción alternativa: Crear un hook personalizado para notificaciones de auth
// context/useAuthNotifications.ts
import { useNotifications } from './NotificationContext';

export const useAuthNotifications = () => {
  const { showSuccess, showError, showInfo } = useNotifications();
  
  const showLoginSuccess = (username: string, fullName?: string) => {
    const name = fullName || username;
    showSuccess(
      '¡Inicio de sesión exitoso!',
      `Bienvenido ${name}, has iniciado sesión correctamente.`,
      5000,
    );
  };
  
  const showLoginError = (errorMessage: string) => {
    showError(
      'Error al iniciar sesión',
      errorMessage,
      7000,
    );
  };
  
  const showLogout = (username: string, fullName?: string) => {
    const name = fullName || username;
    showInfo(
      'Sesión cerrada',
      `Hasta pronto ${name}, tu sesión ha sido cerrada.`,
      4000,
    );
  };
  
  const showAutoLogin = (username: string, fullName?: string) => {
    const name = fullName || username;
    showInfo(
      '¡Bienvenido de nuevo!',
      `Hola ${name}, has iniciado sesión automáticamente.`,
      4000,
    );
  };
  
  return {
    showLoginSuccess,
    showLoginError,
    showLogout,
    showAutoLogin
  };
};