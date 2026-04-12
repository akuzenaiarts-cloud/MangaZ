import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";
import { cachedFetch } from "@/lib/cachedFetch";

type Manga = Tables<"manga">;

export const useFeaturedManga = () => {
  return useQuery({
    queryKey: ["featured-manga"],
    queryFn: async () => {
      return await cachedFetch<Manga[]>("manga", {
        select: "*",
        filters: [{ column: "featured", operator: "eq", value: "true" }],
        order: { column: "updated_at", ascending: false }
      });
    },
  });
};
