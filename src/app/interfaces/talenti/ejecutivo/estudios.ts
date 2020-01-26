export interface Estudios {
  status: string;
  estudios: Array<Estudio>;
}

export interface Estudio {
  folio: string;
  estudio: string;
  nombre: string;
  estado: string;
  municipio: string;
  fechasolicitud: string;
  horasolicitud: string;
  agendado: string;
  fechaagenda: string;
  preliminar: string;
  fechaaplicacion: string;
  estatus: string;
  publicacion: string;
  dictamen: string;
  descarga: string;
  solicitarcalidad: string;
  solicitudcalidad: string;
  certificadocalidad: string;
}
