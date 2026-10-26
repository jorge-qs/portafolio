/** Contenido literal de Maqueta 2. Las barras de prosa sin texto siguen pendientes. */
import type { ModeloDiagrama } from '../../lib/diagrama';
export const fichaA = {
  campos: [
    { clave: 'rol', valor: '‹pendiente›' },
    { clave: 'tecnologias', valor: '‹pendiente›' },
    { clave: 'fecha', valor: '‹mes · año›' },
  ],
  recursos: [
    { clave: 'repositorio', url: '‹repositorio›' },
    { clave: 'demo', url: '‹demo›' },
  ],
};
export const fichaB = {
  campos: [
    { clave: 'autores', valor: '‹autor› · ‹coautores›' },
    { clave: 'afiliacion', valor: '‹pendiente›' },
    { clave: 'publicado', valor: '‹fecha›' },
  ],
  recursos: [
    { clave: 'pdf', url: '‹pdf›' },
    { clave: 'codigo', url: '‹código›' },
  ],
};
export const minuto = {
  problema: '‹una línea›',
  construi: '‹una línea›',
  resultado: '‹métrica pendiente›',
};
export const pregunta = {
  pregunta: '¿‹pregunta en una sola oración›?',
  h1: '‹hipótesis›',
  h0: '‹hipótesis nula›',
};
export const diagrama: ModeloDiagrama = {
  nodos: [
    ['user', 'Usuario', 50, 200],
    ['orq', 'Orquestador', 215, 200],
    ['a', 'Agente A', 390, 70],
    ['b', 'Agente B', 410, 200],
    ['c', 'Agente C', 390, 330],
    ['mem', 'Memoria', 215, 340],
    ['tools', 'Herramientas', 215, 60],
  ].map(([id, etiqueta, x, y]) => ({
    id: String(id),
    etiqueta: String(etiqueta),
    x: Number(x),
    y: Number(y),
    responsabilidad: '‹pendiente›',
    entradas_salidas: '‹pendiente›',
    cumple: '‹R1 · R3›',
    codigo: '‹código›',
  })),
  aristas: [
    ['user', 'orq'],
    ['orq', 'a'],
    ['orq', 'b'],
    ['orq', 'c'],
    ['orq', 'mem'],
    ['orq', 'tools'],
    ['b', 'tools'],
  ],
  seleccionado: 'orq',
};
export const decisiones = [
  ['D1 · ‹tema›', '‹opción elegida›', '‹alternativa›', '‹razón› · cumple ‹R1›'],
  ['D2 · ‹tema›', '‹opción elegida›', '‹alternativa›', '‹razón›'],
  ['D3 · ‹tema›', '‹pendiente›', '‹pendiente›', '‹razón›'],
];
export const codigo = `plan = planner.make_plan(task)
for step in plan.steps:
    result = route(step).run(step)
    if not verify(result, step):
        result = retry(step, budget=‹n›)`;
export const anotaciones = [
  { linea: 1, texto: 'El plan se arma completo antes de actuar.' },
  { linea: 4, texto: 'Toda salida pasa por un verificador.' },
];
export const referencias = [
  '‹Autor, A. (año). Título. Revista.›',
  '‹Autor, B. (año). Título. Conferencia.›',
];
export const bibtex = '‹BibTeX pendiente›';
