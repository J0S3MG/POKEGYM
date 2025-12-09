import { DiaSemana } from './Value_objects';

// ============ EJERCICIOS ============
export interface EjercicioResponse {
  id: number;
  rutina_id: number; 
  nombre: string;
  dia_semana: DiaSemana;
  series: number;
  repeticiones: number;
  peso: number | null;
  notas: string | null; 
  orden: number;
}

export interface EjercicioCreate {
  nombre: string;
  dia_semana: DiaSemana;
  series: number;
  repeticiones: number;
  peso?: number | null;
  notas?: string | null;
  orden: number;  
}

export interface EjercicioUpdate {
  id: number | null;
  nombre?: string;
  dia_semana?: DiaSemana;
  series?: number;
  repeticiones?: number;
  peso?: number | null;
  notas?: string | null;
  orden: number;  
}

// ============ RUTINAS ============
export interface RutinaResponse {
  id: number;
  nombre: string;
  descripcion: string | null;
  fecha_creacion: string;
  ejercicios: EjercicioResponse[]; 
}

export interface RutinaConEjerciciosCreate {
  nombre: string;
  descripcion?: string | null;
  ejercicios?: EjercicioCreate[]; 
}

export interface RutinaModificarRequest {
  nombre?: string;
  descripcion?: string | null;
  ejercicios_a_modificar_o_crear?: EjercicioUpdate[];
  ids_ejercicios_a_eliminar?: number[];  
}

export interface RutinaListParams {
  skip?: number;
  limit?: number;
}