import { z } from 'astro/zod';

const texto = z.string().trim().min(1);
const placeholder = z.string().regex(/^‹[^‹›]+›$/u);
const enlace = z.union([z.url(), z.string().regex(/‹[^‹›]+›/u)]);
const fecha = z.union([z.iso.date(), placeholder]);

export const proyectoSchema = z
  .object({
    titulo: texto,
    tipo: z.enum(['ing', 'inv', 'hib']),
    anio: z.union([z.number().int(), placeholder]),
    resumen: texto,
    herramientas: z.array(texto).min(1),
    fecha: texto.optional(),
    lectura_min: z.union([z.number().int().positive(), placeholder]).optional(),
    investigacion: z
      .object({
        autores: texto,
        afiliacion: texto,
        publicado: texto,
        bibtex: texto.optional(),
      })
      .optional(),
    rol: texto,
    destacado: z.boolean(),
    orden_destacado: z.number().int().min(1).max(3).optional(),
    enlaces: z.object({
      repo: enlace.optional(),
      demo: enlace.optional(),
      pdf: enlace.optional(),
    }),
    capitulos_relato: z.array(texto).min(1).optional(),
    estado: z.enum(['activo', 'terminado', 'archivado']).default('terminado'),
    borrador: z.boolean(),
  })
  .superRefine((proyecto, ctx) => {
    if (proyecto.destacado) {
      for (const campo of ['orden_destacado', 'capitulos_relato'] as const) {
        if (proyecto[campo] === undefined) {
          ctx.addIssue({
            code: 'custom',
            path: [campo],
            message: `Un proyecto destacado requiere ${campo}`,
          });
        }
      }
    }
  });

export const notaSchema = z.object({
  titulo: texto,
  fecha,
  tipo: texto,
  borrador: z.boolean(),
});

export const perfilSchema = z.object({
  nombre: texto,
  anio_copyright: z.union([z.number().int(), placeholder]),
  frase_hero: texto,
  presentacion: texto,
  foto: z.object({ ruta: texto, alt: texto }).optional(),
  frase_contacto: texto,
  preguntas: z.array(z.object({ tipo: texto, texto })),
  trayectoria: z.array(texto),
  cv: z.object({ url: enlace, fecha }),
  contacto: z.object({
    email: z.union([z.email(), z.string().regex(/‹[^‹›]+›/u)]),
    github: enlace,
    linkedin: enlace,
  }),
  borrador: z.boolean(),
});

export const tecnologiasSchema = z.object({
  areas: z
    .array(
      z.object({
        id: texto,
        nombre: texto,
        herramientas: z.array(texto).min(1),
      }),
    )
    .length(5),
  borrador: z.boolean(),
});

export type Proyecto = z.infer<typeof proyectoSchema>;
export type Tecnologias = z.infer<typeof tecnologiasSchema>;
