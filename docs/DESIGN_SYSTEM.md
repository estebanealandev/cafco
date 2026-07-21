# CAFCO Design System

Sistema visual premium propio. Inspirado en **principios** de refinamiento editorial (espacio, jerarquía, calma), no en implementaciones de terceros.

## Principios aplicados (referencia → CAFCO)

| Principio | Interpretación CAFCO |
|---|---|
| Espacio en blanco generoso | `--section-y` fluido; ritmo vertical consistente entre secciones |
| Jerarquía editorial | Newsreader (display) + Source Sans 3 (UI); tracking cerrado en títulos |
| Densidad calmada | Hairlines estructurales, sin cards “flotantes” innecesarias |
| Imagen protagonista | Full-bleed hero; media `4/5` con zoom sutil; sin overlays decorativos |
| Controles táctiles | Botones con estados claros, `min-height` 40–56px, focus visible |
| Lujo discreto | Acento madera/café (`#7a5636`), espresso chrome, sombras mínimas |
| Menos es más | Microinteracciones solo en hover/focus/reveal; `prefers-reduced-motion` |

## Tokens (`src/app/globals.css`)

- **Color:** surfaces, text, accent, espresso chrome, WA, error/success, borders
- **Espaciado:** `--space-2xs` … `--space-6xl` + `--section-y` / `--container-pad`
- **Layout:** `--max-width`, prose/quote widths, `--grid-gap`, nav/hero chrome
- **Radii:** `--radius-xs` … `--radius-full` (preferencia: 2px, geometría afilada)
- **Sombras / elevación:** `--shadow-xs` … `--shadow-lg`, nav, WA, focus
- **Motion:** easings + `--duration-fast|duration|slow|reveal`
- **Z-index:** base → sticky → overlay → float → toast
- **Controles:** `--control-height(-sm|-lg)`, `--touch-target`

## Componentes

### Botones
`.btn` + variantes: `primary`, `secondary`, `outline`, `ghost`, `text`, `cta`, `wa`, `icon`, `inverse`  
Tamaños: `sm`, `lg` · Estados: hover, active, focus-visible, disabled, `.is-loading`

### Cards
- Producto: `.product-card` (editorial split)
- Material: `.material-card` (dark info)
- Primitiva: `.card` / `.card-media`

### Formularios
`.field`, `.field-label`, `.field-helper`, `.field-error`, `.input`, `.textarea`, `.select`, `.checkbox`, `.radio`, `.switch`  
Newsletter usa `.input` + `.btn.btn-primary`

### Chrome
Navbar sticky con glass espresso, menú hamburguesa solo ≤1024px, footer con superficie clara y hairlines.

## Archivos

- `src/app/globals.css` — design system completo
- `src/app/[locale]/page.tsx` — markup (clases de botón/form/nav)
- `docs/TYPOGRAPHY.md` — tipografía
- `docs/DESIGN_SYSTEM.md` — este documento
