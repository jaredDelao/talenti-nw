export interface CatalogoEstudios {
    status: string;
    resultado: string;
    estudios: Array<CatalogoEstudio>;
    costoEstudio: string;
    costoCancelado: string;
}

export interface CatalogoEstudio {
    iIdEstudio: string;
    nombre: string;
}

export interface FechasEstudios {
    dFechaAplicacion: string;
    dFechaPreliminar: string;
    dFechaPublicacion: string;
    dFechaSolicitud: string;
    dfechahoraultAgenda: string;
    fValidacion: string;
    fasignacion: string;
    fdictamen: string;
}