# Design

## Design Read

Image-led local cafe brand site for tourists and regulars, using a full-bleed exterior hero, restrained pub-site navigation, dark bottom information strip, serif display type, and practical menu/location sections.

## Color

The palette references coastal stone, black shop signage, coffee crema, and muted sea-blue instead of a default beige cafe theme.

- `--salt`: near-white page surface.
- `--nav`: warm off-white navigation surface.
- `--ink`: charcoal black text and overlays.
- `--ink-soft`: softened body text.
- `--coffee`: dark roasted brown for footer and hero scrim.
- `--crema`: warm amber accent for small labels and active states.
- `--sea`: muted blue-green for secondary panels and link focus.
- `--line`: low-contrast stone border.

Use cream only as a navigation/surface support color, never as the whole identity. Hero overlays and footer should keep the reference style grounded.

## Typography

- Display: Georgia / Times fallback for large, heritage-leaning headlines.
- Body: system sans-serif for clean practical information.
- Nav and metadata: uppercase sans with normal letter spacing.
- Display headings use balanced line breaks and stay under four lines on mobile.

## Layout

- Fixed top navigation, cream strip, single-line desktop nav.
- Full-bleed hero with copy over the left side of the exterior photo and a bottom data strip.
- Sections alternate structure: image/story split, dark menu board, supplier ledger, map/location split, FAQ rows.
- Cards are reserved for menu items and visit facts only.

## Imagery

- Hero uses the 2025 exterior photo from St Ives By The Sea because the request prioritizes recent shopfront imagery.
- Old official seascape image is used as a supporting visual texture, not the primary shop proof.
- Official cup logo and find-us map are used in navigation/location contexts.

## Motion

Subtle entrance motion via GSAP when available: nav settle, hero image slow scale, content reveals. All content remains visible without JavaScript and respects `prefers-reduced-motion`.

## Components

- Header: brand lockup with cup mark, primary anchors, and social update CTA.
- Hero: exterior image, concise headline, two CTAs, bottom quick-info strip.
- Menu board: category tabs driven by buttons and a no-JS fallback list.
- Supplier ledger: compact named supplier line and local sourcing notes.
- Visit section: exterior proof, map image, Google Maps link, coordinates, and hours.
- FAQ: accessible disclosure rows using native `<details>`.
