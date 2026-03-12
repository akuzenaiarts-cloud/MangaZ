

# Plan: Fix Stale Theme Flash, Clean Old Branding, Fix Security

## Root Cause Analysis

### Problem 1: Black/Default theme flash on page load
The CSS in `index.css` defines the "Default" purple theme as the base. When the DB theme is "Sakura", users see the Default dark theme (dark purple/black) until React mounts, fetches site_settings from Supabase, and `applyTheme()` runs. This causes a visible flash of wrong colors on every page load.

### Problem 2: Old version loading after login/registration
When a user logs in, the Supabase auth state change triggers a re-render. The `useSiteSettings` hook has a `staleTime` of 5 minutes, but more critically, the `DEFAULT_SETTINGS` fallback has `preset: 'Purple Night'` which doesn't exist in the theme presets list. So `getThemeByName('Purple Night')` returns `undefined`, and `applyTheme` never runs, leaving the CSS default (the old purple/dark theme). The site stays stuck on the CSS defaults until React Query refetches.

### Problem 3: "Kayn Scan" still appears
`index.html` meta tags, `useSiteSettings.ts` defaults, `AnnouncementBar.tsx`, `Navbar.tsx`, `LoginModal.tsx`, `flickering-footer.tsx`, and `AdminPanel.tsx` still reference "Kayn Scan" or "Purple Night".

## Implementation

### 1. Fix theme flash — apply Sakura as CSS default
Change `index.css` `:root` and `.dark` CSS variables to match the Sakura theme preset values instead of Default purple. This way, the very first paint matches the DB-stored theme. When `applyTheme()` runs later, it's a no-op (same values).

### 2. Fix "Purple Night" fallback
- `useSiteSettings.ts` line 54: Change `preset: 'Purple Night'` to `preset: 'Sakura'`
- `AdminPanel.tsx` lines 91, 115, 272: Change all `'Purple Night'` to `'Sakura'`

### 3. Replace all "Kayn Scan" references
- `index.html` lines 7-8, 28-29: Replace "Kayn Scan" with "MangaHub v1"
- `useSiteSettings.ts` lines 46, 48: Change to "MangaHub v1"
- `Navbar.tsx` line 27: Change fallback to "MangaHub v1"
- `LoginModal.tsx` line 22: Change fallback to "MangaHub v1"
- `flickering-footer.tsx` line 203: Change fallback to "MangaHub v1"
- `AnnouncementBar.tsx` line 37: Use `settings.general.site_name` instead of hardcoded "Kayn Scan"
- `AdminPanel.tsx` line 587: Change placeholder to "MangaHub v1"

### 4. Reduce stale time and add eager theme application
- `useSiteSettings.ts`: Reduce `staleTime` from 5 minutes to 30 seconds
- `ThemeContext.tsx`: Apply theme immediately on mount using cached/default values, not just when settings change

### 5. Fix TypeBadge ref warning
`TypeBadge` is a function component receiving refs from parent carousel components. Wrap it with `React.forwardRef`.

### 6. Security fixes (database migrations)
- **Bookmarks**: Drop "Anyone can read bookmarks" policy, replace with user-scoped SELECT
- **Discord webhooks**: Create `manga_discord_settings` table with admin-only RLS; migrate discord columns from manga table; drop discord columns from manga
- **Notifications**: Tighten INSERT policy — keep current `user_id <> auth.uid()` but add a check that the notification type is `comment_reply` (the only type users should create). Better: use an edge function for mention notifications and restrict INSERT to admin-only. Pragmatic approach: keep current policy but add rate limiting via a trigger.
- **Premium chapters**: Update SELECT policy to hide premium chapter pages from unauthenticated users

### 7. Update frontend for discord settings separation
- `MangaFormModal.tsx`: Read/write discord fields from `manga_discord_settings` table
- `ChapterManager.tsx`: Read webhook URL from `manga_discord_settings`

## Files Changed

| Change | Files |
|--------|-------|
| CSS defaults to Sakura | `src/index.css` |
| Fix Purple Night fallback | `src/hooks/useSiteSettings.ts`, `src/pages/AdminPanel.tsx` |
| Clean Kayn Scan refs | `index.html`, `src/hooks/useSiteSettings.ts`, `src/components/Navbar.tsx`, `src/components/LoginModal.tsx`, `src/components/ui/flickering-footer.tsx`, `src/components/AnnouncementBar.tsx`, `src/pages/AdminPanel.tsx` |
| TypeBadge forwardRef | `src/components/TypeBadge.tsx` |
| Security migrations | 3 migrations (bookmarks, chapters, discord settings) |
| Discord settings split | `src/components/admin/MangaFormModal.tsx`, `src/components/admin/ChapterManager.tsx` |

