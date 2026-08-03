import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function handleAction(action, args = {}) {
  switch (action) {

    case "check_time":
      return {
        now: new Date().toISOString()
      };

    case "save":
    case "write_memo": {
      const data = {
        pool: args.pool || "memo",
        title: args.title || "",
        summary: args.summary || "",
        content: args.content || "",
        tags: args.tags || [],
        date: args.date || new Date().toISOString().slice(0,10),
        version: args.version || 1,
        moment_type: args.moment_type || null,
        source: args.source || "claude",
        dimension: args.dimension || null,
        archived: false
      };

      const { data: row, error } = await supabase
        .from("memories")
        .insert(data)
        .select()
        .single();

      if (error) throw error;

      return row;
    }


    case "read":
    case "read_memo": {
      let query = supabase
        .from("memories")
        .select("*")
        .eq("archived", false);

      if (args.id) {
        query = query.eq("id", args.id);
      }

      if (args.pool) {
        query = query.eq("pool", args.pool);
      }

      const { data, error } = await query
        .order("created_at", { ascending: false })
        .limit(args.limit || 20);

      if (error) throw error;

      return data;
    }


    case "read_core": {
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .eq("pool", "core")
        .eq("archived", false)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data;
    }


    case "search": {
      const q = args.q || "";

      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .or(
          `title.ilike.%${q}%,summary.ilike.%${q}%,content.ilike.%${q}%`
        )
        .eq("archived", false)
        .limit(args.limit || 20);

      if (error) throw error;

      return data;
    }


    case "briefing": {
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .eq("archived", false)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      return {
        recent_memories: data
      };
    }


    case "archive": {
      if (!args.id) {
        return { error: "id required" };
      }

      const { data, error } = await supabase
        .from("memories")
        .update({
          archived: true,
          updated_at: new Date().toISOString()
        })
        .eq("id", args.id)
        .select()
        .single();

      if (error) throw error;

      return data;
    }


    default:
      return {
        error: `Unknown action: ${action}`
      };
  }
}
