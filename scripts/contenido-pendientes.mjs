import { readFile } from 'node:fs/promises';
import { archivosEn } from './archivos.mjs';

let total = 0;
for (const archivo of await archivosEn('src/content')) {
  if (!/\.(?:mdx?|json)$/.test(archivo)) continue;
  const contenido = await readFile(archivo, 'utf8');
  const pendientes = [...contenido.matchAll(/‹[^‹›]+›|["']?borrador["']?\s*:\s*true/gu)];
  if (!pendientes.length) continue;
  console.log(`${archivo}:`);
  for (const pendiente of pendientes) {
    const linea = contenido.slice(0, pendiente.index).split('\n').length;
    console.log(`  ${linea}: ${pendiente[0]}`);
  }
  total += pendientes.length;
}
console.log(`${total} pendientes.`);
process.exitCode = process.argv.includes('--estricto') && total > 0 ? 1 : 0;
