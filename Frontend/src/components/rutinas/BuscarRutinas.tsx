import React, { useState, useEffect } from 'react';
import { rutinasApi } from '../../api/Api';
import { RutinaResponse } from '../../types/Rutina_Models';
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface RutinaBuscarBarProps {
  onSearchResults: (results: RutinaResponse[] | null) => void;
  placeholder?: string;
}

const RutinaBuscarBar: React.FC<RutinaBuscarBarProps> = ({
  onSearchResults,
  placeholder = "Buscar rutinas por nombre o ID..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const buscarRutinas = async () => {
      if (!searchTerm.trim()) {
        onSearchResults(null); // Limpiar resultados
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let results: RutinaResponse[] = [];
        
        // Verificar si es búsqueda por ID
        if (/^\d+$/.test(searchTerm.trim())) {
          const id = parseInt(searchTerm.trim());
          const response = await rutinasApi.getById(id);
          results = [response.data];
        } else {
          // Búsqueda por nombre
          const response = await rutinasApi.search(searchTerm.trim());
          results = response.data;
        }
        
        onSearchResults(results);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('No se encontraron rutinas');
          onSearchResults([]);
        } else {
          setError('Error al buscar rutinas');
          console.error('Error en búsqueda:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      buscarRutinas();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearchResults]);

  const handleClear = () => {
    setSearchTerm('');
    setError(null);
    onSearchResults(null);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="primary" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {loading ? (
                <CircularProgress size={20} />
              ) : searchTerm ? (
                <IconButton size="small" onClick={handleClear} edge="end">
                  <ClearIcon fontSize="small" />
                </IconButton>
              ) : null}
            </InputAdornment>
          ),
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              boxShadow: '0 0 0 2px rgba(255, 222, 0, 0.3)',
            }
          }
        }}
        variant="outlined"
        size="medium"
      />
      
      {error && (
        <Alert 
          severity="info" 
          sx={{ 
            mt: 1,
            backgroundColor: 'rgba(59, 76, 202, 0.1)',
            border: '1px solid rgba(59, 76, 202, 0.3)',
            color: '#FFFFFF'
          }}
          icon={false}
        >
          <Typography variant="body2">
            {error}. <strong style={{ color: '#FFDE00' }}>Tip:</strong> Puedes buscar por nombre o por ID numérico.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default RutinaBuscarBar;