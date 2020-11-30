import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { ProductoVariedad } from '../clases/producto-variedad';
import { ProductosService } from './productos.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private items: Map<ProductoVariedad, number>;
  private db: Dexie;


  constructor(private productosSvc: ProductosService) {

    this.items = new Map<ProductoVariedad, number>();

    this.db = new Dexie('store-pedidos');
    this.db.version(13).stores({
      pedido: '[codigoProducto+codigoVariedad],cantidad'
    })

    this.cargarDatosDB();
  }

  cargarDatosDB(): Promise<Map<ProductoVariedad, number>> {
    return this.db.table('pedido').each(v => {
      this.productosSvc.obtenerVariedad(v["codigoProducto"], v["codigoVariedad"])
        .then(variedad => {
          this.items.set(variedad, Number.parseInt(v["cantidad"]));
        }
        );

    }).then((_: any) => { return this.items; });
  }


  get cantidadItems(): number {
    var count = 0;
    this.items.forEach((v) => { v > 0 ? count++ : count });
    return count;
  }


  actualizarBD() {
    this.items.forEach((value, key) => {
      this.db.table("pedido").put({
        codigoProducto: key.codigoProducto,
        codigoVariedad: key.codigoVariedad,
        cantidad: value
      })
    });
  }

  cantidadItem(item: ProductoVariedad): number {
    return this.items.has(item) ? this.items.get(item)! : 0;
  }

  limpiarPedido() {
    this.items = new Map<ProductoVariedad, number>();
    this.db.table("pedido").clear();
  }

  quitarProductoVariedad(item: ProductoVariedad) {
    if (this.items.has(item) && this.items.get(item)! > 0) {
      this.items.set(item, this.items.get(item)! - 1);
    }
    this.actualizarBD();
  }

  agregarProductoVariedad(item: ProductoVariedad) {
    if (this.items.has(item)) {
      this.items.set(item, this.items.get(item)! + 1)
    }
    else this.items.set(item, 1);

    this.actualizarBD();
  }

  obtenerPedido(): Promise<Map<ProductoVariedad, number>> {
    return this.cargarDatosDB().then(res => {return res});
  }

  enviarPedido() {
this.cargarDatosDB().then(res => {
  
})
  }
}
