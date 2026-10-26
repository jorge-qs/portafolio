export interface NodoDiagrama {
  id: string;
  etiqueta: string;
  x: number;
  y: number;
  responsabilidad: string;
  entradas_salidas: string;
  cumple: string;
  codigo?: string;
}
export interface ModeloDiagrama {
  nodos: NodoDiagrama[];
  aristas: [string, string][];
  seleccionado?: string;
}
