import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { TestimonioProvider } from './context/TestimonioContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RutinasPage from './pages/RutinaListPage';
import { theme } from './theme/index';
import PerfilPage from './pages/PerfilPage'; 
import RutinaDetallePage from './pages/RutinaDetallePage';



function App() {
  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <NotificationProvider maxNotifications={5}>
      <AuthProvider>
        <TestimonioProvider>
          <Router>
            <Routes>
              {/* Ruta principal con MainLayout */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                
                {/* Rutas protegidas */}
                <Route path="rutinas" element={
                  <ProtectedRoute>
                    <RutinasPage />
                  </ProtectedRoute>
                } />
                
                <Route path="rutinas/nueva" element={
                  <ProtectedRoute>
                    <> </>
                  </ProtectedRoute>
                } />
                
                <Route path="rutinas/:id" element={
                  <ProtectedRoute>
                    <RutinaDetallePage />
                  </ProtectedRoute>
                } />
                
                <Route path="rutinas/:id/editar" element={
                  <ProtectedRoute>
                    <></>
                  </ProtectedRoute>
                } />
                
                <Route path="perfil" element={
                  <ProtectedRoute>
                    <PerfilPage />
                  </ProtectedRoute>
                } />
              </Route>
            </Routes>
          </Router>
        </TestimonioProvider>
      </AuthProvider>
    </NotificationProvider>
  </ThemeProvider>
  );
}

export default App;