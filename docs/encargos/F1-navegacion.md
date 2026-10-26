# F1 · Navegación global

**Estado:** encargada
**Rama:** `f1-navegacion` · **Depende de:** F0 (en `main`) · **Escrito por:** Claude · **Fecha:** 2026-10-25

> Cómo lanzarlo en Codex: *«Lee AGENTS.md y docs/encargos/F1-navegacion.md. Implementa solo ese encargo y termina con el informe que pide.»*

## Objetivo
Al terminar se puede recorrer el sitio entero con la navegación definitiva:

- la barra global en sus estados de portada y de artículo;
- el menú móvil a pantalla completa;
- el pie de página;
- las anclas, con su desfase y la gestión del foco;
- la detección de la sección activa.

La portada tiene el esqueleto de sus 7 secciones, con el encabezado C1 y alturas reservadas, para que la navegación se pueda probar de verdad. Queda montada la infraestructura de tests e2e con Playwright y axe, que usarán todas las fases siguientes.

## Leer antes
- `AGENTS.md`, completo. Atención a § Forma de trabajar: qué hacer si el sandbox bloquea `.git`.
- `design/docs/INTERACCIONES.md` § Navegación, § Estados de la barra global y § Reduced motion (global).
- `design/docs/PAGINAS.md` § Rutas, § Portada (la tabla de alturas), § Navegación global y § 07 Contacto (solo la frase del pie).
- `design/docs/COMPONENTES.md` C1, C2, C3 y la fila «Barra global».
- `design/docs/TOKENS.md` § Tipografía, § Espaciado y § Retícula y puntos de corte.
- `design/docs/DECISIONES.md` § Notas y § Resueltas en la consolidación (la fila «Barras dentro del relato»).
- Referencias, servidas con `python3 -m http.server` desde `design/referencias/`:
  - `maqueta-3-sistema.html` § N: estados 1, 3 y 4 de la barra y el menú móvil abierto;
  - `maqueta-1-portada.html`: la barra sobre el hero y el pie, a 1280, 834 y 390 px;
  - `maqueta-2-articulos.html`: la barra y el pie del artículo, en escritorio.

## Incluye
1. **Configuración de secciones** (`src/config/secciones.ts`): una lista ordenada de la portada.

   | Número | Sección | Ancla |
   |---|---|---|
   | 01 | Hero | ninguna |
   | 02 | Proyectos | `#proyectos` |
   | 03 | Índice | `#indice` |
   | 04 | Sobre mí | `#sobre-mi` |
   | 05 | Tecnologías | `#tecnologias` |
   | 06 | Notas | `#notas`, solo si hay notas |
   | 07 | Contacto | `#contacto` |

   - Cada entrada lleva su clave i18n.
   - Una función devuelve las secciones visibles con **su número recalculado**: sin notas, Contacto es 06.
   - La barra, el menú y C1 usan esta única fuente.
2. **`EncabezadoSeccion.astro` (C1):**
   - el kicker con el número en `--accent` y el nombre en `--muted`, a 13 px con 12 px de separación;
   - 14 px por debajo, el h2 a 40/600/1,15/−2 % (28–30 en móvil);
   - el h2 lleva `id` y `tabindex="-1"` para poder recibir el foco desde un ancla.
3. **Esqueleto de la portada** (`src/pages/index.astro`). Sustituye la página temporal de F0.
   - Cada sección es un `<section>` con su ancla y `aria-labelledby` apuntando a su h2.
   - La altura mínima de cada sección es la de `PAGINAS.md` § Portada: hero de 100 svh, 02 de 4 × 100 svh por relato × 3, 03 ~900, 04 ~850, 05 ~800, 06 ~450 y 07 880.
   - El ritmo entre secciones es el de `TOKENS.md` § Espaciado.
   - El contenido de cada sección es solo C1 más un bloque vacío marcado para F2, F5 o F6.
   - El hero lleva un h1 visualmente oculto con el nombre de `perfil`. La sección 02 no tiene encabezado C1, porque su papel lo hará la cabecera del relato en F5: lleva un h2 visualmente oculto con `id`.
4. **`BarraGlobal.astro`**, con `data-estado`. Va fuera de `<main>`, en el `<header>` del layout.
   - **Estado `hero`** (portada, mientras el hero está a la vista):
     - sin fondo, con padding de 28 / 64;
     - texto a 14: JORGE (enlace a `/`) · Proyectos · Notas (solo si hay notas) · Sobre mí · Contacto · CV;
     - CV es un enlace en `--accent` al `cv.url` del perfil.
   - **Estado `relato`:** solo preparado. Se aplica con `data-estado="relato"` y oculta la barra (`transform` + `inert`). F5 lo activará; en F1 no se activa nunca.
   - **Estado `fija`** (portada desde 03 hasta 07):
     - mide 56 px (`--nav-h`), es *sticky* o fija arriba, con fondo `--bg` al 94 % (por ejemplo, `color-mix` sobre el token) y un filete `--line` abajo;
     - **se oculta al bajar y reaparece al subir**, con `translateY` en `--dur` y `--ease-inout`;
     - la sección activa va en `--heading` con un subrayado de oro de 2 px y `aria-current="location"`.
   - **Estado `articulo`** (`/proyectos/<slug>`):
     - igual que `fija`, siempre visible, más la miga de pan «Proyectos / Ingeniería | Investigación | Híbrido» según `tipo`;
     - «Proyectos» lleva a `/#indice`;
     - deja **huecos vacíos y con nombre** para el selector de tema y la barra de progreso de 2 px, que llegan en F3. No los implementes.
   - **Móvil** (< 768, y en tablet si la Maqueta 1 lo muestra así): JORGE y un botón «Menú» de 44 × 44 px como mínimo, con `aria-expanded` y `aria-controls`. Si la maqueta móvil no muestra cómo es el botón, usa el texto «Menú» a 14 px y anótalo en el informe.
   - Los enlaces de sección apuntan a `/#ancla` desde cualquier página y a `#ancla` dentro de la portada.
5. **Comportamiento de la barra** (`<script>` TS vanilla, en un módulo pequeño):
   - el estado `hero` → `fija` cambia cuando el final del hero sale del viewport (IntersectionObserver), no con cálculos de scroll en cada fotograma;
   - la sección activa se detecta con IntersectionObserver;
   - **ocultar al bajar** solo se dispara con un desplazamiento hacia abajo de más de 8 px y **nunca** al saltar a un ancla, al recibir foco por teclado ni durante el scroll suave de un ancla; mientras algo de la barra tiene el foco, sigue visible;
   - **reduced motion:** sin transición, y la barra se oculta y reaparece por corte.
6. **Anclas:**
   - `scroll-padding-top: 72px` en `html`;
   - scroll suave solo con `prefers-reduced-motion: no-preference`;
   - al activar un ancla de la barra o del menú: la URL se actualiza (`#indice`) y **el foco pasa al h2 de la sección**, una vez terminado el scroll;
   - si la carga llega con un hash, la sección queda alineada y la barra no la tapa.
7. **`MenuMovil.astro`**, a pantalla completa sobre `--bg`:
   - cabecera con JORGE y «Cerrar ✕»;
   - lista numerada con las secciones visibles de `secciones.ts` (02 Proyectos … 07 Contacto) a 24/600, y la sección actual en `--accent` con el texto «estás aquí»;
   - al pie: «Descargar CV · PDF ↓» como botón primario (C2), GitHub ↗, LinkedIn ↗ y Correo, todo desde `perfil`;
   - **comportamiento:** bloquea el scroll del fondo, atrapa el foco, deja el resto de la página `inert` y se cierra con ✕, con Esc o al elegir una sección (que entonces navega con la regla 6). Al cerrarse, el foco vuelve al botón «Menú»;
   - entra con opacidad y `translateY` de 16 px en `--dur`; con reduced motion, aparece sin animación.
8. **`PiePagina.astro`**, a 13 px y en `--muted`. Copia los textos de las maquetas.
   - **Portada:** «© ‹año› Jorge Quenta» a la izquierda y «Volver arriba ↑» a la derecha, que enfoca el «Saltar al contenido» o el inicio. **Sin el control «Tema»:** ver «Decisión aplicada».
   - **Artículo:** «© ‹año› Jorge Quenta» y las filas Correo · GitHub ↗ · LinkedIn ↗ · CV ↓, como en la Maqueta 2.
   - El año sale de `perfil` o se deja como placeholder. **No uses el año actual del sistema**, porque es un dato que Jorge debe confirmar.
9. **Componentes base `Boton.astro` (C2) y `Enlace.astro` (C3)**, con las variantes de `COMPONENTES.md` y sus estados (hover, foco, pulsar a escala 0,98 y nada con reduced motion). Los usan el menú y el pie; F2 los reutilizará.
   - Enlace externo: `target="_blank"`, `rel="noopener"`, ↗ y un texto oculto «(se abre en una pestaña nueva)» desde i18n.
10. **Layout:**
    - `BaseLayout` acepta un `<header>` con la barra y un `<footer>` con el pie, fuera de `<main>`;
    - «Saltar al contenido» sigue siendo el **primer** elemento enfocable;
    - `src/pages/proyectos/[slug].astro` usa la barra en estado `articulo` y el pie de artículo.
11. **i18n:** todos los textos nuevos van en `es.json` y `en.json`, con las mismas claves. Los nombres de las secciones, «Menú», «Cerrar», «estás aquí», «Volver arriba» y los textos ocultos se pueden traducir al inglés; los datos de `perfil`, no.
12. **Tests e2e** (Playwright + `@axe-core/playwright`):
    - **Navegadores dentro del repo:** `PLAYWRIGHT_BROWSERS_PATH=.cache/ms-playwright`, ignorado por git, para que el sandbox pueda instalarlos. Añade el script `npm run e2e:instalar`.
    - **Servidor:** `astro preview` se queda en segundo plano en Astro 7 (ver la revisión de F0) y el `webServer` de Playwright necesita un proceso en primer plano. Usa un servidor estático en primer plano sobre `dist/`: una devDependency ligera o un script Node propio en `scripts/`.
    - Script `npm run e2e` y un trabajo `e2e` en la CI que instale Chromium y lo ejecute tras el build.
    - **Proyectos de Playwright:** escritorio (1280 × 800), tablet (834 × 1112) y móvil (390 × 844).
    - **Pruebas mínimas:**
      - axe sin violaciones en `/` y en un artículo, en los tres tamaños;
      - el primer Tab es «Saltar al contenido»;
      - el ancla `#indice` desde la barra deja el h2 de 03 enfocado, visible y no tapado por la barra (su `top` ≥ 56);
      - el estado `hero` pasa a `fija` al bajar, se oculta al seguir bajando, reaparece al subir y la sección activa lleva `aria-current`;
      - **el menú móvil:** se abre, el foco queda atrapado (Tab y Shift+Tab ciclan dentro), Esc lo cierra y devuelve el foco, y elegir una sección navega y lo cierra;
      - sin notas, el menú y C1 muestran Contacto como 06;
      - con `reducedMotion: 'reduce'`, el menú aparece sin transición (duración computada 0);
      - a 360 px no hay scroll horizontal (`scrollWidth <= clientWidth`).
13. **Capturas** en `docs/encargos/capturas/F1/`:
    - la barra en los estados `hero`, `fija` y `articulo`, y el menú abierto;
    - a 1280, 834 y 390 px;
    - cada una junto a la sección equivalente de la maqueta (dos imágenes o una compuesta).

## No incluye
- El contenido de las secciones 03–07 (F2) y los componentes C4–C12 (F2–F4).
- El hero y el relato: solo hay bloques reservados. Activar el estado `relato` (F5).
- El selector de tema, la barra de progreso de lectura, «Capítulos ▾» y la hoja «Aa» (F3). Solo se dejan sus huecos.
- El selector de idioma (F7).
- View Transitions entre páginas (F4).

## Decisión aplicada
**D10:** el pie de la portada se queda **sin el control «Tema»**, porque la portada siempre es Cosmos (regla 4 de `AGENTS.md`). Lo propone Claude y falta la confirmación final de Jorge. Si decide lo contrario, se añade en F3 junto al selector de tema.

## Trampas conocidas
- **El scroll suave y el «ocultar al bajar» se pisan.** Ignora los eventos de scroll mientras dura un scroll provocado por un ancla.
- **`scroll-padding-top` no basta para el foco.** Usa `focus({ preventScroll: true })` cuando el scroll ya terminó.
- **`inert`** en el resto de la página cuando el menú está abierto: no puede quedar `inert` el propio menú.
- **El bloqueo de scroll en iOS:** `overflow: hidden` en `body` no siempre basta. Usa el patrón de fijar `body` con `top: -scrollY` y restaurar la posición al cerrar.
- **IntersectionObserver para la sección activa:** usa un `rootMargin` que tenga en cuenta los 56 px de la barra, para que la activa sea la que está bajo la barra y no la anterior.
- **No inventes enlaces:** los de `perfil` son placeholders (`‹usuario›`). Se renderizan tal cual, sin `href` roto: el enlace va a `#` con `aria-disabled="true"` mientras el valor sea un placeholder. Escribe un helper `esPlaceholder()` y úsalo de forma uniforme.
- **Ningún valor suelto en el CSS.** Si necesitas un valor que no está en los tokens (por ejemplo el 94 % del fondo), créalo como token en `tokens.css` **y** en `design/docs/tokens.css`, y menciónalo en el informe.

## Criterios de aceptación
- [ ] `npm ci && npm run check && npm test && npm run build && npm run e2e` termina sin errores ni advertencias.
- [ ] Todas las pruebas e2e del punto 12 existen y pasan en los tres tamaños.
- [ ] axe no encuentra violaciones en `/` ni en `/proyectos/<slug>`.
- [ ] La CI incluye el trabajo `e2e`.
- [ ] Sin notas, el menú, la barra y C1 no muestran Notas y numeran Contacto como 06. Hay un test que lo comprueba.
- [ ] Todos los textos nuevos están en `es.json` y `en.json`, y pasa la paridad.
- [ ] Con `prefers-reduced-motion: reduce`: no hay scroll suave, el menú aparece sin animación y la barra se oculta y aparece por corte.
- [ ] A 390 y 360 px no hay scroll horizontal y el botón «Menú», «Cerrar» y los enlaces del menú miden ≥ 44 px de alto.
- [ ] Las capturas de 1280, 834 y 390 px están en `docs/encargos/capturas/F1/`, junto a su maqueta.
- [ ] `npm run contenido:pendientes` no cuenta textos de interfaz como placeholders.

## Si te bloqueas
Si una fuente se contradice, falta un dato o algo exige rediseñar, **no lo decidas tú**. Implementa lo que no dependa de eso y deja la pregunta en el informe.

## Informe de entrega
Añádelo al final de este archivo, en la sección «Informe»:
1. **Hecho:** la lista de entregables, con sus rutas.
2. **Verificación:** los comandos ejecutados con su resultado real, el resumen de los e2e por proyecto y las capturas.
3. **Desviaciones:** qué difiere del encargo o de la maqueta, y por qué. Incluye los tokens nuevos.
4. **Preguntas abiertas.**
5. **No verificado:** lo que no pudiste comprobar.

---

## Informe
‹Lo escribe Codex.›

## Revisión
‹Lo escribe Claude.›
