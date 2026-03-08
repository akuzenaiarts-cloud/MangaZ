

## Plan: Build Kayn Scan Manga Website Clone

### Overview
Build a dark-themed manga/scanlation website with mock data, matching the kaynscan.com design. Six pages, all using static/mock data for now.

### Pages to Build

1. **HomePage** (`/`)
   - Hero carousel with featured manga covers (auto-sliding, left/right arrows)
   - Trending section with numbered manga cards (1-6) showing type badges, title, genres
   - Sidebar widgets: Share, Report, Discord link
   - Pinned Series section
   - Latest Updates section with chapter listings

2. **Manga Info Page** (`/manga/:slug`)
   - Large cover + banner, title, description, genres/tags, status, type badges
   - Chapter list with dates
   - Comment section (read-only for guests, interactive after login)

3. **Chapter Reading Page** (`/manga/:slug/chapter/:id`)
   - Vertical scroll reader with manga page images (placeholder images)
   - Prev/Next chapter navigation
   - Chapter selector dropdown
   - Comment section

4. **Latest Page** (`/latest`)
   - Grid of recently updated manga with latest chapter info

5. **Series Page** (`/series`)
   - Filterable grid by genre, type, status
   - Search within series

6. **Library Page** (`/library`)
   - User's bookmarked manga (requires login, prompt for guests)

### Shared Components

- **Navbar**: Logo "Kayn Scan", Search (modal overlay), Latest button, Series button, Library button, Sign In button — dark theme, sticky top
- **MangaCard**: Reusable card with cover image, title, type badge, genre tags
- **Footer**: Minimal dark footer

### Design System
- Dark background (`#0a0a0a` / near-black), white text
- Accent color matching kaynscan (blue/purple highlights)
- Rounded card corners, hover effects with scale/glow
- Custom CSS variables in index.css

### Data Layer
- `src/data/mockManga.ts` — array of manga objects with titles, covers (placeholder), genres, chapters, descriptions
- All pages read from this mock data
- Structured so it can later be swapped for Supabase

### Auth (Placeholder)
- Sign In button opens a modal with Discord and Google login buttons
- No actual OAuth wiring yet — just UI placeholder
- Auth state managed via React context (`AuthContext`)

### Comment System (UI Only)
- Comment list component showing mock comments
- Input field gated behind auth state
- Guest users see "Sign in to comment" prompt

### File Structure
```
src/
  data/mockManga.ts
  contexts/AuthContext.tsx
  components/
    Navbar.tsx
    MangaCard.tsx
    HeroCarousel.tsx
    TrendingSection.tsx
    CommentSection.tsx
    ChapterList.tsx
    SearchModal.tsx
    GenreFilter.tsx
    Footer.tsx
  pages/
    Index.tsx (HomePage)
    MangaInfo.tsx
    ChapterReader.tsx
    Latest.tsx
    Series.tsx
    Library.tsx
```

### Implementation Order
1. Design system (dark theme CSS variables) + mock data
2. Navbar + layout shell
3. HomePage (carousel, trending, pinned, latest)
4. Series page with filters
5. Manga Info page with chapter list + comments
6. Chapter Reading page
7. Latest + Library pages
8. Auth context + Sign In modal UI

