

## Plan: Widen the Floating Cover to Reach the Right Arrow

The floating cover image is currently `w-[300px]` with `right-6`, leaving a gap between it and the content area. The user wants it wider so it stretches from the right edge of the card leftward to align with the right chevron arrow.

### Changes to `src/components/EditorChoice.tsx`:

1. **Widen the floating cover** from `w-[300px]` to approximately `w-[420px]` so it spans more of the card's right side.
2. **Increase container right padding** from `md:pr-[440px]` to `md:pr-[460px]` to accommodate the wider cover without overlapping the text content.
3. **Keep the height** at `h-[400px]` and positioning at `right-6 -top-6`.

This will make the floating cover image fill the right portion of the card, visually reaching to where the right slider arrow sits.

