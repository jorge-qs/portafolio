import { getCollection } from 'astro:content';
import { IDIOMAS_ACTIVOS, type Idioma } from '../i18n/config';
import { seleccionarProyectos, validarRelaciones } from './validacion';

export async function obtenerProyectos(idioma: Idioma) {
  const [proyectos, tecnologias] = await Promise.all([getCollection('proyectos'), getCollection('tecnologias')]);
  validarRelaciones(proyectos, tecnologias);
  return seleccionarProyectos(proyectos, idioma, IDIOMAS_ACTIVOS);
}
