import { getCollection } from 'astro:content';
import { IDIOMAS_ACTIVOS, type Idioma } from '../i18n/config';
import { seleccionarProyectos, validarRelaciones } from './validacion';

export async function obtenerProyectos(idioma: Idioma) {
  const [proyectos, tecnologias] = await Promise.all([
    getCollection('proyectos'),
    getCollection('tecnologias'),
  ]);
  validarRelaciones(proyectos, tecnologias);
  return seleccionarProyectos(proyectos, idioma, IDIOMAS_ACTIVOS);
}

export async function hayNotasPublicadas(idioma: Idioma) {
  // Astro advierte al consultar una colección vacía. El glob solo comprueba
  // si hay archivos; la publicación y el idioma los decide la colección tipada.
  if (!Object.keys(import.meta.glob('./notas/*/*.{md,mdx}')).length)
    return false;
  const notas = await getCollection('notas');
  return notas.some(
    (nota) => nota.id.startsWith(`${idioma}/`) && !nota.data.borrador,
  );
}
