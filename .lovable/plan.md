

# Implementation Plan

12 items: bug fixes, feature improvements, and a theme system overhaul.

---

## 1. Trending Section - Top 6 by Day

Currently sorts by total `views`. Need to track daily views or use a time-based approach.

**Approach**: Since there's no `daily_views` column, create a simple solution: add a `daily_views` integer column to `manga` table (reset daily via a scheduled function or just use `views` with a "trending score" based on recent chapter activity). Simpler practical approach: sort by manga that had chapters updated most recently AND have highest views - a composite score.

**Changes**:
- `src/pages/Index.tsx` — Change trending logic to weight recent chapter activity + views
- The current `views`-only sort is a reasonable fallback; enhance it by factoring in recency of last chapter upload

---

## 2. Restore "Featured Slider" Toggle in MangaFormModal

The `trending` toggle was removed but it controlled the Hero Carousel inclusion. The HeroCarousel (`src/components/HeroCarousel.tsx` line 26) filters by `featured || pinned || trending`. The form still has `trending` in the schema but no UI toggle for it.

**Changes**:
- `src/components/admin/MangaFormModal.tsx` — Re-add a "Featured Slider" toggle mapped to the `trending` field (since `featured` = Editor's Choice, `pinned` = Pinned, `trending` = Featured Slider)
- Update the grid from `grid-cols-2` back to `grid-cols-3` at line 453

---

## 3. Clean Mock Data & Caching Issues

**Mock data found**:
- `src/pages/ChapterReader.tsx` line 77: `Array.from({ length: 8 }, (_, i) => null)` — generates 8 fake placeholder pages when no real pages exist. This is why "Start Reading" on a manga with no chapters shows mock content.
- `src/pages/EarnCoins.tsx` line 29: mock claimed day state (minor, acceptable)

**Changes**:
- `src/pages/ChapterReader.tsx` — Remove the placeholder page generation. If `pageUrls.length === 0`, show a "No pages available" message instead of gray boxes
- `src/pages/MangaInfo.tsx` — Hide "Start Reading" button when `chapters.length === 0`
- Add proper cache-busting: ensure React Query `staleTime` isn't too aggressive. Current `staleTime: 1000 * 60 * 5` in site settings is fine. No code-level caching issues found; the "old version loading" issue is likely browser service worker or CDN caching from the deployment platform.

---

## 4. Latest Updates - 2 Cards Per Row on Tablet

**Changes**:
- `src/components/LatestUpdates.tsx` — Change grid from `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4` to `grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4` (remove md:grid-cols-3, use md:grid-cols-2)

---

## 5. Latest Updates - Limit to 16 Manga

**Changes**:
- `src/components/LatestUpdates.tsx` line 76 — Change `.slice(0, 12)` to `.slice(0, 16)`

---

## 6. Fix @Mentions for Multi-Word Usernames

Current regex `/@([\w\s]+?)(?=\s@|\s|$)/g` breaks on spaces. Solution: use hyphenated mention tags `@First-Name` that map to display names.

**Changes**:
- `src/components/CommentSection.tsx`:
  - `MentionInput.selectSuggestion` — Insert `@${name.replace(/\s+/g, '-')}` instead of `@${name}`
  - `renderTextWithMentions` — Update regex to match `@[\w-]+` pattern, then convert hyphens back to spaces for profile lookup
  - `handleSubmit` / `submitReply` — Extract mentions using `@([\w-]+)` regex, convert hyphens to spaces before looking up profiles
- `src/hooks/useComments.ts` — In `addComment` mutation, when processing mentions, convert hyphens to spaces: `mentions.map(m => m.replace(/-/g, ' '))`

---

## 7. Admin Can Edit/Delete Any Comment

Currently `CommentItem` only shows edit/delete for `isOwner`. Need to also allow admins.

**Changes**:
- `src/components/CommentSection.tsx` — Change the condition from `{isOwner && !editing && (` to `{(isOwner || isAdmin) && !editing && (`
- RLS already allows admins to update/delete comments (confirmed in DB policies)

---

## 8. Fix Nested Reply Bug

Currently replies to replies don't work because `replyTo` is only checked against top-level comment IDs (line 374: `replyTo === c.id`). When clicking Reply on a nested reply, the reply input doesn't appear.

**Changes**:
- `src/components/CommentSection.tsx`:
  - Move the reply input rendering into `CommentItem` itself so it works at any nesting level
  - Pass `replyTo`, `replyText`, `setReplyText`, `submitReply` as props to `CommentItem`
  - In `CommentItem`, show the reply input when `replyTo === comment.id`
  - When replying to a nested reply, use the top-level parent's ID as `parent_id` (to keep threading flat at 2 levels) but include the replied-to user's name as `@mention`

---

## 9. Full Theme Preset System

Replace the simple "Smart Theme" (primary color only) with a full preset system controlling multiple CSS variables.

**Theme presets** (from reference image + extras): Default, Glacier, Harvest, Lavender, Brutalist, Obsidian, Orchid, Solar, Tide, Sakura.

Each preset defines: background, card, popover, primary, secondary, muted, accent, border, foreground colors for both light and dark modes.

**Changes**:
- Create `src/lib/themes.ts` — Define all theme presets with full CSS variable maps for light and dark modes. Each theme has a `name`, `colors` array (5 preview circles), and `variables` for `:root` and `.dark`
- `src/contexts/ThemeContext.tsx` — Add theme preset application: when a preset is selected, inject its CSS variables onto `document.documentElement`
- `src/pages/AdminPanel.tsx` — Replace the current theme section with a new preset selector showing 5 color circles per theme (matching reference image)
- `src/hooks/useSiteSettings.ts` — Update `ThemeSettings` interface
- `src/index.css` — Keep default variables as fallback; theme presets override them at runtime

---

## 10. Premium Chapter Differentiation in MangaInfo

**Changes**:
- `src/pages/MangaInfo.tsx` — In the chapter list rendering:
  - For premium chapters: add a dark overlay + lock icon on the thumbnail
  - Show coin cost below the date (e.g., "🪙 100")
  - Reference image shows premium chapters with shadowed thumbnails and lock icons

---

## 11. Fix Report & Share Buttons in MangaInfo

The Share button already works (`handleShare` function exists). The Report button just shows a toast but has no real functionality.

**Changes**:
- `src/pages/MangaInfo.tsx` — The Report button currently only shows when there's no patreon URL (line 221-224). Fix: always show both Report and Donate buttons side by side. Wire Report to open a simple dialog or send an email/discord notification.
- Ensure the Report card always appears regardless of patreon URL

---

## 12. "Start Reading" Only When Chapters Exist

**Changes**:
- `src/pages/MangaInfo.tsx` line 161 — Wrap the "Start Reading" Link in a condition: only show when `chapters.length > 0`

---

## Files Summary

| Item | Files |
|------|-------|
| Trending by day | `Index.tsx` |
| Featured Slider toggle | `MangaFormModal.tsx` |
| Clean mock data | `ChapterReader.tsx`, `MangaInfo.tsx` |
| Latest 2-col tablet | `LatestUpdates.tsx` |
| Latest 16 limit | `LatestUpdates.tsx` |
| @mention fix | `CommentSection.tsx`, `useComments.ts` |
| Admin comment mgmt | `CommentSection.tsx` |
| Nested reply fix | `CommentSection.tsx` |
| Theme system | `src/lib/themes.ts` (new), `ThemeContext.tsx`, `AdminPanel.tsx`, `useSiteSettings.ts`, `index.css` |
| Premium chapters UI | `MangaInfo.tsx` |
| Report/Share fix | `MangaInfo.tsx` |
| Start Reading guard | `MangaInfo.tsx` |

