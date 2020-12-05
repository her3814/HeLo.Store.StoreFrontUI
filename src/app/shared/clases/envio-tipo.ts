export interface EnvioTipo {
    descripcion: string;
    requiereDomicilio: Boolean;
    costo: number;
    tipo: EnvioTipos,
    icon: string
}

export enum EnvioTipos {
    domicilio,
    retiro,
    reserva
}