import type { Idioma } from '../i18n/config';
import type { Proyecto, Tecnologias } from './esquemas';

export interface EntradaProyecto {
  id: string;
  filePath?: string;
  data: Proyecto;
}

export function identidad(id: string) {
  const [idioma, ...partes] = id.split('/');
  return { idioma, slug: partes.join('/') };
}

export function validarRelaciones(
  proyectos: EntradaProyecto[],
  tecnologias: { id: string; data: Tecnologias }[],
) {
  const ordenes = new Map<string, string>();
  for (const proyecto of proyectos) {
    const { idioma } = identidad(proyecto.id);
    const archivo = proyecto.filePath ?? `src/content/proyectos/${proyecto.id}.mdx`;
    const catalogo = tecnologias.find((entrada) => entrada.id === idioma) ?? tecnologias.find((entrada) => entrada.id === 'es');
    if (!catalogo) throw new Error(`${archivo}: falta el catálogo de tecnologias para ${idioma}`);
    const herramientas = new Set(catalogo.data.areas.flatMap((area) => area.herramientas));
    for (const herramienta of proyecto.data.herramientas) {
      if (!herramientas.has(herramienta)) {
        throw new Error(`${archivo}: herramientas: «${herramienta}» no aparece en tecnologias/${catalogo.id}.json`);
      }
    }
    if (proyecto.data.orden_destacado !== undefined) {
      const clave = `${idioma}/${proyecto.data.orden_destacado}`;
      const anterior = ordenes.get(clave);
      if (anterior) throw new Error(`${archivo}: orden_destacado repetido con ${anterior}`);
      ordenes.set(clave, archivo);
    }
  }
}

// Conserva la entrada original (y su cuerpo MDX) al ofrecer el respaldo español.
export function seleccionarProyectos<T extends EntradaProyecto>(
  entradas: T[],
  idioma: Idioma,
  activos: readonly Idioma[],
) {
  if (!activos.includes(idioma)) throw new Error(`Idioma inactivo: ${idioma}`);
  const slugs = new Set(entradas.filter((p) => ['es', idioma].includes(identidad(p.id).idioma)).map((p) => identidad(p.id).slug));
  return [...slugs].sort().map((slug) => {
    const traduccion = entradas.find((p) => p.id === `${idioma}/${slug}`);
    const proyecto = traduccion ?? entradas.find((p) => p.id === `es/${slug}`)!;
    return { ...proyecto, slug, idioma, esRespaldo: !traduccion && idioma !== 'es' };
  });
}

export function seleccionarDestacados<T extends EntradaProyecto>(proyectos: T[]) {
  return proyectos.filter((p) => p.data.destacado && p.data.estado !== 'archivado')
    .sort((a, b) => a.data.orden_destacado! - b.data.orden_destacado!);
}
