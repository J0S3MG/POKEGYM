import React, { useState, useEffect, useCallback } from 'react';
import { rutinasApi } from '../api/Api';
import { RutinaResponse, RutinaConEjerciciosCreate, RutinaModificarRequest } from '../types/Rutina_Models';
import { Box, Typography, Button, CircularProgress, Alert, Grid, Chip, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import RutinaCard from '../components/rutinas/RutinaCard';
import RutinaBuscarBar from '../components/rutinas/BuscarRutinas';
import ModalEditarRutina from '../components/rutinas/ModalEditarRutina';
import ModalNuevaRutina from '../components/rutinas/ModalNuevaRutina';
import imagenIzquierda from '/images/Timburr.png';
import imagenDerecha from '/images/Machamp.png';


const RutinaListPage: React.FC = () => {
  const { showSuccess, showError } = useNotifications();
  const [rutinas, setRutinas] = useState<RutinaResponse[]>([]);
  const [rutinasFiltradas, setRutinasFiltradas] = useState<RutinaResponse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [creandoRutina, setCreandoRutina] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [rutinaEditando, setRutinaEditando] = useState<RutinaResponse | null>(null);
  const [editandoRutina, setEditandoRutina] = useState(false);

  const navigate = useNavigate();

  const fetchRutinas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await rutinasApi.getAll();
      setRutinas(response.data);
      setRutinasFiltradas(null);
      setSearchActive(false);
      setError('');
    } catch (err: any) {
      setError('Error al cargar rutinas: ' + (err.response?.data?.detail || err.message));
      console.error('Error fetching rutinas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRutinas();
  }, [fetchRutinas]);

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await rutinasApi.delete(id);
      // Actualizar ambas listas
      setRutinas(prev => prev.filter(r => r.id !== id));
      setRutinasFiltradas(prev => prev ? prev.filter(r => r.id !== id) : null);
      
      // Mostrar notificación de éxito
      showSuccess(
        'Rutina eliminada',
        'La rutina ha sido eliminada exitosamente'
      );
    } catch (err: any) {
      // Mostrar notificación de error
      showError(
        'Error al eliminar',
        err.response?.data?.detail || 'Error al eliminar la rutina'
      );
      // Lanza el error para que lo capture RutinaCard
      throw new Error(err.response?.data?.detail || 'Error al eliminar la rutina');
    }
  };

  const handleCrearRutina = async (rutinaData: RutinaConEjerciciosCreate) => {
    try {
      setCreandoRutina(true);
      
      // Preparar datos para enviar
      const datosPreparados: RutinaConEjerciciosCreate = {
        nombre: rutinaData.nombre.trim(),
        descripcion: rutinaData.descripcion?.trim() || null,
        ejercicios: rutinaData.ejercicios?.map(ej => ({
          nombre: ej.nombre.trim(),
          dia_semana: ej.dia_semana,
          series: ej.series,
          repeticiones: ej.repeticiones,
          peso: ej.peso !== null && ej.peso !== 0 ? Number(ej.peso) : null,
          notas: ej.notas?.trim() || null,
          orden: ej.orden
        }))
      };

      const response = await rutinasApi.create(datosPreparados);
      const nuevaRutina = response.data;
      
      // Agregar la nueva rutina a ambas listas
      setRutinas(prev => [...prev, nuevaRutina]);
      if (rutinasFiltradas) {
        setRutinasFiltradas(prev => prev ? [...prev, nuevaRutina] : [nuevaRutina]);
      }
      
      // Cerrar modal
      setModalOpen(false);
      
      // Mostrar notificación de éxito
      showSuccess(
        'Rutina creada',
        `"${nuevaRutina.nombre}" ha sido creada exitosamente`
      );
      
    } catch (err: any) {
      console.error('Error al crear rutina:', err);
      
      let errorMessage = 'Error al crear rutina';
      
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          const errores = err.response.data.detail.map((e: any) => {
            const campo = e.loc?.join('.') || 'campo';
            return `${campo}: ${e.msg}`;
          }).join('\n');
          errorMessage = `Errores de validación:\n${errores}`;
        } else {
          errorMessage = err.response.data.detail;
        }
      } else {
        errorMessage = 'Error al crear rutina: ' + err.message;
      }
      
      // Mostrar notificación de error
      showError('Error al crear rutina', errorMessage);
      
      throw new Error(errorMessage);
    } finally {
      setCreandoRutina(false);
    }
  };

  // Función para guardar cambios
  const handleGuardarCambios = async (rutinaId: number, data: RutinaModificarRequest) => {
    try {
      setEditandoRutina(true);

      const response = await rutinasApi.update(rutinaId, data);
      const rutinaActualizada = response.data;
    
      // Actualizar rutinas en la lista
      setRutinas(prev => prev.map(r => 
        r.id === rutinaId ? rutinaActualizada : r
      ));
    
      // Actualizar también en rutinas filtradas si existe
      if (rutinasFiltradas) {
        setRutinasFiltradas(prev => prev ? 
          prev.map(r => r.id === rutinaId ? rutinaActualizada : r) 
          : null
        );
      }
    
      setEditModalOpen(false);
      setRutinaEditando(null);
    
      // Mostrar notificación de éxito
      showSuccess(
        'Rutina actualizada',
        `"${rutinaActualizada.nombre}" ha sido actualizada exitosamente`
      );
    
    } catch (err: any) {
      console.error('Error al actualizar rutina:', err);
      
      let errorMessage = 'Error al actualizar rutina';
      
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          const errores = err.response.data.detail.map((e: any) => {
            const campo = e.loc?.join('.') || 'campo';
            return `${campo}: ${e.msg}`;
          }).join('\n');
          errorMessage = `Errores de validación:\n${errores}`;
        } else {
          errorMessage = err.response.data.detail;
        }
      } else {
        errorMessage = 'Error al actualizar rutina: ' + err.message;
      }
      
      // Mostrar notificación de error
      showError('Error al actualizar rutina', errorMessage);
      
      throw new Error(errorMessage);
    } finally {
      setEditandoRutina(false);
    }
  };

  const handleVerDetalle = (id: number) => {
    navigate(`/rutinas/${id}`);
  };

  // Función para manejar clic en editar
  const handleEditar = (rutina: RutinaResponse) => {
    setRutinaEditando(rutina);
    setEditModalOpen(true);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleSearchResults = (results: RutinaResponse[] | null) => {
    setRutinasFiltradas(results);
    setSearchActive(results !== null);
  };

  const handleClearSearch = () => {
    setRutinasFiltradas(null);
    setSearchActive(false);
  };

  // Determinar qué rutinas mostrar
  const rutinasAMostrar = rutinasFiltradas || rutinas;
  const totalRutinas = rutinas.length;
  const rutinasMostradas = rutinasAMostrar.length;
  const isFiltered = searchActive && rutinasFiltradas !== null;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      position: 'relative',
      width: '100%'
    }}>
      {/* Imagen izquierda - Fija al costado */}
      <Box sx={{
        position: 'fixed',
        left: 20,
        top: '75%',
        transform: 'translateY(-60%)',
        zIndex: 1,
        display: { xs: 'none', md: 'block' } // Ocultar en móviles
      }}>
        <img 
          src={imagenIzquierda} 
          alt="Imagen decorativa izquierda"
          style={{ 
            width: '250px', // Ajusta este valor según necesites
            height: 'auto',
            maxHeight: '70vh',
            objectFit: 'contain'
          }}
        />
      </Box>

      {/* Contenido principal */}
      <Box sx={{ 
        flex: 1,
        p: 3,
        marginLeft: { md: '20px' }, // Espacio para la imagen izquierda
        marginRight: { md: '20px' }, // Espacio para la imagen derecha
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Cabecera con título, búsqueda y botón */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'flex-start' },
          gap: 3,
          mb: 3 
        }}>
          {/* Título */}
          <Box>
            <Typography variant="h4" gutterBottom>
              Mis Rutinas
            </Typography>
            {!isFiltered && (
              <Typography variant="body1" color="white">
                Total: {totalRutinas} rutina{totalRutinas !== 1 ? 's' : ''}
              </Typography>
            )}
          </Box>
          
          {/* Barra de búsqueda */}
          <Box sx={{ 
            flex: 1, 
            minWidth: 0,
            mt: { sm: 1 }
          }}>
            <RutinaBuscarBar onSearchResults={handleSearchResults} />
          </Box>
          
          {/* Botón Nueva Rutina */}
          <Box sx={{ 
            display: { xs: 'none', sm: 'block' },
            mt: { sm: 1.5 }
          }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenModal}
            >
              Nueva Rutina
            </Button>
          </Box>
        </Box>

        {/* Indicador de búsqueda activa */}
        {isFiltered && (
          <Box sx={{ 
            mb: 3, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: 'rgba(59, 76, 202, 0.1)',
            p: 2,
            borderRadius: 2,
            border: '1px solid rgba(255, 222, 0, 0.2)'
          }}>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip 
                label={`${rutinasMostradas} resultado${rutinasMostradas !== 1 ? 's' : ''}`}
                color="primary" 
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
              <Typography variant="body2" color="text.secondary">
                {rutinasMostradas === 0 ? 'No se encontraron rutinas' : 'Mostrando resultados de búsqueda'}
              </Typography>
            </Box>
            <IconButton 
              size="small" 
              onClick={handleClearSearch}
              sx={{ color: '#FFDE00' }}
            >
              <ClearIcon fontSize="small" />
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                Limpiar
              </Typography>
            </IconButton>
          </Box>
        )}

        {/* Mensaje de error general */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Lista de rutinas */}
        {rutinasAMostrar.length === 0 ? (
          <Box sx={{ 
            maxWidth: 600, 
            mx: 'auto', 
            mt: 4, 
            textAlign: 'center',
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 3,
            border: '1px dashed rgba(255, 222, 0, 0.3)'
          }}>
            <Typography variant="h6" gutterBottom color="textSecondary">
              {isFiltered ? 'No se encontraron rutinas' : 'No tienes rutinas creadas'}
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              {isFiltered 
                ? 'Intenta con otro término de búsqueda'
                : '¡Comienza creando tu primera rutina de entrenamiento!'
              }
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenModal}
              size="large"
              sx={{ mt: 2 }}
            >
              {isFiltered ? 'Crear Nueva Rutina' : 'Crear Primera Rutina'}
            </Button>
            {isFiltered && (
              <Button
                variant="outlined"
                onClick={handleClearSearch}
                size="large"
                sx={{ mt: 2, ml: 2 }}
              >
                Ver todas las rutinas
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {rutinasAMostrar.map((rutina) => (
              <Grid item key={rutina.id} xs={12} sm={6} md={4} lg={3} {...{} as any}>
                <RutinaCard
                  rutina={rutina}
                  onView={handleVerDetalle}
                  onEdit={handleEditar}  
                  onDelete={handleDelete}
                  onVerDetalle={handleVerDetalle}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Footer con información cuando hay muchas rutinas */}
        {rutinasAMostrar.length > 0 && totalRutinas > 8 && (
          <Box sx={{ 
            mt: 4, 
            pt: 2, 
            borderTop: '1px solid rgba(255, 222, 0, 0.1)',
            textAlign: 'center'
          }}>
            <Typography variant="caption" color="text.secondary">
              {isFiltered 
                ? `Mostrando ${rutinasMostradas} de ${totalRutinas} rutinas` 
                : `Total: ${totalRutinas} rutinas`
              }
            </Typography>
          </Box>
        )}

        {/* Modal para crear nueva rutina */}
        <ModalNuevaRutina
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCrearRutina}
          loading={creandoRutina}
        />
        <ModalEditarRutina
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setRutinaEditando(null);
          }}
          onSubmit={handleGuardarCambios}
          loading={editandoRutina}
          rutina={rutinaEditando}
          title={`Editar Rutina: ${rutinaEditando?.nombre || ''}`}
        />
      </Box>

      {/* Imagen derecha - Fija al costado */}
      <Box sx={{
        position: 'fixed',
        right: 50,
        top: '52%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        display: { xs: 'none', md: 'block' } // Ocultar en móviles
      }}>
        <img 
          src={imagenDerecha} 
          alt="Imagen decorativa derecha"
          style={{ 
            width: '300px', // Ajusta este valor según necesites
            height: 'auto',
            maxHeight: '70vh',
            objectFit: 'contain'
          }}
        />
      </Box>
    </Box>
  );
};

export default RutinaListPage;