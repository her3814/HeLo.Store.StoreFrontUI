export interface EnvioTipo {
    descripcion: string;
    requiereDomicilio: Boolean;
    costo: number;
    tipo: EnvioTipos,
}

export enum EnvioTipos {
    domicilio,
    retiro,
    reserva
}