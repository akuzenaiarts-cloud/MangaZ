import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";
import { cachedFetch } from "@/lib/cachedFetch";

type Manga = Tables<"manga">;
type Chapter = Tables<"chapters">;

export const useMangaBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["manga", slug],
    queryFn: async () => {
      return await cachedFetch<Manga>("manga", {
        select: "*",
        filters: [{ column: "slug", operator: "eq", value: slug }],
        single: true
      });
    },
    enabled: !!slug,
  });
};

export const useMangaChapters = (mangaId: string | undefined) => {
  return useQuery({
    queryKey: ["manga-chapters", mangaId],
    queryFn: async () => {
      if (!mangaId) return [];
      return await cachedFetch<Chapter[]>("chapters_public" as any, {
        select: "id, number, title, created_at, manga_id, premium, coin_price, auto_free_days, free_release_at, is_subscription, subscription_free_release_at",
        filters: [{ column: "manga_id", operator: "eq", value: mangaId }],
        order: { column: "number", ascending: false }
      });
    },
    enabled: !!mangaId,
  });
};
