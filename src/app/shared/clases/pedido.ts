import { Direccion } from './direccion';
import { ProductoVariedad } from './producto-variedad';

export interface Pedido {
    direccionEntrega: Direccion;
    productos: ProductoVariedad[];   
}
