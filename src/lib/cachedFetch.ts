import { supabase } from "@/integrations/supabase/client";

/**
 * cachedFetch allows fetching data through our Cloudflare Edge Caching Proxy.
 * 
 * If running in production (Cloudflare), it routes requests through /api/supabase/
 * which is intercepted by our edge middleware.
 * 
 * If running in local development, it falls back to the standard Supabase client.
 */
export async function cachedFetch<T>(
  path: string,
  options: {
    select?: string;
    order?: { column: string; ascending?: boolean };
    limit?: number;
    filters?: { column: string; operator: 'eq' | 'in'; value: string | string[] }[];
    head?: boolean;
    single?: boolean;
  } = {}
) {
  // Check if we are in production and running on Cloudflare
  const isProd = import.meta.env.PROD;
  const isCloudflare = window.location.hostname.endsWith(".pages.dev") || 
                       !window.location.hostname.includes("localhost");

  if (isProd && isCloudflare) {
    try {
      // Build the PostgREST URL
      const url = new URL(`${window.location.origin}/api/supabase/rest/v1/${path}`);
      
      if (options.select) url.searchParams.set("select", options.select);
      if (options.order) url.searchParams.set("order", `${options.order.column}.${options.order.ascending === false ? 'desc' : 'asc'}`);
      if (options.limit) url.searchParams.set("limit", options.limit.toString());
      
      if (options.filters) {
        options.filters.forEach(filter => {
          if (filter.operator === 'eq') {
            url.searchParams.set(filter.column, `eq.${filter.value}`);
          } else if (filter.operator === 'in') {
            const val = Array.isArray(filter.value) ? `(${filter.value.join(',')})` : `(${filter.value})`;
            url.searchParams.set(filter.column, `in.${val}`);
          }
        });
      }

      const headers: Record<string, string> = {
        "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json",
      };

      if (options.single) {
        headers["Accept"] = "application/vnd.pgrst.object+json";
      }
      
      const response = await fetch(url.toString(), { headers });

      if (!response.ok) {
        throw new Error(`Proxy fetch failed: ${response.statusText}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.warn("Edge cache fetch failed, falling back to direct Supabase:", error);
    }
  }

  // standard Supabase client fallback
  let query: any = supabase.from(path).select(options.select || "*");
  
  if (options.filters) {
    options.filters.forEach(filter => {
      if (filter.operator === 'eq') query = query.eq(filter.column, filter.value);
      if (filter.operator === 'in') query = query.in(filter.column, filter.value as string[]);
    });
  }

  if (options.order) {
    query = query.order(options.order.column as any, { ascending: options.order.ascending });
  }
  
  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.single) {
    query = query.single();
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as T;
}
