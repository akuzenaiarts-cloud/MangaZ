export const onRequest: PagesFunction<{
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_PUBLISHABLE_KEY: string;
}> = async ({ request, env, next }) => {
  const url = new URL(request.url);
  
  // Only proxy GET requests to /api/supabase/*
  if (request.method !== "GET" || !url.pathname.startsWith("/api/supabase/")) {
    return next();
  }

  // Extract the Supabase path (e.g., /rest/v1/manga)
  const supabasePath = url.pathname.replace("/api/supabase/", "");
  const supabaseUrl = new URL(supabasePath, env.VITE_SUPABASE_URL);
  supabaseUrl.search = url.search;

  // Key for caching
  const cacheKey = new Request(supabaseUrl.toString(), request);
  const cache = caches.default;

  // Check cache
  let response = await cache.match(cacheKey);

  if (!response) {
    console.log(`Cache MISS for ${supabaseUrl.toString()}`);
    
    // Fetch from Supabase
    const headers = new Headers(request.headers);
    headers.set("apikey", env.VITE_SUPABASE_PUBLISHABLE_KEY);
    headers.set("Authorization", `Bearer ${env.VITE_SUPABASE_PUBLISHABLE_KEY}`);

    response = await fetch(supabaseUrl.toString(), {
      headers,
    });

    // Only cache successful JSON responses
    if (response.ok && response.headers.get("Content-Type")?.includes("application/json")) {
      // Reconstruct response to add cache headers
      response = new Response(response.body, response);
      response.headers.set("Cache-Control", "public, s-maxage=3600"); // Cache for 1 hour at the edge
      
      // Store in cache
      await cache.put(cacheKey, response.clone());
    }
  } else {
    console.log(`Cache HIT for ${supabaseUrl.toString()}`);
  }

  // Add a custom header to identify cache status
  const finalResponse = new Response(response.body, response);
  finalResponse.headers.set("X-Proxy-Cache", response.headers.has("CF-Cache-Status") || response.headers.has("X-Proxy-Cache") ? "HIT" : "MISS");
  
  return finalResponse;
};
