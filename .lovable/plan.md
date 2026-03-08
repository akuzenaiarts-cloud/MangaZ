

# Chapter Reader Page — Testing & Fix Plan

After reviewing the code, I identified several issues to fix:

## Issues Found

### 1. Double Header — Navbar + Reader Header
The global `Navbar` and `Footer` from `App.tsx` render on every page, including the Chapter Reader which has its own sticky header. This creates a redundant double-header. The Navbar already detects chapter pages (line 27) but still renders. The Footer is also unnecessary on the reader.

**Fix:** Hide the global Navbar and Footer when on the chapter reader route. Modify `App.tsx` to conditionally render them based on the current route.

### 2. No Mobile Zoom Controls
Zoom in/out buttons are hidden on mobile (`hidden sm:flex`). The floating options menu only has "Reset Zoom" but no way to zoom in or out on mobile.

**Fix:** Add "Zoom In" and "Zoom Out" options to the floating options menu so mobile users can control zoom.

### 3. Unnecessary `lg:flex` Wrapper
Line 133 has `<div className="lg:flex">` wrapping a single child — leftover from the removed sidebar layout.

**Fix:** Remove the unnecessary wrapper div.

### 4. Flickering View Counts in Chapter List Modal
`Math.floor(Math.random() * 900 + 100)` on line 89 of `ChapterListModal.tsx` generates new random values on every re-render, causing visual flickering.

**Fix:** Use a seeded/stable value based on chapter ID (e.g., `(chapter.id * 137) % 900 + 100`).

### 5. Reaction Buttons Missing Border on Unselected State
Selected reactions have `border border-primary/50` but unselected ones have no `border` class, causing a layout shift when toggling.

**Fix:** Add `border border-transparent` to the unselected state.

## Files to Edit

- **`src/App.tsx`** — Conditionally hide Navbar/Footer on chapter reader routes
- **`src/pages/ChapterReader.tsx`** — Remove `lg:flex` wrapper, add border to reaction buttons, add zoom controls to floating menu
- **`src/components/ChapterListModal.tsx`** — Stabilize random view counts

