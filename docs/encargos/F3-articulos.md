# F3 · Artículos y notas

**Estado:** encargada
**Rama:** `f3-articulos` (worktree propio) · **Depende de:** F1 (en `main`) · **En paralelo con:** F2 · **Escrito por:** Claude · **Fecha:** 2026-10-25

> Cómo lanzarlo en Codex: *«Lee AGENTS.md y docs/encargos/F3-articulos.md. Implementa solo ese encargo y termina con el informe que pide.»*

## Objetivo
Al terminar, `/proyectos/<slug>` usa la plantilla definitiva según el tipo de proyecto:

- **A, ingeniería:** Cosmos por defecto;
- **B, investigación:** se muestra en Dawn en las capturas;
- **Híbrido:** la plantilla A con bloques de B.

Además, `/notas/<slug>` tiene su página de lectura. Funcionan también:

- el selector de tema sin parpadeo;
- el progreso de lectura;
- el índice lateral con el capítulo activo;
- «Capítulos ▾» en tablet y móvil;
- la hoja «Aa» con el tema y la opción de reducir movimiento;
- Anterior/Siguiente.

**El diagrama, la fórmula y el experimento se ven en estado estático.** Su interacción llega en F4.

## Leer antes
- `AGENTS.md`, completo.
- `design/docs/PAGINAS.md` § Rutas, § Artículo de ingeniería (plantilla A) y § Artículo de investigación (plantilla B).
- `design/docs/COMPONENTES.md` C2–C4, C8 (solo los estados de reposo y seleccionado), C9–C11 y la fila «Hoja inferior».
- `design/docs/INTERACCIONES.md` § Cambio de tema, § Reduced motion (global) y § Navegación (la fila «Artículo → ← Índice de proyectos»).
- `design/docs/TOKENS.md`, completo, incluida la tipografía del h1 de artículo y del código.
- `design/docs/DECISIONES.md` § Artículos y § Resueltas en la consolidación.
- `design/referencias/maqueta-2-articulos.html` **completa**, servida con `python3 -m http.server` desde `design/referencias/`:
  - § A: escritorio, móvil y la hoja inferior del diagrama;
  - § B: escritorio, móvil y la hoja «Aa».
- Código que ya existe y que **hay que reutilizar**:
  - `BaseLayout.astro`, con `tema="elegible"` y el script del tema;
  - `BarraGlobal.astro`, en estado `articulo`: tiene los huecos `--theme-slot` y `data-reservado="progreso-lectura"`, que rellenas tú;
  - `PiePagina.astro` en su variante de artículo, `Boton.astro` y `Enlace.astro`;
  - `src/content/validacion.ts`, con `ordenarProyectos()` para Anterior/Siguiente.

## Incluye
1. **`ArticuloLayout.astro`**:
   - **Retícula:** 180 / 632 / 260 con separación de 40 en ≥ 1200. Entre 768 y 1199 desaparece el índice lateral y aparece «Capítulos ▾»; por debajo de 768, una columna.
   - **Índice lateral *sticky*:** «← Índice de proyectos» (a `/#indice`), la lista de capítulos numerados y «Lectura · ‹n› min». El capítulo actual lleva `aria-current="location"` y fondo de marfil al 6 % (créalo como token), detectado con IntersectionObserver.
   - **Cabecera:** C4 (tipo) · fecha, h1 a 52/600/1,1/−2,5 % (30–32 en móvil) y la entradilla a 20/400/1,45.
   - **Columna de lectura** de unos 65 caracteres, cuerpo a 16/1,6–1,65, y **margen** de 260 para las notas. En móvil, las notas al margen se abren en línea.
   - **Cierre:** las tarjetas Anterior/Siguiente, en el orden de `ordenarProyectos()` (en el primero y en el último, solo una tarjeta), y el pie de artículo de F1.
2. **Plantilla según `tipo`:**
   - `ing` → A;
   - `inv` → B, cuya miga de pan es «Proyectos / Investigación»;
   - `hib` → A con los bloques de B que el MDX use y la etiqueta bicolor.

   La plantilla la elige `[slug].astro`; el contenido decide qué bloques aparecen.
3. **Componentes MDX** (`src/components/articulo/`), que el MDX importa o recibe por `components`:
   - **Comunes:**
     - `EnUnMinuto`: fondo de `--accent` al 8 % con Problema / Qué construí / Resultado;
     - `Ficha`: vertical en A (Rol, Tecnologías, Fecha y Recursos) y horizontal de 4 columnas en B (Autores, Afiliación, Publicado y Recursos); en móvil, una cuadrícula de 2 × 2;
     - `Capitulo`: un h2 numerado con el `id` que usa el índice lateral;
     - `Figura`: fondo `--surface`, radio 12 y leyenda numerada a 13 debajo; si los datos son sintéticos, la marca «Datos sintéticos» es obligatoria;
     - `NotaMargen`;
     - `TablaDecisiones`: tabla real (`<table>`) con Decisión / Elegida / Alternativa / Por qué;
     - `CodigoAnotado`: Geist Mono 13/1,75, con las marcas numeradas en el código y su explicación al margen;
     - `Referencias`: [n] con anclas de ida y vuelta.
   - **Solo de B:**
     - `Pregunta`: fondo de `--res` al 8 %, la pregunta a 26/500 y debajo H1 y H0;
     - `Formula`: la fórmula a 30 px con los términos en píldoras;
     - `Experimento`: ver el punto 6;
     - `Citar`: «Citar este trabajo · BibTeX», con el bloque BibTeX y un botón «Copiar» con el atributo `hidden`, porque F4 lo activa.
   - **Diagrama** (`Diagrama.astro`, versión estática): SVG con nodos C8 de **fondo sólido y por encima de las aristas**, aristas de 1 px en `--muted` al 40 % y un panel de 280 px con la ficha del nodo seleccionado por defecto (Responsabilidad, Entradas · salidas, Cumple y «Ver el código»).
     - **Modelo de datos** (lo reutilizarán F4 y F5):
       ```ts
       { nodos: { id, etiqueta, x, y, responsabilidad, entradas_salidas, cumple, codigo? }[],
         aristas: [origen, destino][], seleccionado?: id }
       ```
     - **Móvil:** la miniatura del diagrama y un botón «Explorar componentes» con el atributo `hidden`, porque la hoja del diagrama se activa en F4.
4. **Esquema de `proyectos`**, solo con campos opcionales:
   - `fecha?` (texto o placeholder);
   - `lectura_min?`;
   - `investigacion?`: `{ autores, afiliacion, publicado, bibtex? }`.

   **No toques** el esquema de `perfil`: lo modifica F2.
5. **Código y fórmulas en el build, sin JS en el cliente:**
   - **Shiki:** `shikiConfig` con el tema `css-variables`. Sus variables `--astro-code-*` se definen en `tokens.css` a partir de **roles nuevos** `--code-*`, con valor en Cosmos y en Dawn tomado de la Maqueta 2. Todos se añaden al test de contraste: AA sobre `--surface` en los dos temas.
   - **KaTeX:** `remark-math` + `rehype-katex`, con el CSS y las fuentes de KaTeX **servidos desde el propio origen**, sin CDN.
6. **Experimento, versión estática:**
   - el panel de controles de 260 px a la izquierda: un control deslizante (44 px de alto en móvil), «Comparar: Modelo A · A y B» y «Restablecer»;
   - todos los controles van `disabled` en esta fase, con el texto i18n «Interactivo próximamente» visualmente oculto;
   - a la derecha, el histograma SVG generado en el build con un generador de **semilla fija** y los valores por defecto de la maqueta (0,7 y A y B), con la leyenda «Datos sintéticos».
7. **Selector de tema (C11):**
   - **en escritorio y tablet**, el segmentado Cosmos · Dawn en el hueco `--theme-slot` de la barra;
   - **en móvil**, dentro de la hoja «Aa» (Cosmos · Dawn · Sistema);
   - guarda en `localStorage['tema']` los mismos valores que ya lee el script de F0;
   - el cambio aplica un fundido de `--dur` en `background-color` y `color`, **sin transición en la carga inicial**;
   - con reduced motion, corte directo.
8. **Progreso de lectura:** 2 px en `--accent` en el borde inferior de la barra, en el hueco reservado. Es `aria-hidden` y se calcula sobre el artículo, no sobre la página.
9. **Barra de artículo en móvil** (< 768):
   - «← Proyectos» (a `/#indice`), «Capítulos n/N ▾» y «Aa», todo con objetivos de 44 px como mínimo;
   - «Capítulos ▾» abre la lista de capítulos (un *disclosure* accesible) y se cierra con Esc o al elegir uno;
   - en tablet, «Capítulos ▾» sustituye al índice lateral.
10. **`HojaInferior.astro`**, un componente genérico que reutilizará F4:
    - radio 20 y asa de 40 × 4;
    - `role="dialog"`, `aria-modal`, trampa de foco, se cierra con Esc y devuelve el foco, y deja el fondo `inert`;
    - sube con `translateY` en `--dur`;
    - con reduced motion, aparece sin animación.

    **Hoja «Aa»:** «Opciones de lectura», con Tema (Cosmos · Dawn · Sistema) y «Reducir movimiento».
    - «Reducir movimiento» pone `data-movimiento="reducido"` en `<html>`, que deja **todas las duraciones de los tokens a 0**, igual que la preferencia del sistema;
    - se guarda en `localStorage['movimiento']` y se aplica antes de pintar, en el mismo script en línea del tema;
    - la maqueta muestra un apartado «Figuras». Si no está claro qué controla, **no lo inventes**: déjalo fuera y pregúntalo en el informe.
11. **Página de nota** (`src/pages/notas/[slug].astro` + `NotaLayout.astro`):
    - solo la columna de lectura y el margen, sin índice lateral;
    - `tema="elegible"`, con la misma barra de artículo;
    - la miga de pan es «Notas»;
    - pruébala con una nota temporal **solo durante la verificación** y no hagas commit de ella. La colección sigue vacía.
12. **Contenido semilla.** Reescribe el cuerpo MDX de tres proyectos con la estructura y los textos placeholder **exactos** de la Maqueta 2:
    - `coordinacion-multiagente` (ing): los 10 capítulos de A, con el diagrama de 7 nodos (Usuario, Orquestador, Agente A, B y C, Memoria y Herramientas, con las aristas de la maqueta), el código de la maqueta (marcado como «fragmento ilustrativo») y la figura de evaluación «de forma, no datos»;
    - `proyecto-02` (inv): los 10 capítulos de B, con la fórmula p(y | x) = softmax(W·h + b), el experimento, los resultados en pequeños múltiplos de 3 columnas y las referencias;
    - `proyecto-03` (hib): A con «Pregunta» y «Referencias» de B.

    Todo sigue marcado `borrador: true`. **No inventes contenido:** donde la maqueta tenga `‹…›`, va `‹…›`.
13. **i18n:** todas las claves nuevas, con el prefijo `articulo.`, **al final** de `es.json` y `en.json`.
14. **Tests:**
    - **unitarios:** el generador de datos sintéticos es determinista, el contraste de los `--code-*` en los dos temas, y el orden de Anterior/Siguiente;
    - **e2e**, en los tres tamaños:
      - axe sin violaciones en los artículos A, B e híbrido, **en Cosmos y en Dawn**;
      - el tema elegido persiste al navegar de un artículo a otro, sin parpadeo: el `data-theme` correcto en `DOMContentLoaded`;
      - la portada sigue en Cosmos aunque el tema guardado sea Dawn;
      - con «Reducir movimiento» de la hoja activado, `--dur` vale 0;
      - el índice lateral marca el capítulo correcto al hacer scroll;
      - «Capítulos ▾» y la hoja «Aa» atrapan el foco y se cierran con Esc;
      - la miga de pan cambia según el tipo;
      - a 360 px no hay scroll horizontal (los bloques de código hacen scroll dentro de su contenedor, no en la página).
15. **Capturas** en `docs/encargos/capturas/F3/`:
    - A en Cosmos y B en Dawn, a 1280, 834 y 390 px, junto a la Maqueta 2;
    - la hoja «Aa» y «Capítulos ▾» en móvil;
    - **las dos decisiones pendientes de Jorge:**
      - **D1:** la etiqueta Ingeniería en Dawn junto a un botón primario, en dos versiones: la actual (`--eng` #7A5824) y la propuesta (#7A6448). Usa un CSS temporal solo para la captura y **no cambies el token**;
      - **D4:** capturas en Dawn de un nodo en hover (`--surface-hover`) y seleccionado (`--selected`) y de una etiqueta `‹pendiente›`.

## No incluye
- Seleccionar nodos del diagrama y su hoja inferior en móvil, resaltar los términos de la fórmula, los controles del experimento, «Copiar» del BibTeX y las View Transitions (F4).
- Las secciones de la portada (F2), que van en paralelo.
- El selector de idioma (F7).

## Coordinación con F2, que va en paralelo
Hay otro Codex trabajando en F2 en otra rama. Para que las dos ramas se fusionen sin conflictos:

- **i18n:** las claves nuevas van **al final** de `es.json` y `en.json`, con el prefijo `articulo.`. No reordenes las existentes.
- **Tokens:** los nuevos van **al final** de cada bloque de `tokens.css`, en ambas copias, bajo `/* F3 · artículos */`.
- **No modifiques** `src/pages/index.astro`, los componentes de portada que cree F2, `src/content/validacion.ts` ni el esquema de `perfil`.
- **Sí puedes modificar** `BaseLayout.astro` (el script en línea para `data-movimiento`), `BarraGlobal.astro` (los huecos del estado `articulo` y la variante móvil) y `[slug].astro`.

## Trampas conocidas
- **El script del tema ya existe** en `BaseLayout`, en línea en el `<head>`. Amplíalo; no crees otro script que llegue tarde.
- **La transición de color no puede activarse al cargar.** Si no, cada página en Dawn «se funde» desde Cosmos. Aplica la clase de transición solo después de un cambio del usuario.
- **Fuentes de KaTeX:** asegúrate de que los `@font-face` apunten a tu propio origen. `grep` en `dist/` no debe encontrar CDNs.
- **Las tablas anchas y el código** hacen scroll dentro de su contenedor, con `tabindex="0"` y `role="region"` + `aria-label`, para que se puedan recorrer con teclado.
- **Nodos del diagrama:** fondo sólido y siempre encima de las aristas (es el bug 1 de `BUGS_CONOCIDOS.md`; no lo repitas).
- **Ningún valor suelto en el CSS**, incluidos los colores de las píldoras de la fórmula y del histograma: van como roles nuevos, con su contraste comprobado.

## Criterios de aceptación
- [ ] `npm ci && npm run check && npm test && npm run build && npm run e2e` termina sin errores ni advertencias.
- [ ] axe no encuentra violaciones en los artículos A, B e híbrido, en Cosmos y en Dawn, en los tres tamaños.
- [ ] El tema persiste entre artículos sin un solo fotograma del tema equivocado, la portada sigue en Cosmos y «Sistema» sigue `prefers-color-scheme`.
- [ ] «Reducir movimiento» de la hoja equivale a la preferencia del sistema, persiste y se aplica antes de pintar.
- [ ] El resaltado de código y KaTeX se generan en el build: no hay JS de Shiki ni de KaTeX en el cliente y no hay CDNs en `dist/`.
- [ ] Los `--code-*` y los colores nuevos pasan AA en los dos temas.
- [ ] A 390 y 360 px no hay scroll horizontal de página y los objetivos táctiles miden ≥ 44 px.
- [ ] Las capturas de A (Cosmos) y B (Dawn) están junto a la maqueta, y las de D1 y D4 están en `capturas/F3/`.
- [ ] La página de nota se probó con una nota temporal, que no se sube.

## Si te bloqueas
Si una fuente se contradice, falta un dato o algo exige rediseñar, **no lo decidas tú**. Implementa lo que no dependa de eso y deja la pregunta en el informe.

## Informe de entrega
Añádelo al final de este archivo, en la sección «Informe»:
1. **Hecho:** la lista de entregables, con sus rutas.
2. **Verificación:** los comandos ejecutados con su resultado real, los e2e por proyecto y las capturas.
3. **Desviaciones:** qué difiere del encargo o de la maqueta, y por qué. Incluye los tokens y las claves i18n nuevas.
4. **Preguntas abiertas**, incluida «Figuras» si sigue sin estar clara.
5. **No verificado:** lo que no pudiste comprobar.

---

## Informe
‹Lo escribe Codex.›

## Revisión
‹Lo escribe Claude.›
