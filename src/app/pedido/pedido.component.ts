import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Pedido } from '../shared/clases/pedido';
import { PedidoService } from '../shared/servicios/pedido.service';
import { ProductosService } from '../shared/servicios/productos.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.scss']
})
export class PedidoComponent implements OnInit, OnDestroy {


  pedido: Pedido | undefined;
  private subscription: Subscription | undefined;

  constructor(private pedidoSvc: PedidoService, private productosSvc: ProductosService) {

  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.subscription = this.pedidoSvc.pedido.subscribe(ped => {
      console.log(ped);
      if (ped)
        this.cargarDatos(ped);
    });
  }

  cargarDatos(ped: Pedido) {
    this.pedido = ped;
  }

  limpiarPedido() {
    this.pedidoSvc.limpiarPedido();
  }

  agregarItem(item: CabeceraVariedad) {
    console.log('agregando');
    console.log(item);
    this.productosSvc.obtenerVariedad(item.codigoProducto, item.codigo).then(variedad => { console.log(variedad); this.pedidoSvc.agregarProductoVariedad(variedad); })
  }

  quitarItem(item: CabeceraVariedad) {
    console.log('agregando');
    console.log(item);
    this.productosSvc.obtenerVariedad(item.codigoProducto, item.codigo).then(variedad => { this.pedidoSvc.quitarProductoVariedad(variedad) })
  }

  get productosKeys(): string[] {
    var keys: Array<string> = new Array<string>();
    this.pedido?.items.forEach(i => { if ( keys.find(k => k==i.itemCodigoProducto) == undefined) keys.push(i.itemCodigoProducto); });
    return keys;
  }

  get cabecerasProducto(): CabeceraProducto[] {
    var keys: Array<CabeceraProducto> = new Array<CabeceraProducto>();
    this.pedido?.items.forEach(i => { if (!keys.find(p => p.codigo==i.itemCodigoProducto)) keys.push({ codigo: i.itemCodigoProducto, nombre: i.itemNombreProducto }); });
    return keys;
  }

  itemVariedades(prod: CabeceraProducto): CabeceraVariedad[] {
    var keys = new Array<CabeceraVariedad>();

    var items = this.pedido!.items
      .filter(i => { return i.itemCodigoProducto == prod.codigo });


    items!.forEach(i => {
      keys.push({
        codigoProducto: prod.codigo, codigo: i.itemCodigoVariedad, nombre: i.itemNombreVariedad, cantidad: i.itemCantidad, costo: i.itemCosto
      });
    });

    return keys;
  }


  get subTotalPedido(): number {
    var subTotal: number = 0;
    this.pedido?.items.forEach(i => subTotal += i.itemCantidad * i.itemCosto);
    return subTotal;
  }

  enviarPedido(){
    this.pedidoSvc.enviarPedido();
  }
}

interface CabeceraProducto {
  codigo: string;
  nombre: string;
}

interface CabeceraVariedad {
  codigoProducto: string,
  codigo: string,
  nombre: string,
  cantidad: number,
  costo: number
}