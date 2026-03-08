

## Fix: Wrap Report/Discord Cards on Small Screens

The two cards ("Facing an Issue?" and "Join Our Socials") are in a `flex gap-2.5` container (line 127) without `flex-wrap`, causing them to squeeze on narrow screens.

**Change in `src/pages/MangaInfo.tsx` line 127:**
- Add `flex-wrap` to the `div` containing the two cards so they stack vertically on small screens.

