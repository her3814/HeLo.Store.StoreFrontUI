export interface EnvioTipo {
    descripcion: string;
    requiereDomicilio: Boolean;
    costo: number;
    fecha: Date,
    tipo: EnvioTipos
}

export enum EnvioTipos {
    domicilio,
    retiro,
    reserva
}