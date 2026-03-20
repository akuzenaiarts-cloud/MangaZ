

# Fix Light Mode Not Working With Theme Presets

## Root Cause

The previous FOUC fix added three layers of hardcoded dark backgrounds that **cannot be overridden** by theme toggling:

1. **`index.html` line 14-15**: `<style>` block with `:root { background: #0a0a0a; }` and `body { background: #0a0a0a; }` — these are unconditional CSS rules
2. **`index.html` line 30**: `<body style="background-color:#0a0a0a;color:#ffffff">` — inline style has the highest CSS specificity, so Tailwind's `bg-background` class (which uses CSS variables) can never override it
3. The body's Tailwind class `bg-background` in `index.css` correctly resolves to `hsl(var(--background))`, but the inline style wins every time

When the user toggles to light mode, `applyTheme()` correctly sets `--background` to the light value, and the `.dark` class is removed. But the body's inline style (`background-color:#0a0a0a`) never changes, so the dark background persists.

## Fix

### 1. `index.html`

- Remove the inline `style` attribute from `<body>` entirely
- Change the `<style>` block to scope the dark background under the `.dark` class so it only applies when dark mode is active:

```css
:root.dark { background: #0a0a0a; }
.dark body { background: #0a0a0a; color: #ffffff; margin: 0; }
body { margin: 0; }
```

This preserves FOUC prevention (page starts with `class="dark"` on `<html>`) while allowing light mode to work when the class is removed.

### 2. `src/index.css` (no change needed)

The existing `body { @apply bg-background text-foreground; }` will now work correctly since the inline style no longer overrides it.

### 3. No other changes

The `ThemeContext.tsx`, `themes.ts`, and `applyTheme()` logic are all correct. The only problem was the hardcoded inline styles.

