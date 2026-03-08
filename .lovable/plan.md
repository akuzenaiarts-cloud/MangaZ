

# Redesign Trending Section

## Changes

### 1. `src/pages/Index.tsx` — Trending section rewrite
- Remove "View All" link and ArrowRight import (if unused elsewhere)
- Remove TrendingUp icon from heading
- Make heading bigger/bolder: `text-2xl font-extrabold`
- Replace grid with a horizontal scroll container: `flex overflow-x-auto gap-4 scrollbar-hide pb-2` with `flex-shrink-0` cards at fixed widths (`w-[70vw] sm:w-[45vw] md:w-[30vw] lg:w-[calc(100%/6-14px)]`)
- Render trending cards inline (not using MangaCard) with the new layout:
  - Cover image with rounded corners, larger aspect ratio (~3/4.2 or similar)
  - TypeBadge top-left with uniform gray bg / white text / no border
  - No rank badge on cover, no gradient overlay, no rating/views on cover
  - Below the cover: rank number + title (single line, truncated) on one line, then genres below

### 2. `src/index.css` — Add scrollbar-hide utility
Add CSS to hide scrollbar for the horizontal slider:
```css
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
```

### 3. `src/components/TypeBadge.tsx` — Add variant prop
Add an optional `variant="uniform"` prop. When set, override styles to `bg-gray-600 text-white border-0` regardless of type. Default behavior unchanged for other usages.

### Files to Edit
- `src/pages/Index.tsx` — trending section markup
- `src/index.css` — scrollbar-hide class
- `src/components/TypeBadge.tsx` — uniform variant

