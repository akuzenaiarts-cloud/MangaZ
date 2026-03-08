

## Add Light/Dark Theme Toggle Functionality

Currently the theme toggle button uses local `useState` with no actual effect. The current CSS only defines dark theme variables in `:root`.

### Plan

1. **Create a ThemeContext** (`src/contexts/ThemeContext.tsx`)
   - Store theme in localStorage, default to `dark`
   - Toggle `dark` class on `document.documentElement`
   - Expose `theme` and `toggleTheme`

2. **Add light theme CSS variables** (`src/index.css`)
   - Move current dark values under `.dark` selector
   - Define light theme values in `:root` (light backgrounds, dark text, adjusted muted/card/border colors while keeping the same primary purple)

3. **Wire up the Navbar** (`src/components/Navbar.tsx`)
   - Replace local `darkMode` state with `useTheme()` from the context
   - Both desktop and mobile toggle buttons call `toggleTheme()`

4. **Add ThemeProvider to App** (`src/App.tsx`)
   - Wrap app with `<ThemeProvider>`

5. **Update `tailwind.config.ts`**
   - Change `darkMode` from `["class"]` — already set, no change needed

6. **Update `index.html`**
   - Add `class="dark"` to `<html>` tag to match default

