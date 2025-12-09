import React, { useRef, useEffect } from 'react';
import { TextField } from '@mui/material';

interface NumericFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  min?: number;
  step?: number;
  required?: boolean;
}

const NumericField: React.FC<NumericFieldProps> = ({
  label,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  min = 1,
  step = 1,
  required = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    // Prevenir el scroll de la página
    e.preventDefault();
    e.stopPropagation();
    
    // Determinar dirección
    const delta = e.deltaY > 0 ? -step : step;
    const newValue = Math.max(min, value + delta);
    
    // Solo cambiar si es diferente
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  // Prevenir el scroll cuando el mouse está sobre el campo
  useEffect(() => {
    const input = inputRef.current;
    const container = containerRef.current;
    if (!input || !container) return;

    const handleWheelCapture = (e: WheelEvent) => {
      // Si el evento ocurre dentro del campo o su contenedor
      if (container.contains(e.target as Node)) {
        e.preventDefault();
        e.stopPropagation();
        
        // Disparar el cambio de valor
        if (!disabled) {
          const delta = e.deltaY > 0 ? -step : step;
          const newValue = Math.max(min, value + delta);
          if (newValue !== value) {
            onChange(newValue);
          }
        }
      }
    };

    // Agregar event listener
    container.addEventListener('wheel', handleWheelCapture, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheelCapture);
    };
  }, [value, onChange, disabled, min, step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? min : parseInt(e.target.value);
    const numericValue = isNaN(val) ? min : Math.max(min, val);
    onChange(numericValue);
  };

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <TextField
        fullWidth
        label={label + (required ? ' *' : '')}
        type="number"
        value={value === 0 ? '' : value} // Mostrar vacío para 0 (peso)
        onChange={handleChange}
        onWheel={handleWheel}
        disabled={disabled}
        error={!!error}
        helperText={error || helperText}
        size="small"
        variant="outlined"
        InputProps={{ 
          inputProps: { 
            min,
            step,
            ref: inputRef
          },
          // También prevenimos el scroll en el contenedor del input
          onWheel: (e: React.WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            // Asegurar que capture bien el wheel
            '& input': {
              '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
              MozAppearance: 'textfield',
            },
            '&:hover': {
              '& input': {
                cursor: 'ns-resize', // Cambiar cursor para indicar que se puede usar la rueda
              }
            }
          }
        }}
      />
    </div>
  );
};

export default NumericField;
