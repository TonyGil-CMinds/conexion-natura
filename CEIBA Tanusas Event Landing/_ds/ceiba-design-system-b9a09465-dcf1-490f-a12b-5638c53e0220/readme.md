# CEIBA — Design System

Brand and product design system for **CEIBA**, an Ecuadorian innovation-and-investment
platform for biodiversity and the "economías de la naturaleza". The material in this
project covers the **CEIBA QUITO / Conexión 500** edition — *"Noche de Innovación e
Inversión para la Biodiversidad y las Economías del Futuro"*, 05 October 2026, Jardín
Botánico de Quito — plus the sibling lockups **CEIBA TANUSAS** and **PREMIO 2026**, and
the **NATURA 500** sub-brand.

Everything here was extracted from the sources listed below. Values are transcribed
verbatim — unrounded sizes (20.727272px, 37.83159px, 87.08px), odd spacing steps
(19.6234px, 38.1566px) and off-grid colours are the design, not errors.

## Sources

| Source | What it gave us |
|---|---|
| `NEXO CEIBA.fig` (attached Figma file, mounted read-only) | Every screen, colour, type role and the one component set. Pages: `Just-ideas` (30 frames), `Coms` (28), `Registro-web` (75), `Avances-Xio---Visuales-y-Narrativa` (197), `Impresos` (54), `Only-Branding` (6). |
| `uploads/1–4.svg`, `uploads/Group 832–844.svg` | The finished lockups (CEIBA QUIT◆, CEIBA TANUSAS, PREMIO 2026) and four pixel pattern tiles. |
| `uploads/Cubao_Free_*.otf`, `uploads/Host_Grotesk/`, `uploads/IBM_Plex_Mono/` | Real font binaries, copied into `assets/fonts/`. |

No public Figma URL, GitHub repository or codebase was supplied. If you have file
access, the frame node ids referenced throughout this readme (e.g. `351:542`) address
the source frames directly.

## Products / surfaces

1. **Registro Web** — the event site: hero, agenda, speakers, FAQ, registration form,
   registered-attendee pass. 1280×832 desktop frames. → `ui_kits/registro_web/`
2. **Coms** — social campaign: 1080×1440 Instagram frames and 1920×1080 slides.
   → `ui_kits/coms/`, `slides/`
3. **Impresos** — printed pieces (badges, signage). Present in the source but not
   rebuilt here; the type and colour foundations cover it.

---

## CONTENT FUNDAMENTALS

**Language.** Spanish (Ecuador) first, with an `ES | EN` toggle in every header. English
appears only in institutional credit lines (`INITIATIVE LED BY`, `FUNDING PARTNERS`).
Accents and the inverted question mark are always typed: `¿Qué es Conexión 500?`,
`REGÍSTRATE`, `INNOVACIÓN`. The source even keeps a grave accent typo — `DÌAS PARA
CONEXIÓN500` — reproduce copy as written unless asked to fix it.

**Casing.** Uppercase is the default voice. Navigation, buttons, status lines, ledes and
section titles are all uppercase. Two deliberate exceptions:
- FAQ questions, which stay sentence case: *"¿Cuándo se realizará el evento?"*
- the Cubao Free display line, the only lowercase type in the system:
  *"acompáñanos en natura500 night"*

**Person.** Second person singular, informal — *tú*, never *usted*: `REGÍSTRATE`,
`ESCRIBE TU NOMBRE`, `CONOCE LA LISTA`, `AÑADIR A MI CALENDARIO`, `HOLA [NOMBRE]`.
First person appears only from the attendee's side (`MI AGENDA`, `MI CALENDARIO`).

**Register.** Institutional but energetic. Sentences are short and declarative;
headlines are claims, not questions: *"QUIENES DAN FORMA A LO QUE VIENE EN EL FUTURO"*,
*"ERES UNO DE LOS 100 INVITADOS"*. Scarcity is stated plainly and marked with a bare
asterisk that has no footnote: `CUPO LIMITADO*`, `QUEDAN: 5 LUGARES`.

**Honesty about gaps.** Unfinished sections say so rather than being filled with
placeholder text: `AGENDA EN CONSTRUCCIÓN`. Keep that convention.

**Numbers.** Written as digits and used as graphics — `500`, `100`, `2026`, the countdown
day set at 20.7px against its 10px neighbours. The sub-brand is styled `N5OO` in artwork
(the O-for-zero pixel diamond) and `Natura500` in prose.

**Emoji.** None. Not in the source, not in this system. Where a pictogram is needed the
system uses a pixel glyph (diamond, chevron, staircase) instead.

---

## VISUAL FOUNDATIONS

**The idea.** Field-notebook meets 8-bit terminal. Everything is orthogonal, measured and
monospaced; the only softness in the whole system is the Cubao Free display face and the
rounded QUITO wordmark.

**Colour.** Three green-blacks as grounds (`#151D17` on the web, `#001D09` on brand
artwork, black in print), cream (`#F7FFD2`) as the ink, and lime (`#D0FF00`) as the single
signal. Support families — greens, blues, amber/yellow, magenta, red — appear one at a
time as a section or artefact colour, never mixed together. Maximum two ground colours in
one deliverable (see `guidelines/colors-*`).

**Type.** Four voices. Departure Mono (pixel mono) for navigation, labels and huge display
lines; IBM Plex Mono for ledes, headlines and body; Host Grotesk Bold at 13px/0.17em for
meta and eyebrows; Cubao Free for poster display. Bytesized renders the NATURA/CONEXIÓN
bitmap wordmark. Every uppercase label carries `letter-spacing: 0.17em` — that tracking is
the single most recognisable typographic move in the brand. Leading is `100%` almost
everywhere; ledes get 1.29.

**Layout.** 1280×832 desktop frames, 89px gutters, an 1102px header well, 89px header
height with a 0.5px rule on its baseline. Four hairline vertical rules at x = 91, 263,
1029, 1201 (0.25px solid cream-25%, or 0.341px dashed lime-25%) mark the column edges —
they read as blueprint registration marks, not a grid overlay. Nav items sit 49px apart.
Content is absolutely positioned and asymmetric: a headline bottom-left, a photo
top-right, a stepped shape biting into a corner.

**Backgrounds.** Flat colour, full-bleed photography, or a single pixel pattern tile at
very low opacity (0.04–0.14). No noise, no blur except one soft lime ellipse in the social
posts, no aggressive gradients. Gradients exist but are structural and fixed: the CTA
green→lime at 90°, the mark grass→emerald at 238.824°, green→amber at 238.827°,
lime→sky at 238.838°, and the forest scrim at 179.317° that protects cream type over
photography.

**Shapes and corners.** Radius is zero — buttons, blocks, fields and cards are all square.
The two exceptions are the 82px slide frame and the circular pixel rings. The system's
signature silhouette is the **stepped quadrant**: a staircase-edged block that crops
photography and colour fields (`StepBlock`). Patterns are 8-bit staircases, diamonds,
lattices and zigzags, always single-colour.

**Cards and depth.** There are no cards in the conventional sense and no shadows at all.
Grouping is done with a 3%-opacity wash (`--surface-field`), a hairline, or a solid colour
block behind the type. Emphasis blocks are solid fills (yellow `#FECC0C` behind AGENDA,
leaf lime `#A2E136` behind FAQ). "Depth" is a 1px inset cream outline
(`--outline-button`) — never a border-radius-plus-shadow card.

**Transparency and blur.** Used sparingly and always functionally: cream at 25% for grid
rules, 20% white for header rules, 58%/50% cream for muted and placeholder text, 3%
grey for field washes, 4% for a pattern behind a dark hero. Blur appears once, on the
social-post lime ellipse.

**Imagery.** Warm, low-light event photography — candlelit greens and golds, people in a
botanical garden at night. Never black-and-white, never cool. Photos are either
full-bleed behind a scrim or clipped into the stepped quadrant. Never rounded.

**Motion.** The source is a static comp set, so this system defines the house defaults:
120ms for state changes, 200ms for disclosures, 420ms for entrances, `cubic-bezier(0.2,
0.8, 0.2, 1)`. Where a reveal should feel native to the pixel language, use
`steps(4, end)` instead of an ease. No bounces, no parallax.

**Hover / press.** Colour shifts only, never scale or shadow. Signal buttons go
`#D0FF00 → #AFD900` on hover; outline buttons take an 8% cream wash; gradient buttons get
`brightness(1.08)`. Nav links and active nav share one treatment: lime. Press is a 1px
downward nudge with no colour change. Focus should use the lime signal, never a browser
default ring.

---

## ICONOGRAPHY

The brand has **no general-purpose icon set** and no icon font. Its pictographic
vocabulary is three things, all of which ship in `assets/`:

1. **Pixel glyphs cut from the logotype language** — the stepped half-diamond mark
   (`CeibaLogo`), the pixel chevron used as the FAQ/scroll marker
   (`assets/icons/chevron-pixel.svg`), the 45°-rotated diagonal arrow used on submit and
   download actions (`assets/icons/arrow-diagonal.svg`), and the pixel rings
   (`assets/shapes/pixel-ring-a/b.svg`). All lifted from the file, none redrawn.
2. **One UI glyph** — the language globe beside `ES | EN`
   (`assets/icons/globe.svg`, 16.667px at 20px box).
3. **The Social Icons component set** — the file's only component family: 26 platforms ×
   `Negative` / `Original` = 52 variants, materialised into
   `components/social/icon-data.js` and rendered via `Icon` / `SocialRow`. Negative
   variants are monochrome and inherit `currentColor`; Original variants keep each
   platform's brand colour. The source only ever places the Negative set.

No emoji. No Unicode characters used as icons. No third-party icon library is linked, and
none should be added — if a new pictogram is genuinely needed, build it from the pixel
grid (whole-pixel steps, no curves, no strokes) rather than importing an outline set.

## Brand marks

**Primary lockup — always use these two files first:**

| File | Use on |
|---|---|
| `assets/logo/quito-on-dark.svg` | dark grounds (`#151D17`, `#001D09`) — cream wordmark, lime diamond |
| `assets/logo/quito-on-light.svg` | light grounds (`#F5FECF`, lime) — dark-ink wordmark, lime diamond |

These supersede every other mark in the system. Reach for a secondary lockup only
when the piece specifically calls for it: `ceiba-quito-lockup-{light,dark}.svg` (the
same lockup with the tagline set beneath it), `ceiba-tanusas-{light,dark}.svg`,
`premio-2026-{light,dark}.svg`. The `CeibaLogo`
component reproduces the pixel-diamond mark and sets **CEIBA** in Cubao Free beside it,
exactly as the site header does. There is no standalone corporate CEIBA logo file in the
sources; where one would go, use the QUITO lockup or the mark plus type.

---

## Index

| Path | What |
|---|---|
| `styles.css` | Global entry point — `@import` list only. Link this one file. |
| `tokens/fonts.css` | `@font-face` rules; Google Fonts import for Bytesized + Hanken Grotesk. |
| `tokens/colors.css` | Base palette, semantic aliases, the six fixed gradients. |
| `tokens/typography.css` | Families, the literal size scale, tracking, and type-role classes. |
| `tokens/spacing.css` | Spacing steps and frame/layout constants. |
| `tokens/effects.css` | Hairlines, radii, the inset outline, motion tokens. |
| `tokens/base.css` | Element defaults incl. link colours. |
| `assets/fonts/` | Cubao Free (3 widths), Host Grotesk (variable), IBM Plex Mono (5 weights). |
| `assets/logo/` | Event lockups, light and dark. |
| `assets/patterns/` | Four pixel pattern tiles. |
| `assets/shapes/`, `assets/icons/` | Stepped quadrants, pixel rings, marks, chevron, arrow, globe. |
| `assets/img/` | Event photography from the file. |
| `guidelines/*.card.html` | 21 foundation specimen cards (Colors, Type, Spacing, Brand). |
| `components/core/` | `CeibaLogo`, `Button`, `NavLink`, `SiteHeader`, `Field`, `SectionTitle`, `StatusLabel`, `DataRow`, `FaqRow`, `CountdownRuler`, `GridLines`, `StepBlock`, `PixelPattern`, `PartnerStrip` |
| `components/social/` | `Icon` (52 Social Icons variants), `SocialRow` |
| `ui_kits/registro_web/` | Six-screen click-through of the registration site. |
| `ui_kits/coms/` | Instagram post recreations. |
| `slides/` | Four sample 16:9 slides: title, section, photo, numbers. |
| `SKILL.md` | Agent-Skills entry point. |

## Components

`CeibaLogo` · `Button` · `NavLink` · `SiteHeader` · `Field` · `SectionTitle` ·
`StatusLabel` · `DataRow` · `FaqRow` · `CountdownRuler` · `GridLines` · `StepBlock` ·
`PixelPattern` · `PartnerStrip` · `Icon` · `SocialRow`

### Intentional additions

`NEXO CEIBA.fig` defines exactly **one** component set — Social Icons (52 variants) —
which is built here as `Icon`, with `SocialRow` as a thin convenience wrapper. Everything
else in `components/` is a primitive the source *draws repeatedly across its frames*
without having turned it into a Figma component. Each is a direct transcription of a real
frame element, not an invented primitive:

- `CeibaLogo` — header lockup, node 351:542
- `Button` — `normal` 351:540, hero CTA, the gradient submit in 351:1311, the ghost
  calendar CTA in 351:1447
- `NavLink` / `SiteHeader` — the header repeated on every screen
- `Field` — 826:32 / 351:1323 registration inputs
- `SectionTitle` — AGENDA on yellow (351:1246), FAQ on leaf lime (186:8)
- `StatusLabel` — 351:1328, `CUPO LIMITADO*`
- `DataRow` — 351:1465 attendee/event detail rows
- `FaqRow` — 186:8 dashed FAQ list
- `CountdownRuler` — hero countdown, 351:542
- `GridLines` — the vertical column rules on every screen
- `StepBlock` — the stepped quadrant, path from 351:852
- `PixelPattern` — the four supplied pattern tiles
- `PartnerStrip` — the credit block in 49:13

Nothing beyond this list should be added without a source reference.

## Substitutions and gaps

- **Departure Mono** is the brand's pixel-mono voice (245 text nodes) but no binary was
  supplied. `tokens/fonts.css` declares the `@font-face` and falls back to IBM Plex Mono,
  which matches the metrics and tracking but not the pixel silhouette. **Please upload
  `DepartureMono-Regular.woff2`.**
- **Bytesized** and **Hanken Grotesk** are pulled from Google Fonts (used for the bitmap
  wordmark and a few 32px headings). Swap to local files if you'd rather not hit a CDN.
- **Partner logos** (BID Lab, AFD, Natura and the others in the 49:13 footer) exist in the
  file only as flattened vector groups; `PartnerStrip` falls back to the partner name in
  type. Send the real SVGs and it will use them.
- The photographic **ID-card render** used in `Usuario registrado` and `Slide 16:9 - 1`
  could not be extracted from the file; the attendee pass in the UI kit is rebuilt in type
  and pattern instead.
- `Just-ideas`, `Avances-Xio---Visuales-y-Narrativa` and `Impresos` are exploration and
  print pages; their colours and type are folded into the tokens, but no screens were
  rebuilt from them.
