# Portafolio

Portafolio público de proyectos de ingeniería e investigación, multilingüe con el español como base.

> **Estado:** especificación lista, sin código todavía. La implementación empieza con el encargo F0.

## Cómo está organizado
| Ruta | Qué es |
|---|---|
| `AGENTS.md` | Reglas para el agente que implementa (Codex) |
| `CLAUDE.md` | Rol de Claude: escribe los encargos, revisa y registra las decisiones |
| `docs/PLAN.md` | Fases F0–F8, su estado y las decisiones abiertas |
| `docs/encargos/` | Un encargo por fase (`PLANTILLA.md` + `Fn-*.md`) |
| `docs/ARQUITECTURA.md` | Stack, estructura, casuísticas y costos |
| `docs/DISENO.md` | Principios de diseño heredados de Kairos |
| `design/` | Handoff de diseño aprobado: especificación (`docs/`), referencias HTML, fuente del hero y recursos |

## Ciclo de trabajo
1. **Preparar la fase:** Jorge le pide a Claude preparar la fase N, y Claude escribe `docs/encargos/Fn-*.md`.
2. **Implementar:** Jorge lanza a Codex con *«Lee AGENTS.md y docs/encargos/Fn-*.md. Implementa solo ese encargo y termina con el informe que pide.»* Codex trabaja en la rama `fn-<tema>` y añade su informe al encargo.
3. **Revisar:** Claude revisa (comandos, diff y comparación con las referencias a 1280, 834 y 390 px) y escribe la revisión.
4. **Fusionar:** Jorge fusiona en `main`, o se prepara un encargo de corrección `Fn.1`.

## Desarrollo
> Lo completa F0.
