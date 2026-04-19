import { Link } from "react-router-dom";
import { ArrowRight, Camera, Film, FileText, Clock, MapPin } from "lucide-react";
import hero from "@/assets/real-terrazza.jpg";
import muse from "@/assets/real-muse-sala.jpg";
import serra from "@/assets/real-muse-serra.jpg";
import piazza from "@/assets/real-piazza-duomo.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function Home() {
  const { get } = useSiteContent();

  return (
    <>
      {/* HERO */}
      <section className="relative -mt-20 h-[100svh] min-h-[640px] w-full overflow-hidden">
        <img src={hero} alt="La classe 2CI sulla terrazza panoramica" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/40 to-primary/85" />
        <div className="absolute inset-0 flex items-end pb-20 md:pb-28">
          <div className="container-prose w-full text-primary-foreground">
            <p className="eyebrow text-primary-foreground/80 reveal">
              <span className="!bg-primary-foreground/60" /> Progetto di educazione civica · Classe 2CI
            </p>
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-semibold leading-[0.95] mt-6 max-w-4xl reveal reveal-delay-1">
              2CI <em className="not-italic text-accent">a Trento</em>
            </h1>
            <p className="mt-6 text-lg md:text-2xl font-display italic text-primary-foreground/90 max-w-2xl reveal reveal-delay-2">
              Un viaggio tra scienza, ambiente e storia.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 reveal reveal-delay-3">
              <Link to="/galleria" className="btn-primary !bg-primary-foreground !text-primary hover:!bg-accent">
                Esplora il viaggio <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/articoli" className="btn-ghost !border-primary-foreground/30 !bg-primary-foreground/10 !text-primary-foreground hover:!bg-primary-foreground/20">
                Leggi gli articoli
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-24 md:py-32">
        <div className="container-prose grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5">
            <p className="eyebrow"><span/>L'esperienza</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4 leading-tight">
              Una giornata cominciata <em className="text-accent not-italic">all'alba</em>.
            </h2>
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-accent" />
                <span>Partenza verso le <strong className="text-foreground">6:00 del mattino</strong></span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-accent" />
                <span><strong className="text-foreground">MUSE</strong> al mattino · <strong className="text-foreground">Centro storico</strong> nel pomeriggio</span>
              </div>
            </div>
          </div>
          <div className="md:col-span-7 space-y-5 text-lg text-muted-foreground leading-relaxed">
            <p>{get("home_intro", "La nostra classe ha vissuto una visita d'istruzione a Trento, una città dove scienza, natura e storia si intrecciano in modo sorprendente.")}</p>
            <p>
              Da quell'esperienza sono nati questo sito, le fotografie, i video e gli articoli
              che trovi qui: il racconto, in prima persona, di ciò che abbiamo osservato e imparato.
            </p>
          </div>
        </div>
      </section>

      {/* IL MUSE – con foto vere */}
      <section className="py-20 md:py-28 bg-gradient-soft">
        <div className="container-prose grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <p className="eyebrow"><span/>Al MUSE</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight">
              Tra ghiacciai, foreste e piani di altitudine.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Il percorso espositivo del MUSE si sviluppa per piani, ognuno dedicato a un'altitudine diversa:
              dalle vette dei ghiacciai fino agli ambienti tropicali. Ci ha colpito particolarmente la
              <span className="text-foreground font-medium"> foresta pluviale della Tanzania</span>,
              con la sua cascata e la sua umidità.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={serra} alt="Serra tropicale del MUSE" className="rounded-2xl shadow-elev w-full h-72 object-cover col-span-2" loading="lazy"/>
            <img src={muse} alt="Sala interna del MUSE" className="rounded-2xl shadow-soft w-full h-44 object-cover col-span-2" loading="lazy"/>
          </div>
        </div>
      </section>

      {/* CENTRO STORICO */}
      <section className="py-20 md:py-28">
        <div className="container-prose grid md:grid-cols-2 gap-12 items-center">
          <img src={piazza} alt="Classe 2CI in Piazza Duomo a Trento" className="rounded-2xl shadow-elev w-full h-[480px] object-cover md:order-1" loading="lazy"/>
          <div className="space-y-5 md:order-2">
            <p className="eyebrow"><span/>Centro storico</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight">
              Tra piazze, fontane e secoli di storia.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Nel pomeriggio abbiamo lasciato i piani del museo per camminare nel cuore della città.
              Trento ci è apparsa come un piccolo gioiello: vie strette, palazzi affrescati, la
              fontana del Nettuno in Piazza Duomo. Una lezione di storia all'aria aperta che ha
              completato la mattina dedicata alla scienza.
            </p>
          </div>
        </div>
      </section>

      {/* TRE MODI */}
      <section className="py-24 md:py-28 bg-primary text-primary-foreground">
        <div className="container-prose">
          <div className="max-w-3xl mb-14">
            <p className="eyebrow text-primary-foreground/70"><span className="!bg-primary-foreground/40"/>Esplora il sito</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4">Tre modi per raccontare il viaggio.</h2>
            <p className="mt-5 text-primary-foreground/85 text-lg leading-relaxed">
              {get("home_three_ways_subtitle", "Un'esperienza come questa può essere raccontata in modi diversi: attraverso le immagini, i video e gli articoli scritti da ognuno di noi.")}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { to:"/galleria", icon:Camera, title:"Galleria foto", desc:"I momenti significativi della giornata, dal MUSE al centro storico." },
              { to:"/video", icon:Film, title:"Video dei gruppi", desc:"Otto gruppi, otto sguardi diversi sulla stessa giornata." },
              { to:"/articoli", icon:FileText, title:"Articoli degli studenti", desc:"Ventitré articoli scritti dalla classe, da leggere e scaricare." },
            ].map((c) => (
              <Link to={c.to} key={c.to} className="group relative p-8 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/15 hover:bg-primary-foreground/10 transition-all duration-500 overflow-hidden">
                <c.icon className="w-8 h-8 text-accent mb-6" strokeWidth={1.5} />
                <h3 className="font-display text-2xl mb-3">{c.title}</h3>
                <p className="text-primary-foreground/75 text-sm leading-relaxed">{c.desc}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm text-accent">
                  Vai alla sezione <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-12 text-center text-primary-foreground/75 italic max-w-3xl mx-auto leading-relaxed">
            {get("home_three_ways_extra", "Il viaggio è raccontato da ognuno di noi tramite fotografie, video di gruppo e articoli personali.")}
          </p>
        </div>
      </section>

      {/* ESPERIENZA + RACCONTO */}
      <section className="py-24 md:py-28">
        <div className="container-prose grid md:grid-cols-2 gap-10">
          <div className="card-elev p-10">
            <p className="eyebrow"><span/>Insieme</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mt-4 leading-tight">
              {get("home_experience_title", "Un'esperienza vissuta insieme")}
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              {get("home_experience_text", "Questa visita ci ha permesso di osservare da vicino ambienti, paesaggi, fenomeni naturali e aspetti storici studiati in classe.")}
            </p>
          </div>
          <div className="card-elev p-10">
            <p className="eyebrow"><span/>Il racconto</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mt-4 leading-tight">
              {get("home_story_title", "Il nostro racconto")}
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              {get("home_story_text", "Ogni studente ha contribuito in modo diverso: con un articolo, con immagini, con un video o con il lavoro di gruppo.")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
