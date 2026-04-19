import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSiteContent() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.from("site_content").select("key,value").then(({ data }) => {
      if (!active) return;
      const map: Record<string, string> = {};
      data?.forEach((r: any) => { map[r.key] = r.value; });
      setContent(map);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  return { content, loading, get: (k: string, fallback = "") => content[k] ?? fallback };
}
