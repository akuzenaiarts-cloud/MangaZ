

## Plan: Use LatestCard Style on the Latest Page

The Latest page (`src/pages/Latest.tsx`) currently uses `MangaCard` (vertical poster-style cards). The homepage's Latest Updates section uses `LatestCard` (horizontal cards with cover thumbnail, title, and chapter list with premium/free indicators). The goal is to make the Latest page use the same horizontal card style.

### Changes:

**1. Extract `LatestCard` into a shared component** (`src/components/LatestCard.tsx`)
- Move the `LatestCard` function from `LatestUpdates.tsx` into its own file so both pages can use it.
- Export it as the default export.

**2. Update `src/components/LatestUpdates.tsx`**
- Remove the inline `LatestCard` function.
- Import `LatestCard` from `@/components/LatestCard`.

**3. Update `src/pages/Latest.tsx`**
- Replace `MangaCard` with `LatestCard`.
- Change the grid from 6-column poster grid to `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3` to match the homepage layout.
- Also add the filter tabs (All Series / Manga / Manhwa / Manhua) from the homepage section for consistency, using the same `FILTER_TABS` pattern with state management.

