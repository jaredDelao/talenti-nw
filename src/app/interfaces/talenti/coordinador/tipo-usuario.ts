export interface TipoUsuario {
    status: string;
    resultado: string;
    perfiles: Array<Perfiles>;
}

export interface Perfiles {
    id: string;
    desc: string;
}
