

# LatestCard Styling Updates to Match Reference

Comparing the reference image to the current card, the key differences are:

1. **Title wraps to multiple lines** — currently `line-clamp-1`, reference shows full multi-line title (`line-clamp-2` or `line-clamp-3`)
2. **Chapter rows have a bottom border/divider between each row** — reference shows horizontal lines separating every chapter row, not just between premium and free sections
3. **Chapter text is bolder/larger** — reference uses a slightly larger, bolder "Chapter N" text
4. **Date text is right-aligned and lighter** — similar to current but the reference shows dates like "1 day ago", "2 days ago" rather than actual dates
5. **Card background is more solid/defined** — reference has a more opaque dark card background, not `bg-card/30`

## Changes — `src/components/LatestUpdates.tsx`

**LatestCard component only:**

1. **Title**: Change `line-clamp-1` to `line-clamp-2` so longer titles wrap naturally
2. **Card background**: Change `bg-card/30` to `bg-card/50` or `bg-card/60` for a more solid look
3. **Chapter row borders**: Add a bottom border (`border-b border-border/30`) to each chapter row instead of only a single divider between premium/free. Remove the standalone divider div — the borders on each row handle separation. Last row has no bottom border.
4. **Chapter row padding**: Add `py-1.5` padding to each chapter link for more vertical spacing (matching the reference's roomier rows)
5. **Keep Crown icon unchanged** as requested

