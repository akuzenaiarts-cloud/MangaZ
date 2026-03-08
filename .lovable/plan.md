

## Plan: Increase Editor's Choice Cover Thumbnails & Tighten Spacing

Looking at the reference, the thumbnail covers are significantly taller (roughly 160-180px tall) and the overall vertical padding is tight — minimal space above the title and below the arrow icons.

### Changes to `src/components/EditorChoice.tsx`:

1. **Increase thumbnail sizes** from `w-20 h-28` to `w-24 h-36` (96x144px) to better match the reference proportions.

2. **Reduce vertical spacing**:
   - Container padding: `p-5 md:p-6` → `p-4 md:p-5` (tighter top/bottom)
   - Margin below description: `mb-4` → `mb-3`
   - Margin below covers row: `mb-5` → `mb-3`
   - Title margin: `mb-2` → `mb-1.5`

This will make the thumbnails larger and compress the vertical whitespace above the title and below the navigation arrows to match the reference.

