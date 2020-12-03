import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductoVariedad } from '../clases/producto-variedad';
import { Pedido } from '../clases/pedido';
import { ProductosService } from '../servicios/productos.service';
import { PedidoItem } from '../clases/pedido-item';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private _pedido: BehaviorSubject<Pedido | null>;
  public pedido: Observable<Pedido | null>;
  private numeroDestinoWsp: string = environment.telefonoNumero;

  private _cantidadItems: BehaviorSubject<number>;
  public cantidadItems: Observable<number>;

  constructor(private productosSvc: ProductosService) {

    this._pedido = new BehaviorSubject<Pedido | null>(null);
    this.pedido = this._pedido.asObservable();

    this._cantidadItems = new BehaviorSubject<number>(0);
    
    this._pedido.subscribe(_ => {
      this.actualizarDatos();
      this.calcularCantidadItems();
    });    
    
    this.cantidadItems = this._cantidadItems.asObservable();

    if (window.sessionStorage) {
      this.cargarDatos();
    } else this.inicializarPedido();


  
  }

  private inicializarPedido() {
    this._pedido.next({
      items: new Array<PedidoItem>(),
      direccionEntrega: undefined,
      tipoEnvio: undefined
    });
  }

  private cargarDatos() {
    var pedidoCache = window.sessionStorage.getItem('pedido');
    if (!pedidoCache || pedidoCache == null|| pedidoCache == "null")
      this.inicializarPedido();
    else {
      console.log("Encontre pedido en SessionStorage.");
      console.log(pedidoCache);
      this._pedido.next(JSON.parse(pedidoCache) as Pedido);
    }
  }

  private actualizarDatos() {
    if (window.sessionStorage) {
      window.sessionStorage.setItem('pedido', JSON.stringify(this._pedido.value))
    }
  }

  calcularCantidadItems() {
    var prods = new Array<string>();

    this._pedido.value?.items.forEach(i => { if (!prods.includes(i.itemCodigoProducto)) prods.push(i.itemCodigoProducto) });
    this._cantidadItems.next(prods.length);
  }

  cantidadItem(item: ProductoVariedad): number {
    return this._pedido.value?.items.find(i => i.itemCodigoProducto == item.codigoProducto && i.itemCodigoVariedad == item.codigoVariedad)?.itemCantidad ?? 0;
  }

  limpiarPedido() {
    this.inicializarPedido();
  }

  quitarProductoVariedad(item: ProductoVariedad) {
    var pedido = this._pedido.value;

    var itemPedido = pedido!.items.find(i => i.itemCodigoProducto == item.codigoProducto && i.itemCodigoVariedad == item.codigoVariedad);
   
   console.log(item);
   console.log(itemPedido);
    if (itemPedido && itemPedido.itemCantidad > 0) {
      itemPedido.itemCantidad--;
    };

    this._pedido.next(pedido);
  }

  setearProductoVariedad(item: ProductoVariedad, cantidad: number) {
    var pedido = this._pedido.value;
    var itemPedido = pedido!.items.find(i => i.itemCodigoProducto == item.codigoProducto && i.itemCodigoVariedad == i.itemCodigoVariedad);
    if (itemPedido) {
      itemPedido.itemCantidad = cantidad;
    }

    this._pedido.next(pedido);
  }

  agregarProductoVariedad(item: ProductoVariedad) {
    var pedido = this._pedido.value;
    var pedidoItem = pedido!.items.find(i => i.itemCodigoProducto == item.codigoProducto && i.itemCodigoVariedad == item.codigoVariedad);

    if (pedidoItem) {
      pedido!.items[pedido!.items.indexOf(pedidoItem)].itemCantidad++;
      this._pedido.next(pedido);
    }
    else {
      this.productosSvc.obtenerProducto(item.codigoProducto).then(p => {
        if (p) {
          pedido!.items.push(
            {
              itemCantidad: 1,
              itemCodigoProducto: p.codigo,
              itemCodigoVariedad: item.codigoVariedad,
              itemCosto: item.costo,
              itemNombreProducto: p.nombre,
              itemNombreVariedad: item.nombre
            });
          this._pedido.next(pedido);
        }
        else throw new Error("El producto que intenta agregar no existe.");
      });
    }
  }

  enviarPedido() {

    var pedido = this._pedido.value;
    if (pedido) {
      var prods = new Array<string>();
      pedido.items.forEach(i => { if (!prods.find(k => k == i.itemCodigoProducto)) prods.push(i.itemCodigoProducto) });
      var productosTexto: string = '';

      prods.forEach(p => {
        var itemsProducto = pedido!.items.filter(i => i.itemCodigoProducto == p);

        itemsProducto.forEach((i, idx) => {

          if (idx == 0)
            productosTexto = productosTexto.concat("*" + i.itemNombreProducto, "* \n");

          productosTexto = productosTexto.concat("-*(", i.itemCantidad.toString(), 'x) ', i.itemNombreVariedad, "* $", (i.itemCosto * i.itemCantidad).toFixed(2), "\n");

        })
      });

      window.open(encodeURI("https://wa.me/" + this.numeroDestinoWsp + "?text=" + productosTexto!));
    }
  }
}
