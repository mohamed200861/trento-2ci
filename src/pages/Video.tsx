import { useEffect, useState } from "react";
import { Play, Users } from "lucide-react";
import heroFotoDefault from "@/assets/real-terrazza.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";

interface VideoRow {
  id: string;
  class_name: string;
  group_number: number;
  members: string[];
  description: string;
  video_url: string | null;
  thumbnail_url: string | null;
}

function GroupCard({ g }: { g: VideoRow }) {
  return (
    <article className="card-elev overflow-hidden grid md:grid-cols-5">
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
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Gruppo · {g.class_name}</div>
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
  );
}

export default function Video() {
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const { get } = useSiteContent();
  const heroFoto = get("video_hero_url") || heroFotoDefault;

  useEffect(() => {
    supabase.from("group_videos").select("*").order("class_name").order("group_number").then(({ data }) => {
      if (data) setVideos(data as any);
    });
  }, []);

  const ci = videos.filter(v => v.class_name === "2CI");
  const bls = videos.filter(v => v.class_name === "2BLS");

  return (
    <>
      <section className="relative -mt-20 h-[60svh] min-h-[420px] w-full overflow-hidden">
        <img src={heroFoto} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/45 to-primary/85" />
        <div className="absolute inset-0 flex items-end pb-16">
          <div className="container-prose text-primary-foreground">
            <p className="eyebrow text-primary-foreground/80"><span className="!bg-primary-foreground/60"/>Video dei gruppi</p>
            <h1 className="font-display text-5xl md:text-7xl font-semibold mt-5 leading-[1] max-w-3xl">
              Due classi, <em className="text-accent not-italic">un solo viaggio</em>.
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/90 max-w-2xl leading-relaxed">
              {get("video_intro", "Le classi 2CI e 2BLS hanno raccontato la giornata trentina con video di gruppo. Ogni squadra ha scelto il proprio sguardo.")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-prose space-y-16">
          {/* 2CI */}
          <div>
            <header className="mb-8 flex items-end justify-between flex-wrap gap-4">
              <div>
                <p className="eyebrow"><span/>Classe 2CI</p>
                <h2 className="font-display text-3xl md:text-4xl font-semibold mt-3 leading-tight">
                  I video realizzati dagli studenti della <em className="text-accent not-italic">2CI</em>
                </h2>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{ci.length} gruppi</span>
            </header>
            <div className="space-y-8">
              {ci.map(g => <GroupCard key={g.id} g={g} />)}
            </div>
          </div>

          {/* divider */}
          <div className="relative py-2">
            <div className="absolute inset-x-0 top-1/2 h-px bg-border"/>
            <div className="relative mx-auto w-fit bg-background px-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              ◆ ◆ ◆
            </div>
          </div>

          {/* 2BLS */}
          <div>
            <header className="mb-8 flex items-end justify-between flex-wrap gap-4">
              <div>
                <p className="eyebrow"><span/>Classe 2BLS</p>
                <h2 className="font-display text-3xl md:text-4xl font-semibold mt-3 leading-tight">
                  I video realizzati dagli studenti della <em className="text-accent not-italic">2BLS</em>
                </h2>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{bls.length} gruppi</span>
            </header>
            <div className="space-y-8">
              {bls.map(g => <GroupCard key={g.id} g={g} />)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
