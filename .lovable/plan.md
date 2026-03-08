

# Redesign Editor's Choice as a Card Carousel

The current Editor's Choice uses a split layout (text left, cover right). The reference shows it should be a **card-based carousel** matching the hero carousel style — full cover images with title, status pill badge, and description overlaid at the bottom.

## Changes

### `src/components/EditorChoice.tsx` — Full rewrite

Replace the split layout with an Embla-based carousel:

- **Carousel**: Use `embla-carousel-react` with `loop: true`, `align: 'center'`, drag/swipe support
- **Slide sizing**: `flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_33.333%]` (same as hero)
- **Card design** (per slide):
  - Full cover image with rounded corners, tall aspect (`h-[450px] md:h-[500px]`)
  - TypeBadge top-left
  - Bottom gradient overlay (`from-black/90`)
  - Title (large, bold, truncated)
  - Status as a **pill badge** (rounded-full, colored background matching status) — e.g. green pill with "ONGOING" text, similar to reference
  - Description (2-line clamp, muted text)
- **Edge fading overlays** on left/right (gradient from background to transparent)
- **Navigation arrows** (circular, positioned at edges)
- **Autoplay** with pause on hover
- Keep the "Editor's Choice" heading with Award icon above

### `src/pages/Index.tsx` — Make Editor's Choice full-width

Wrap the `<EditorChoice />` component outside the `container` div (or with negative margins) so the carousel spans edge-to-edge, matching the hero carousel treatment.

## Files to Edit
1. `src/components/EditorChoice.tsx`
2. `src/pages/Index.tsx`

