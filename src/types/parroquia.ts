export interface Parroquia {
  id_parroquia: number;
  nombre: string;
  direccion: string;
  telefono: string;
  created_at?: string;
  updated_at?: string;
}

export interface ParroquiaFormData {
  nombre: string;
  direccion: string;
  telefono: string;
}

export interface ParroquiaStats {
  total_grupos: number;
  total_catequizandos: number;
  total_usuarios: number;
}
