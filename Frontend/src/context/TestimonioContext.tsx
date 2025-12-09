import React, { createContext, useContext, ReactNode } from 'react';
import { Testimonio } from '../components/testimonios/TestimonioCard';

interface TestimoniosContextType {
  testimonios: Testimonio[];
  isLoading: boolean;
  error: string | null;
}

const TestimonioContext = createContext<TestimoniosContextType | undefined>(undefined);

export const useTestimonios = () => {
  const context = useContext(TestimonioContext);
  if (!context) {
    throw new Error('useTestimonios debe usarse dentro de TestimoniosProvider');
  }
  return context;
};

interface TestimoniosProviderProps {
  children: ReactNode;
}

// Datos de ejemplo - en un proyecto real vendrían de una API
const testimonioData: Testimonio[] = [
  {
    id: 1,
    nombre: 'Carlos Rodríguez',
    avatar: '/images/bruno.png', // Ruta a la imagen
    avatarType: 'image', // Especifica que es una imagen
    ocupacion: 'Entrenador Personal',
    comentario: 'FitTrack ha revolucionado cómo gestiono las rutinas de mis clientes.',
    rating: 5,
  },
  {
    id: 2,
    nombre: 'Ana Martínez',
    avatar: '/images/clemont.jpg', // Otra imagen
    avatarType: 'image',
    ocupacion: 'Atleta Amateur',
    comentario: 'Por fin una app que entiende las necesidades reales de entrenamiento.',
    rating: 5,
  },
  {
    id: 3,
    nombre: 'Miguel Sánchez',
    avatar: '/images/sophocles.jpg',
    avatarType: 'image', // Iniciales
    ocupacion: 'Usuario Premium',
    comentario: 'La facilidad para modificar rutinas y el calendario integrado.',
    rating: 4,
  },
  {
    id: 4,
    nombre: 'Laura Gómez',
    avatar: '/images/clay.png',
    avatarType: 'image', // Iniciales
    ocupacion: 'Crossfitter',
    comentario: 'El sistema de drag & drop ha simplificado mi planificación semanal.',
    rating: 5,
  },
  {
    id: 5,
    nombre: 'David López',
       avatar: '/images/entrenador.jpg',
    avatarType: 'image', // Iniciales
    ocupacion: 'Principiante',
    comentario: 'La interfaz intuitiva y las rutinas predefinidas me han ayudado mucho.',
    rating: 4,
  },
     {
       id: 6,
      nombre: "Ana Martínez",
        avatar: '/images/korrina.jpg',
    avatarType: 'image', // Iniciales
      ocupacion: "Ávida Amateur",
      comentario: "Por fin una app que entiende las necesidades reales de entrenamiento.",
      rating: 5,
    },
    {
       id: 7,
      nombre: "Miguel Sánchez",
         avatar: '/images/siebold.jpg',
    avatarType: 'image', // Iniciales
     ocupacion: "Usuario Premium",
      comentario: "La facilidad para modificar rutinas y el calendario integrado.",
      rating: 4,
    },
    {
       id: 8,
      nombre: "Laura Gómez",
         avatar: '/images/Primate.jpg',
    avatarType: 'image', 
      ocupacion: "Crossfiter",
      comentario: "El sistema de drag & drop ha simplificado mi planificación semanal.",
      rating: 5,
    }
];

export const TestimonioProvider: React.FC<TestimoniosProviderProps> = ({ children }) => {
  const value: TestimoniosContextType = {
    testimonios: testimonioData,
    isLoading: false,
    error: null,
  };

  return (
    <TestimonioContext.Provider value={value}>
      {children}
    </TestimonioContext.Provider>
  );
};