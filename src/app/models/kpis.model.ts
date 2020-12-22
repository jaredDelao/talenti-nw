export interface Kpis {
    dFechaRegistro: string,
    iEstatusGeneral: string,
    iIdEstudio: string,
    sDescripcion: string,
}

export enum TipoKpi {
    VALIDACION = 4,
    PUBLICACION = 2,
    AGENDA = 1,
    ASIGNACION = 7,
    APLICACION = 8,
    CREACION = 6,
    ARCHIVOS = 9,
}

