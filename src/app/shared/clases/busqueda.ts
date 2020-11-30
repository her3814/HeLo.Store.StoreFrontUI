export interface Busqueda<T> {
    cantidadPorPagina: number;
    total: number;
    resultadoBusqueda: Array<T>;
    cantidad: number;
    totalPaginas: number;
    pagina:number;
}
