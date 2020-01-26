export interface CatalogoEstudios {
    status: string;
    resultado: string;
    estudios: Array<CatalogoEstudio>;
    costoEstudio: string;
    costoCancelado: string;
}

export interface CatalogoEstudio {
    id: string;
    nombre: string;
}
