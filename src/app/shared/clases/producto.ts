export interface Producto {
    codigo: string;
    nombre: string;
    imagenUrl: string;
    descripcion: string;
    categoriaCodigo: string; 
    costoMinimo: number | undefined;
    costoMaximo: number | undefined;
}
