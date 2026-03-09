import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  mangaId: string;
  chapterNumber: number;
  chapterTitle: string;
  mangaSlug: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { mangaId, chapterNumber, chapterTitle, mangaSlug }: NotificationRequest = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch manga details
    const { data: manga, error } = await supabase
      .from("manga")
      .select("*")
      .eq("id", mangaId)
      .single();

    if (error || !manga) {
      return new Response(JSON.stringify({ error: "Manga not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if discord is enabled
    if (!manga.discord_webhook_url) {
      return new Response(JSON.stringify({ message: "Discord not configured for this manga" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build chapter URL
    const siteUrl = "https://chapter-haven-io.lovable.app";
    const chapterUrl = `${siteUrl}/manga/${mangaSlug}/chapter/${chapterNumber}`;

    // Build the notification message from template
    const template = manga.discord_notification_template || 
      "New chapter released: {manga_title} - Chapter {chapter_number}: {chapter_title}\nRead now: {chapter_url}";
    
    const messageContent = template
      .replace(/{manga_title}/g, manga.title)
      .replace(/{chapter_number}/g, chapterNumber.toString())
      .replace(/{chapter_title}/g, chapterTitle || "")
      .replace(/{chapter_url}/g, chapterUrl);

    // Build role mentions for content field
    let mentionContent = "";
    if (manga.discord_primary_role_id) {
      mentionContent += `<@&${manga.discord_primary_role_id}> `;
    }
    if (manga.discord_secondary_role_id) {
      mentionContent += `<@&${manga.discord_secondary_role_id}> `;
    }
    mentionContent = mentionContent.trim();

    // Build Discord embed
    const embed = {
      title: `📖 ${manga.title} - Chapter ${chapterNumber}`,
      description: messageContent,
      color: 0x5865F2, // Discord blurple
      thumbnail: manga.cover_url ? { url: manga.cover_url } : undefined,
      fields: [
        { name: "Chapter", value: `${chapterNumber}`, inline: true },
        { name: "Status", value: manga.status.charAt(0).toUpperCase() + manga.status.slice(1), inline: true },
        { name: "Type", value: manga.type.charAt(0).toUpperCase() + manga.type.slice(1), inline: true },
      ],
      url: chapterUrl,
      footer: { 
        text: manga.discord_channel_name ? `📺 ${manga.discord_channel_name} • Chapter Haven` : "Chapter Haven"
      },
      timestamp: new Date().toISOString(),
    };

    const discordPayload: any = {
      embeds: [embed],
    };

    // Add role mentions if any
    if (mentionContent) {
      discordPayload.content = mentionContent;
    }

    console.log("Sending Discord notification:", JSON.stringify(discordPayload, null, 2));

    // Send to Discord
    const discordResponse = await fetch(manga.discord_webhook_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordPayload),
    });

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text();
      console.error("Discord webhook failed:", errorText);
      throw new Error(`Discord webhook failed: ${errorText}`);
    }

    return new Response(JSON.stringify({ success: true, message: "Discord notification sent" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Discord notification error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
