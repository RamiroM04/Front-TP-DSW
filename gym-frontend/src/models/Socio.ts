export interface Socio {
  id: number;
  nombre: string;
  apellido: string;
  tipo_doc: 'DNI' | 'Pasaporte' | 'Otro';
  nro_doc: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  fechaRegistro: string;
  estado: 'activo' | 'inactivo';
}
