import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";
import { cachedFetch } from "@/lib/cachedFetch";

type Manga = Tables<"manga">;
type Chapter = Tables<"chapters">;

export type MangaWithChapters = Manga & { chapters: Chapter[] };

export const useAllManga = () => {
  return useQuery({
    queryKey: ["all-manga"],
    queryFn: async () => {
      const data = await cachedFetch<MangaWithChapters[]>("manga", {
        select: "*, chapters(id, number, title, created_at, premium, free_release_at, is_subscription, subscription_free_release_at)",
        order: { column: "updated_at", ascending: false }
      });

      // Sort chapters by number descending
      return data.map(m => ({
        ...m,
        chapters: (m.chapters || [])
          .sort((a, b) => b.number - a.number),
      }));
    },
  });
};
