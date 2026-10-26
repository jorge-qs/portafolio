import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { notaSchema, perfilSchema, proyectoSchema, tecnologiasSchema } from './content/esquemas';

const proyectos = defineCollection({
  loader: glob({ pattern: '*/*.mdx', base: './src/content/proyectos', generateId: ({ entry }) => entry.replace(/\.mdx$/, '') }),
  schema: proyectoSchema,
});
const notas = defineCollection({
  loader: glob({ pattern: '*/*.{md,mdx}', base: './src/content/notas', generateId: ({ entry }) => entry.replace(/\.mdx?$/, '') }),
  schema: notaSchema,
});
const perfil = defineCollection({ loader: glob({ pattern: '*.json', base: './src/content/perfil' }), schema: perfilSchema });
const tecnologias = defineCollection({ loader: glob({ pattern: '*.json', base: './src/content/tecnologias' }), schema: tecnologiasSchema });

export const collections = { proyectos, notas, perfil, tecnologias };
