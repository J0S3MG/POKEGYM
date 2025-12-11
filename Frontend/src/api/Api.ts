import axios from 'axios';
import { RutinaListParams, RutinaConEjerciciosCreate, RutinaModificarRequest, EjercicioCreate, EjercicioUpdate } from '../types/Rutina_Models';


// URL base del backend Python (puerto 8000)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Configurar axios base
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta mejorado
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authApi = {
  // POST /api/auth/token - OAuth2 form data
  login: async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    
    const response = await api.post('/api/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    
    return response.data;
  },
  
  // GET /api/auth/me - Obtener usuario actual
  getCurrentUser: async () => {
   
    
    const response = await api.get('/api/auth/me');
    

    return response.data;
  },
  
  // POST /api/auth/register
  register: async (userData: any) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
};

// Servicio de rutinas
export const rutinasApi = {
  // GET /api/rutinas?skip=0&limit=100
  getAll: (params?: RutinaListParams) => 
    api.get('/api/rutinas', { 
      params: { 
        skip: params?.skip || 0, 
        limit: params?.limit || 100 
      } 
    }),
  
  // GET /api/rutinas/{id}
  getById: (id: number | string) => api.get(`/api/rutinas/${id}`),
  
  // GET /api/rutinas/nombre/{nombre}
  getByNombre: (nombre: string) => api.get(`/api/rutinas/nombre/${nombre}`),
  
  // GET /api/rutinas/buscar?nombre=termino
  search: (termino: string) => api.get('/api/rutinas/buscar', { 
    params: { nombre: termino } 
  }),
  
  // POST /api/rutinas
  create: (rutina: RutinaConEjerciciosCreate) => api.post('/api/rutinas', rutina),
  
  // PUT /api/rutinas/{id}
  update: (id: number | string, rutina: RutinaModificarRequest) => 
    api.put(`/api/rutinas/${id}`, rutina),
  
  // DELETE /api/rutinas/{id}
  delete: (id: number | string) => api.delete(`/api/rutinas/${id}`),
};

// Servicios de ejercicios
export const ejerciciosApi = {
  // POST /api/rutinas/{rutina_id}/ejercicios
  create: (rutina_id: number | string, ejercicio: EjercicioCreate) => 
    api.post(`/api/rutinas/${rutina_id}/ejercicios`, ejercicio),
  
  // PUT /api/ejercicios/{id}
  update: (id: number | string, ejercicio: EjercicioUpdate) => 
    api.put(`/api/ejercicios/${id}`, ejercicio),
  
  // DELETE /api/ejercicios/{id}
  delete: (id: number | string) => api.delete(`/api/ejercicios/${id}`),
};