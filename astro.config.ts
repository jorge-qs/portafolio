import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { IDIOMA_BASE, IDIOMAS_ACTIVOS } from './src/i18n/config';

export default defineConfig({
  output: 'static',
  integrations: [mdx()],
  i18n: {
    defaultLocale: IDIOMA_BASE,
    locales: IDIOMAS_ACTIVOS,
    routing: { prefixDefaultLocale: false },
  },
});
