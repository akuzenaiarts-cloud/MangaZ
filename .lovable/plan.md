

## Plan: Add Comment Streak Tracker to CommentSection

Based on the reference images, add a streak banner between the comment header and the comment input area, visible only to logged-in users.

### What it looks like (from references):
- A bordered card with a fire icon, "X Day Streak" title, green "N tokens available!" badge
- Subtext: "Comment today to start your streak · 3 days until free chapter" (0-day state) or "✓ You've commented today! · 2 days until free chapter" (1-day state)
- 3 dot indicators on the right showing progress (filled = days done), plus a "Resets in XXm" timer
- Header gets a sort toggle: Best / Newest / Oldest (pill selector)

### Changes to `src/components/CommentSection.tsx`:

1. **Add sort tabs** (Best, Newest, Oldest) next to the comment count header — styled as a pill toggle group matching the reference.

2. **Add streak banner** (only when `isAuthenticated`):
   - Track `commentedToday` state (set to true when user posts a comment)
   - Track `streakDays` state (starts at 0, increments to 1 when they comment)
   - Show fire icon + "X Day Streak" + green badge "N tokens available!"
   - Subtext changes based on state: pre-comment vs post-comment
   - 3 dot indicators on the right showing streak progress toward 3-day goal
   - "Resets in XXm" countdown timer (cosmetic, counts down from a fixed time)

3. **Update `handleSubmit`** to also set `commentedToday = true` and increment streak.

4. **Comment sorting**: Implement Best (by likes), Newest (by date desc), Oldest (by date asc) sort modes.

### Files to edit:
- `src/components/CommentSection.tsx` — all changes in this single file

