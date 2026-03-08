

## Plan: Match Editor's Choice to Reference Design

Comparing the reference image with the current implementation, here are the differences:

### Changes to `src/components/EditorChoice.tsx`:

1. **Title**: Much larger and bolder — use `text-4xl md:text-5xl font-extrabold` with truncation (reference shows ellipsis)
2. **Description**: Larger text (`text-base md:text-lg`), more lines visible (line-clamp-4), lighter muted color
3. **Cover thumbnails**: Taller — increase to `w-28 h-44` to match reference proportions
4. **Thumbnail gap**: Increase to `gap-3`
5. **Arrow buttons**: Larger (`w-11 h-11`), positioned to the left and right of the thumbnail row (not below). In the reference, left arrow is at the left edge of thumbnails, right arrow at the right edge — both vertically centered on the thumbnails
6. **Dots**: Moved below the thumbnails, centered, larger (`w-2 h-2`, active `w-5`)
7. **Right banner image**: Wider — `md:w-[420px]` to give the cover more presence
8. **Layout**: Arrows flanking the thumbnail row, dots below — restructure the bottom section
9. **Padding**: `p-6 md:p-8` for comfortable spacing matching reference
10. **"Start Reading" button**: Rounded-full pill style with dark bg matching reference (`rounded-full bg-background/80 backdrop-blur`)

### Layout restructure for thumbnails + arrows:
```
<div className="flex items-center gap-3 mb-3">
  <button (prev arrow)>
  <div className="flex gap-3"> thumbnails </div>
  <button (next arrow)>
</div>
<div className="flex justify-center"> dots </div>
```

