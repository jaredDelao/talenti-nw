export interface Clientes {
  status: string;
  Clientes: Array<ClientesList>;
}

export interface ClientesList {
  iIdCliente: string;
  sNombres: string;
  sApellidos: string;
  iIdRol: string;
  sRol: string;
}
