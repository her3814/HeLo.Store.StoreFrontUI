import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EnvioTipo } from '../shared/clases/envio-tipo';
import { Pedido } from '../shared/clases/pedido';
import { EnviosService } from '../shared/servicios/envios.service';
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

  constructor(private pedidoSvc: PedidoService, private productosSvc: ProductosService, private enviosSvc: EnviosService) { }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.pedidoSvc.pedido.subscribe(ped => {
      if (ped)
        this.cargarDatos(ped);
    });
    this.obtenerEnvios()
  }

  cargarDatos(ped: Pedido) {
    this.pedido = ped;
  }

  limpiarPedido() {
    this.pedidoSvc.limpiarPedido();
  }

  agregarItem(item: CabeceraVariedad) {
    this.productosSvc.obtenerVariedad(item.codigoProducto, item.codigo).then(variedad => { console.log(variedad); this.pedidoSvc.agregarProductoVariedad(variedad); })
  }

  quitarItem(item: CabeceraVariedad) {
    this.productosSvc.obtenerVariedad(item.codigoProducto, item.codigo).then(variedad => { this.pedidoSvc.quitarProductoVariedad(variedad) })
  }

  get productosKeys(): string[] {
    var keys: Array<string> = new Array<string>();
    this.pedido?.items.forEach(i => { if (keys.find(k => k == i.itemCodigoProducto) == undefined) keys.push(i.itemCodigoProducto); });
    return keys;
  }

  get cabecerasProducto(): CabeceraProducto[] {
    var keys: Array<CabeceraProducto> = new Array<CabeceraProducto>();
    this.pedido?.items.forEach(i => { if (!keys.find(p => p.codigo == i.itemCodigoProducto)) keys.push({ codigo: i.itemCodigoProducto, nombre: i.itemNombreProducto }); });
    return keys;
  }

  quitarProducto(producto: CabeceraProducto) {
    this.productosSvc.obtenerProducto(producto.codigo).then(p => { if (p) this.pedidoSvc.quitarProducto(p); });
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

  enviarPedido() {
    this.pedidoSvc.enviarPedido();
  }


  obtenerEnvios() {
    this.enviosSvc.obtenerTiposEnvio().then(e => this.tiposEnvio = e);
  }

  private _tipoEnvio: EnvioTipo | undefined;

  get tipoEnvio(): EnvioTipo | undefined {
    return this._tipoEnvio
  }

  set tipoEnvio(value: EnvioTipo | undefined) {
    if (value == this._tipoEnvio)
      this._tipoEnvio = undefined;
    else this._tipoEnvio = value;
  }

  tiposEnvio: EnvioTipo[] | undefined;


  provincia = new FormControl({ value: 'Entre Ríos', disabled: true });
  departamento = new FormControl({ value: 'Diamante', disabled: true });
  ciudad = new FormControl('Diamante', [Validators.required]);
  observaciones = new FormControl('', [Validators.maxLength(120)]);
  calle = new FormControl('', [Validators.required]);
  numero = new FormControl('', [Validators.required]);
  entreA = new FormControl('', [Validators.required]);
  entreB = new FormControl('', [Validators.required]);
  longitud = new FormControl('');
  latitud = new FormControl('');

  direccion = new FormGroup({
    calle: this.calle,
    numero: this.numero,
    entreA: this.entreA,
    entreB: this.entreB
  });

  direccionForm = new FormGroup(
    {
      provincia: this.provincia,
      departamento: this.departamento,
      ciudad: this.ciudad,
      observaciones: this.observaciones,
      direccion: this.direccion,
      longitud: this.longitud,
      latitud: this.latitud,
    }
  )

  ciudades: string[] = ["Diamante", "Strobel", "Belgrano", "Otro"];
  telefonoRegExp: RegExp = new RegExp('^(?:(?:00)?549?)?0?(?:11|[2368]\\d)(?:(?=\\d{0,2}15)\\d{2})??\\d{8}$');
  nombre = new FormControl('', [Validators.required]);
  apellido = new FormControl('', [Validators.required]);
  telefono = new FormControl('', [Validators.required, Validators.pattern(this.telefonoRegExp)]);
  email = new FormControl('', [Validators.email]);

  formContacto = new FormGroup({
    nombre: this.nombre,
    apellido: this.apellido,
    telefono: this.telefono,
    email: this.email
  });
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