import { useEffect, useState } from "react";
import { Play, Users, X } from "lucide-react";
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

function GroupCard({ g, onPlay }: { g: VideoRow; onPlay: (v: VideoRow) => void }) {
  const hasVideo = !!g.video_url;
  return (
    <article className="card-elev overflow-hidden flex flex-col">
      {/* Media: fixed 16/9, always shows play button when a video exists */}
      <div className="relative w-full aspect-video bg-gradient-forest overflow-hidden">
        {g.thumbnail_url ? (
          <img src={g.thumbnail_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{backgroundImage:'radial-gradient(circle at 30% 30%, hsl(var(--accent)) 0%, transparent 60%)'}}/>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent"/>

        {hasVideo ? (
          <button
            type="button"
            onClick={() => onPlay(g)}
            aria-label={`Apri il video del Gruppo ${g.group_number}`}
            className="absolute inset-0 grid place-items-center group focus:outline-none"
          >
            <span className="grid place-items-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-foreground/95 text-primary shadow-elev transition-transform group-hover:scale-110 group-active:scale-95">
              <Play className="w-7 h-7 ml-1" fill="currentColor" strokeWidth={0}/>
            </span>
            <span className="absolute bottom-3 right-3 text-[10px] uppercase tracking-[0.2em] bg-primary-foreground/95 text-primary px-2.5 py-1 rounded-full font-medium">
              Apri video
            </span>
          </button>
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-[11px] uppercase tracking-[0.2em] bg-primary-foreground/90 text-primary px-3 py-1.5 rounded-full">
              Video in arrivo
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6 md:p-7 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-full bg-primary text-primary-foreground grid place-items-center font-display text-lg shrink-0">
            {g.group_number}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Gruppo · {g.class_name}</div>
            <h3 className="font-display text-xl font-semibold leading-tight truncate">Numero {g.group_number}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Users className="w-3.5 h-3.5" /> {g.members.length} componenti
        </div>
        <ul className="text-sm text-foreground/90 space-y-1 mb-4 flex-1">
          {g.members.map((m) => (
            <li key={m} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-accent shrink-0" />{m}
            </li>
          ))}
        </ul>
        {g.description && (
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{g.description}</p>
        )}
      </div>
    </article>
  );
}

function VideoModal({ v, onClose }: { v: VideoRow | null; onClose: () => void }) {
  useEffect(() => {
    if (!v) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [v, onClose]);

  if (!v || !v.video_url) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-primary/95 backdrop-blur-md grid place-items-center p-4 sm:p-8 animate-in fade-in" onClick={onClose}>
      <button
        onClick={onClose}
        aria-label="Chiudi"
        className="absolute top-4 right-4 w-11 h-11 grid place-items-center rounded-full bg-primary-foreground/15 hover:bg-primary-foreground/25 text-primary-foreground transition"
      >
        <X className="w-5 h-5"/>
      </button>
      <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <div className="text-primary-foreground/80 text-xs uppercase tracking-[0.2em] mb-3 text-center">
          Gruppo {v.group_number} · {v.class_name}
        </div>
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-elev">
          <video
            src={v.video_url}
            poster={v.thumbnail_url ?? undefined}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-contain bg-black"
          />
        </div>
      </div>
    </div>
  );
}

export default function Video() {
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [activeClass, setActiveClass] = useState<"2CI" | "2BLS">("2CI");
  const [openVideo, setOpenVideo] = useState<VideoRow | null>(null);
  const { get } = useSiteContent();
  const heroFoto = get("video_hero_url") || heroFotoDefault;

  useEffect(() => {
    supabase.from("group_videos").select("*").order("class_name").order("group_number").then(({ data }) => {
      if (data) setVideos(data as any);
    });
  }, []);

  const filtered = videos.filter(v => v.class_name === activeClass);
  const counts = {
    "2CI": videos.filter(v => v.class_name === "2CI").length,
    "2BLS": videos.filter(v => v.class_name === "2BLS").length,
  };

  return (
    <>
      <section className="relative -mt-20 h-[60svh] min-h-[420px] w-full overflow-hidden">
        <img src={heroFoto} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/45 to-primary/85" />
        <div className="absolute inset-0 flex items-end pb-12 sm:pb-16">
          <div className="container-prose text-primary-foreground">
            <p className="eyebrow text-primary-foreground/80"><span className="!bg-primary-foreground/60"/>Video dei gruppi</p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-semibold mt-4 sm:mt-5 leading-[1] max-w-3xl">
              Due classi, <em className="text-accent not-italic">un solo viaggio</em>.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-primary-foreground/90 max-w-2xl leading-relaxed">
              {get("video_intro", "Le classi 2CI e 2BLS hanno raccontato la giornata trentina con video di gruppo. Ogni squadra ha scelto il proprio sguardo.")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-prose">
          {/* Tabs */}
          <div className="flex justify-center mb-10 sm:mb-12">
            <div role="tablist" className="inline-flex p-1.5 rounded-full bg-muted shadow-soft w-full max-w-sm">
              {(["2CI","2BLS"] as const).map(c => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={activeClass === c}
                  onClick={() => setActiveClass(c)}
                  className={`flex-1 px-4 sm:px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeClass === c
                      ? "bg-primary text-primary-foreground shadow-elev"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Classe {c}
                  <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${activeClass === c ? "bg-primary-foreground/20" : "bg-background"}`}>
                    {counts[c]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <header className="mb-8 text-center">
            <p className="eyebrow justify-center inline-flex"><span/>Classe {activeClass}</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold mt-3 leading-tight">
              I video realizzati dagli studenti della <em className="text-accent not-italic">{activeClass}</em>
            </h2>
          </header>

          {/* Uniform grid: 1 col mobile, 2 cols sm+, 3 cols xl */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {filtered.map(g => <GroupCard key={g.id} g={g} onPlay={setOpenVideo} />)}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-16">Nessun gruppo per questa classe.</p>
          )}
        </div>
      </section>

      <VideoModal v={openVideo} onClose={() => setOpenVideo(null)} />
    </>
  );
}
