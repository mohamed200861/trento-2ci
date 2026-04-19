import { Play, Users } from "lucide-react";
import { gruppi } from "@/data/site";

export default function Video() {
  return (
    <>
      <section className="py-20 md:py-28 bg-gradient-paper border-b border-border/60">
        <div className="container-prose">
          <p className="eyebrow"><span/>Video dei gruppi</p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold mt-5 leading-[1] max-w-3xl">
            Otto gruppi, <em className="text-accent not-italic">otto racconti</em>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            La classe si è divisa in otto squadre di lavoro: ciascuna ha realizzato un breve video
            dedicato alla giornata trentina. Qui sotto puoi guardare i contributi di tutti i gruppi.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-prose space-y-8">
          {gruppi.map((g) => (
            <article key={g.n} className="card-elev overflow-hidden grid md:grid-cols-5">
              <div className="md:col-span-3 relative aspect-video md:aspect-auto bg-gradient-forest grid place-items-center group cursor-pointer">
                {/* Placeholder per video — sostituire con <video src=...> o iframe */}
                <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{backgroundImage:'radial-gradient(circle at 30% 30%, hsl(var(--accent)) 0%, transparent 60%)'}}/>
                <div className="relative grid place-items-center w-20 h-20 rounded-full bg-primary-foreground/95 text-primary group-hover:scale-110 transition-transform shadow-elev">
                  <Play className="w-7 h-7 ml-1" fill="currentColor" strokeWidth={0}/>
                </div>
                <div className="absolute bottom-4 left-5 text-primary-foreground/80 text-xs uppercase tracking-[0.25em]">
                  Anteprima video · Gruppo {g.n}
                </div>
              </div>
              <div className="md:col-span-2 p-8 md:p-10 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground grid place-items-center font-display text-xl">
                    {g.n}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Gruppo</div>
                    <h3 className="font-display text-2xl font-semibold leading-tight">Numero {g.n}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 mt-2">
                  <Users className="w-3.5 h-3.5" /> {g.membri.length} componenti
                </div>
                <ul className="text-sm text-foreground/90 space-y-1 mb-5 flex-1">
                  {g.membri.map((m) => (
                    <li key={m} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-accent" />{m}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Il gruppo {g.n} ha raccontato con il proprio video alcuni momenti significativi
                  della visita: presto qui troverai il filmato originale.
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
