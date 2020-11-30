import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Busqueda } from '../clases/busqueda';
import { Categoria } from '../clases/categoria';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private categorias: Categoria[] | null;

  constructor(private _http: HttpClient) {
    this.categorias = null;
  }

  obtener(codigo: string): Promise<Categoria | null> {
    return this.obtenerTodo().then(categorias => {
      return new Promise(res => res(categorias.find(c => c.codigo == codigo)));
    })
  }

  obtenerTodo(): Promise<Categoria[]> {
    if (this.categorias) {
      return new Promise((res) => {
        res(this.categorias!);
      })
    }
    else return this._http.get('assets/csv/Categorias.csv', { responseType: 'text' }).pipe(
      map(data => {

        this.categorias = new Array<Categoria>();

        var filas: string[] = data.split('\n');

        filas.forEach((fila, index) => {
          if (index > 0) {
            var columnas: string[] = fila.split(',');
            this.categorias!.push(
              {
                codigo: columnas[0],
                nombre: columnas[1]
              });
          }
        });
        return this.categorias!;
      }),
      catchError(err => {
        throw err;
      })
    ).toPromise<Categoria[]>();
  }

  obtenerCategorias(cantPagina: number, pagina: number): Promise<Busqueda<Categoria>> {
    return this.obtenerTodo().then(data => {
      return new Promise((res) => {
        var busRes: Busqueda<Categoria> = {
          cantidadPorPagina: cantPagina,
          pagina: pagina,
          resultadoBusqueda: data.filter((_, idx) => {
            return idx >= (pagina - 1) * cantPagina && idx < (pagina * cantPagina);
          }),
          cantidad: data!.filter((_, idx) => {
            idx >= (pagina - 1) * cantPagina && idx < (pagina * cantPagina)
          }).length,
          total: data.length,
          totalPaginas: Math.ceil(data.length / cantPagina)
        };
        res(busRes);
      });
    });
  }
}
