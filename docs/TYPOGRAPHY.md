# Sistema tipográfico CAFCO

Inspirado en los **principios** tipográficos de WatchHouse (serif editorial + sans ligera, tracking cerrado en títulos, CTAs en mayúsculas con tracking abierto, densidad calmada). No usa fuentes ni assets de WatchHouse.

## Fuentes

| Rol | Fuente | Licencia | Por qué |
|---|---|---|---|
| Display / headings | **Newsreader** | OFL (Google Fonts) | Alternativa open más cercana a *Tiempos Headline*: serif contemporánea de lectura editorial, optical sizing, excelente en es/en/de/fr |
| Body / UI | **Source Sans 3** | OFL (Google Fonts / Adobe) | Alternativa open más cercana a *Balto*: neo-grotesca limpia, peso light real (300), variable font, legibilidad superior y soporte Latin Ext |

Carga vía `next/font/google` (variable fonts, `display: swap`, subsets `latin` + `latin-ext`).

## Tokens

Definidos en `src/app/globals.css`:

- Familias: `--font-display-family`, `--font-body-family`
- Escala: `--text-caption` … `--text-5xl` + roles (`--text-display`, `--text-h1`…`--text-h6`, `--text-body`, `--text-button`, …)
- Leading: `--leading-display|heading|snug|body|relaxed`
- Tracking: `--tracking-display|heading|body|label|overline|cta`
- Pesos: `--font-weight-light|regular|medium|semibold`

## Utilidades de rol

`.type-display`, `.type-h1`…`.type-h3`, `.type-body-lg`, `.type-body`, `.type-small`, `.type-caption`, `.type-overline`, `.type-button`, `.type-nav`, `.type-quote`

Los componentes existentes usan estos tokens vía selectores semánticos (`.hero h1`, `.btn`, etc.).

## Principios aplicados (WatchHouse → CAFCO)

1. Serif para narrativa / display; sans ligera para UI y cuerpo  
2. Tracking negativo en títulos (`-0.02em`)  
3. Line-height compacto en headings (`~1.05–1.12`)  
4. Cuerpo light (300) con line-height ~1.55  
5. Labels/CTAs uppercase con tracking abierto  
6. Escala modular sin tamaños arbitrarios  
7. `font-synthesis: none` + antialiasing  

## Archivos clave

- `src/app/[locale]/layout.tsx` — carga de fuentes  
- `src/app/globals.css` — tokens + aplicación  
- `docs/TYPOGRAPHY.md` — este documento  
