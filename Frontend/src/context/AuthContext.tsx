import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/Api';
import { useNotifications } from './NotificationContext'; // Importar el contexto de notificaciones

interface AuthContextType {
  usuario: any | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  
  // Obtener las funciones de notificación
  const { showSuccess, showError, showInfo } = useNotifications();

  // Cargar datos de autenticación al inicio
 useEffect(() => {
  const loadAuthData = async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const userData = await authApi.getCurrentUser();
        
        setToken(storedToken);
        setUsuario(userData);
        if (!hasShownWelcome) {
          setTimeout(() => {
            const displayName = userData.full_name || userData.username || 'Usuario';
            showInfo(
              '¡Bienvenido de nuevo!',
              `Hola ${displayName}, has iniciado sesión automáticamente.`,
              4000,
            );
            setHasShownWelcome(true);
          }, 1500);
        }
        
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setToken(null);
        setUsuario(null);
      }
    }
    setLoading(false);
  };

  loadAuthData();
}, [showInfo, hasShownWelcome]);

 const login = async (username: string, password: string) => {
  try {
    setLoading(true);
    
    const tokenResponse = await authApi.login(username, password);
    
    const { access_token } = tokenResponse;
    
    if (!access_token) {
      throw new Error('No se recibió token del servidor');
    }
    
    
    // 2. Guardar token inmediatamente
    localStorage.setItem('token', access_token);
    setToken(access_token);
    
    // 3. Obtener usuario usando el token recién recibido
    const userData = await authApi.getCurrentUser();

    
    // 4. Guardar usuario en localStorage
    localStorage.setItem('usuario', JSON.stringify(userData));
    setUsuario(userData);
    
    // 5. Mostrar notificación
    const displayName = userData.full_name || userData.username || 'Usuario';
    showSuccess(
      '¡Inicio de sesión exitoso!',
      `Bienvenido ${displayName}, has iniciado sesión correctamente.`,
      5000,
    );
    

    
  } catch (error: any) {

    const errorMessage = error.response?.data?.detail || error.message || 'Error al iniciar sesión';
    
    showError(
      'Error al iniciar sesión',
      errorMessage,
      7000,
    );
    
    throw new Error(errorMessage);
  } finally {
    setLoading(false);
  }
};
  const logout = () => {
    // Mostrar notificación de despedida
    if (usuario) {
      showInfo(
        'Sesión cerrada',
        `Hasta pronto ${usuario.full_name || usuario.username}, tu sesión ha sido cerrada.`,
        4000,
      );
    }
    
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    
    // Limpiar estado
    setToken(null);
    setUsuario(null);
    setHasShownWelcome(false);
    
    // Redirigir a inicio
    window.location.href = '/';
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{
      usuario,
      token,
      loading,
      login,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};