import { expect, test } from 'vitest';
import es from '../src/i18n/es.json';
import en from '../src/i18n/en.json';
import { formatearFecha, ruta, t } from '../src/i18n';

test('es y en tienen exactamente las mismas claves', () => {
  expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort());
});
test('las claves ausentes siempre fallan', () => {
  expect(() => t('es', 'noExiste')).toThrow('Clave i18n inexistente: es.noExiste');
});
test('es vive en la raíz y en está preparado con prefijo', () => {
  expect(ruta('es', '/')).toBe('/');
  expect(ruta('es', 'proyectos/ejemplo')).toBe('/proyectos/ejemplo');
  expect(ruta('en', '/')).toBe('/en/');
  expect(ruta('en', '/proyectos/ejemplo')).toBe('/en/proyectos/ejemplo');
});
test('las fechas se formatean con el idioma y sin desfase horario', () => {
  expect(formatearFecha('es', '2026-10-25')).toBe('25 de octubre de 2026');
  expect(formatearFecha('en', '2026-10-25')).toBe('October 25, 2026');
});
