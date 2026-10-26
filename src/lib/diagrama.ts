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

// Estado visual de un diagrama (C8). Lo fija el artículo (seleccionado), F4 al
// interactuar y F5 en cada capítulo del relato (posiciones, recorrido, atenuados).
export interface EstadoDiagrama {
  seleccionado?: string;
  recorrido?: string[];
  atenuados?: string[];
  aristasResaltadas?: [string, string][];
  posiciones?: Record<string, { x: number; y: number }>;
}

// F5: permite componer las dos topologías sin modificar el renderer compartido.
export interface EstadoFiguraRelato extends EstadoDiagrama {
  aristasVisibles?: [string, string][];
}
