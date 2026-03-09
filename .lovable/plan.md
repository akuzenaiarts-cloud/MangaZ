

# Improve Chapter Manager Panel

## Changes

### 1. Add "Push to Free" button in `ChapterManager.tsx`
- Add a new icon button (e.g., `Unlock` from lucide) on each premium chapter row
- Clicking it calls a new `usePushChapterToFree` mutation that updates `premium = false` and `created_at = now()` in a single Supabase update
- Show a confirmation tooltip/dialog before executing
- After success, invalidate the chapters query

### 2. Add `usePushChapterToFree` mutation in `useManga.ts`
```typescript
export const usePushChapterToFree = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, mangaId }: { id: string; mangaId: string }) => {
      const { error } = await supabase
        .from("chapters")
        .update({ premium: false, created_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { mangaId }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-chapters", mangaId] });
      queryClient.invalidateQueries({ queryKey: ["all-manga"] });
      toast.success("Chapter pushed to free");
    },
  });
};
```

### 3. Additional quality-of-life improvements to `ChapterManager.tsx`
- **Bulk select & push to free**: Add checkboxes on each premium chapter row + a "Push Selected to Free" bulk action button at the top
- **Chapter count badge**: Show total chapter count in the dialog title
- **Sort toggle**: Add a button to toggle sort order (ascending/descending) for the chapter table
- **Release date column**: Show `created_at` formatted date in the table so admins can see when each chapter was released
- **Premium badge styling**: Color-code the Premium column (amber for premium, gray for free) instead of plain Yes/No text

### Files to modify
1. **`src/hooks/useManga.ts`** — Add `usePushChapterToFree` mutation
2. **`src/components/admin/ChapterManager.tsx`** — Add push-to-free button, bulk selection, sort toggle, release date column, improved styling

