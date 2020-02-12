export interface Ejecutivos {
  status: string;
  Empleados: Array<Ejecutivo>;
}

export interface Ejecutivo {
  iIdEmpleado: string;
  sNombres: string;
  sApellidos: string;
  iIdRol: string;
  sRol: string;
}
