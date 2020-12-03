import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from '../clases/producto';
import { ProductoVariedad } from '../clases/producto-variedad';
import { map, catchError } from 'rxjs/operators';
import { Categoria } from '../clases/categoria';
import { Busqueda } from '../clases/busqueda';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private productos: Producto[] | null;
  private variedadesProductos: ProductoVariedad[] | null;

  constructor(private _http: HttpClient) {
    this.productos = null;
    this.variedadesProductos = null;
  }

  obtenerProducto(codigo: string): Promise<Producto | undefined> {
    return this.cargarProductos().then(prod => {
      return new Promise(res => res(prod.find(p => p.codigo == codigo)));
    })
  }

  obtenerVariedad(codigoProducto: string, codigoVariedad: string): Promise<ProductoVariedad> {
    return this.cargarProductosVariedades().then(variedades => {
      return new Promise(res => {
        res(variedades.find(v => v.codigoProducto == codigoProducto && v.codigoVariedad == codigoVariedad));
      })
    });

  }

  obtenerProductos(cantPagina: number, pagina: number, categoria: Categoria | null = null): Promise<Busqueda<Producto>> {

    return this.cargarProductos().then(data => {
      return new Promise((res) => {
        let filtroCategoria: Producto[] = new Array<Producto>();

        if (categoria != null) {
          filtroCategoria = data.filter(p => p.categoriaCodigo == categoria.codigo);
        }

        else filtroCategoria = data;

        var resBusqueda = filtroCategoria.filter((_, idx) => {
          return idx >= (pagina - 1) * cantPagina && idx < (pagina * cantPagina);
        });

        var busRes: Busqueda<Producto> = {
          cantidadPorPagina: cantPagina,
          pagina: pagina,
          resultadoBusqueda: resBusqueda,
          cantidad: resBusqueda.length,
          total: filtroCategoria.length,
          totalPaginas: Math.ceil(filtroCategoria.length / cantPagina)
        };

        res(busRes);

      }
      );
    });
  }

  private async cargarProductos(): Promise<Producto[]> {
    if (this.productos) {
      return new Promise((res) => {
        res(this.productos!);
      })
    }
    else

      return this.cargarProductosVariedades().then(dataVariedades => {
        return this._http.get('assets/csv/Productos.csv', { responseType: 'text' }).pipe(
          map(dataProductos => {

            this.productos = new Array<Producto>();
            var filas: string[] = dataProductos.split('\n');

            filas.forEach((fila, index) => {
              if (index > 0) {
                var columnas: string[] = fila.split(',');

                let producto: Producto = {
                  categoriaCodigo: columnas[0],
                  codigo: columnas[1],
                  nombre: columnas[2],
                  imagenUrl: columnas[3],
                  descripcion: columnas[4],
                  costoMaximo: 0,
                  costoMinimo: 0
                };
                var variedadesProducto = dataVariedades.filter(v => v.codigoProducto == producto.codigo);
                if (variedadesProducto.length == 1) {
                  producto.costoMinimo = variedadesProducto[0].costo;
                  producto.costoMaximo = variedadesProducto[0].costo;
                } else {
                  producto.costoMaximo = variedadesProducto.sort((a, b) => a.costo - b.costo).pop()!.costo;
                  producto.costoMinimo = variedadesProducto.sort((a, b) => b.costo - a.costo).pop()!.costo;
                }
                this.productos!.push(producto);
              }
            });
            return this.productos!;
          }),
          catchError(err => {
            throw err;
          })
        ).toPromise<Producto[]>();
      });
  }



  variedadesProducto(producto: Producto): Promise<ProductoVariedad[]> {
    return this.cargarProductosVariedades().then(
      variedades => {
        return variedades.filter(v => v.codigoProducto == producto.codigo);
      }
    )
  }

  private cargarProductosVariedades(): Promise<ProductoVariedad[]> {
    if (this.variedadesProductos) {
      return new Promise((res) => {
        res(this.variedadesProductos!);
      })
    }
    else return this._http.get('assets/csv/VariedadesProductos.csv', { responseType: 'text' }).pipe(
      map(data => {

        this.variedadesProductos = new Array<ProductoVariedad>();

        var filas: string[] = data.split('\n');

        filas.forEach((fila, index) => {
          if (index > 0) {
            var columnas: string[] = fila.split(',');
            this.variedadesProductos!.push(
              {
                codigoProducto: columnas[0],
                codigoVariedad: columnas[1],
                nombre: columnas[2],
                costo: Number.parseInt(columnas[3]),
              });
          }
        });
        return this.variedadesProductos!;
      }),
      catchError(err => {
        throw err;
      })
    ).toPromise<ProductoVariedad[]>();
  }

}
