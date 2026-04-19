import { useEffect, useState } from "react";
import { Play, Users } from "lucide-react";
import heroFoto from "@/assets/real-terrazza.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";

interface VideoRow {
  id: string;
  group_number: number;
  members: string[];
  description: string;
  video_url: string | null;
  thumbnail_url: string | null;
}

export default function Video() {
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const { get } = useSiteContent();

  useEffect(() => {
    supabase.from("group_videos").select("*").order("group_number").then(({ data }) => {
      if (data) setVideos(data as any);
    });
  }, []);

  return (
    <>
      <section className="relative -mt-20 h-[60svh] min-h-[420px] w-full overflow-hidden">
        <img src={heroFoto} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/45 to-primary/85" />
        <div className="absolute inset-0 flex items-end pb-16">
          <div className="container-prose text-primary-foreground">
            <p className="eyebrow text-primary-foreground/80"><span className="!bg-primary-foreground/60"/>Video dei gruppi</p>
            <h1 className="font-display text-5xl md:text-7xl font-semibold mt-5 leading-[1] max-w-3xl">
              Otto gruppi, <em className="text-accent not-italic">otto racconti</em>.
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/90 max-w-2xl leading-relaxed">
              {get("video_intro", "La classe si è divisa in otto squadre di lavoro: ciascuna ha realizzato un breve video dedicato alla giornata trentina.")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-prose space-y-8">
          {videos.map((g) => (
            <article key={g.id} className="card-elev overflow-hidden grid md:grid-cols-5">
              <div className="md:col-span-3 relative aspect-video md:aspect-auto bg-gradient-forest grid place-items-center group">
                {g.video_url ? (
                  <video src={g.video_url} poster={g.thumbnail_url ?? undefined} controls className="w-full h-full object-cover" />
                ) : g.thumbnail_url ? (
                  <>
                    <img src={g.thumbnail_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="relative grid place-items-center w-20 h-20 rounded-full bg-primary-foreground/95 text-primary shadow-elev">
                      <Play className="w-7 h-7 ml-1" fill="currentColor" strokeWidth={0}/>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{backgroundImage:'radial-gradient(circle at 30% 30%, hsl(var(--accent)) 0%, transparent 60%)'}}/>
                    <div className="relative grid place-items-center w-20 h-20 rounded-full bg-primary-foreground/95 text-primary shadow-elev">
                      <Play className="w-7 h-7 ml-1" fill="currentColor" strokeWidth={0}/>
                    </div>
                  </>
                )}
              </div>
              <div className="md:col-span-2 p-8 md:p-10 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground grid place-items-center font-display text-xl">
                    {g.group_number}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Gruppo</div>
                    <h3 className="font-display text-2xl font-semibold leading-tight">Numero {g.group_number}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 mt-2">
                  <Users className="w-3.5 h-3.5" /> {g.members.length} componenti
                </div>
                <ul className="text-sm text-foreground/90 space-y-1 mb-5 flex-1">
                  {g.members.map((m) => (
                    <li key={m} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-accent" />{m}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed">{g.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
