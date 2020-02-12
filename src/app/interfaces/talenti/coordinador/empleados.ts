export interface Empleados {
    status: string;
    Empleados: Array<Empleado>;
}

export interface Empleado {
  iIdEmpleado: string;
  sNombres: string;
  sApellidos: string;
  iIdRol: string;
  sRol: string;
}
