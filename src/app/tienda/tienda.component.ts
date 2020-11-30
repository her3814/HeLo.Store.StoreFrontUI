import { Component, OnInit } from '@angular/core';
import { Categoria } from '../shared/clases/categoria';
import { Producto } from '../shared/clases/producto';
import { ProductoVariedad } from '../shared/clases/producto-variedad';
import { CategoriasService } from '../shared/servicios/categorias.service';
import { PedidoService } from '../shared/servicios/pedido.service';
import { ProductosService } from '../shared/servicios/productos.service';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.scss']
})
export class TiendaComponent implements OnInit {

  public categoriasEncabezado: Categoria[] | undefined;
  public categoriaSeleccionada: Categoria | undefined;
  public categorias: Categoria[] | undefined;

  public productos: Producto[] | undefined;
  public productoSeleccionado: Producto | undefined;
  public variedadesProducto: ProductoVariedad[] | undefined;

  public mostrarCategorias: boolean = false;



  constructor(private categoriasSvc: CategoriasService, private productosSvc: ProductosService, private pedidoSvc: PedidoService) {

  }

  ngOnInit(): void {
    this.categoriasSvc.obtener(4, 1).then(res => {
      this.categoriasSvc.obtenerTodo().then(res => this.categorias = res);

      this.categoriasEncabezado = res.resultadoBusqueda;
    }).then(_ => { this.cambiarCategoria(undefined); });
  }


  cambiarCategoria(categoria: Categoria | undefined) {
    this.categoriaSeleccionada = categoria;
    this.productosSvc.obtenerProductos(5, 1, categoria).then(p => {
      this.productos = p.resultadoBusqueda;
    }); 
  } 

  cambiarProducto(producto: Producto | undefined) {
    if (producto) {
      this.productoSeleccionado = producto!;
      this.productosSvc.variedadesProducto(producto).then(res => {
        this.variedadesProducto = res;
        console.log(res);
      });
    } else {
      this.productoSeleccionado = undefined;
      this.variedadesProducto = undefined;
    }
  }


  agregarVariedad(item: ProductoVariedad) {
    this.pedidoSvc.agregarProductoVariedad(item);
  }
  quitarVariedad(item: ProductoVariedad) {
    this.pedidoSvc.quitarProductoVariedad(item);
  }

  cantidadItem(item: ProductoVariedad): number {
    return this.pedidoSvc.cantidadItem(item);
  }

}
