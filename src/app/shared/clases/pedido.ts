import { DatosCliente } from './datos-cliente';
import { Direccion } from './direccion';
import { EnvioTipo } from './envio-tipo';
import { PedidoItem } from './pedido-item';

export interface Pedido {
    items: PedidoItem[];
    direccionEntrega: Direccion | undefined;
    tipoEnvio: EnvioTipo | undefined;
    observaciones: string | undefined;
    datosCliente: DatosCliente | undefined;
}
