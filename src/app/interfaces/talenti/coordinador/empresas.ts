export interface Empresas {
    status: string;
    resultado: string;
    empresas: Array<TipoEmpresa>
}

export interface TipoEmpresa {
    id: string;
    nombre: string;
}
