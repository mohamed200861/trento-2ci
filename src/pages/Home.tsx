import { Link } from "react-router-dom";
import { ArrowRight, Camera, Film, FileText, Leaf, Mountain, Droplets, Compass, BookOpen, Sparkles } from "lucide-react";
import hero from "@/assets/hero-trento.jpg";
import muse from "@/assets/muse.jpg";
import centro from "@/assets/centro-trento.jpg";
import foresta from "@/assets/foresta.jpg";
import geologia from "@/assets/geologia.jpg";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative -mt-20 h-[100svh] min-h-[640px] w-full overflow-hidden">
        <img src={hero} alt="Le Dolomiti vicino a Trento all'alba" className="absolute inset-0 w-full h-full object-cover scale-105" width={1920} height={1280}/>
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 flex items-end pb-20 md:pb-28">
          <div className="container-prose w-full text-primary-foreground">
            <p className="eyebrow text-primary-foreground/80 reveal" style={{['--tw-bg-opacity' as any]: 1}}>
              <span className="!bg-primary-foreground/60" /> Progetto di educazione civica · Classe 2CI
            </p>
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-semibold leading-[0.95] mt-6 max-w-4xl reveal reveal-delay-1">
              2CI <em className="not-italic text-accent">a Trento</em>
            </h1>
            <p className="mt-6 text-lg md:text-2xl font-display italic text-primary-foreground/85 max-w-2xl reveal reveal-delay-2">
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
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-primary-foreground/70 text-xs uppercase tracking-[0.3em] animate-float">
          scorri
        </div>
      </section>

      {/* INTRO */}
      <section className="py-24 md:py-32">
        <div className="container-prose grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5">
            <p className="eyebrow"><span/>L'esperienza</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4 leading-tight">
              Una giornata per imparare a guardare il territorio.
            </h2>
          </div>
          <div className="md:col-span-7 space-y-5 text-lg text-muted-foreground leading-relaxed">
            <p>
              La nostra classe ha vissuto una visita d'istruzione a Trento, una città dove
              <span className="text-foreground font-medium"> scienza, natura e storia </span>
              si intrecciano in modo sorprendente. La mattina al MUSE, il pomeriggio tra
              le piazze del centro: una giornata che ci ha aiutato a capire meglio il legame
              fra l'uomo e l'ambiente che lo circonda.
            </p>
            <p>
              Da quell'esperienza sono nati questo sito, le fotografie, i video e gli articoli
              che trovi qui: il racconto, in prima persona, di ciò che abbiamo osservato e imparato.
            </p>
          </div>
        </div>
      </section>

      {/* GIORNATA IN SINTESI */}
      <section className="py-20 bg-gradient-soft">
        <div className="container-prose">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="eyebrow justify-center"><span/>Itinerario</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4">La giornata in sintesi</h2>
            <p className="mt-4 text-muted-foreground">Le tappe principali della nostra visita d'istruzione, dal mattino al tramonto.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-5">
            {[
              {h:"08:00", t:"Partenza", d:"Ritrovo a scuola e partenza in pullman verso Trento."},
              {h:"10:00", t:"MUSE", d:"Visita guidata al Museo delle Scienze, dalle Alpi alla foresta tropicale."},
              {h:"13:30", t:"Pranzo al sacco", d:"Pausa nel parco accanto al museo, fra prati e architettura contemporanea."},
              {h:"15:00", t:"Centro storico", d:"Passeggiata tra Piazza Duomo, fontane e palazzi affrescati."},
            ].map((s, i) => (
              <div key={i} className="card-elev p-6">
                <div className="text-xs font-mono tracking-widest text-accent">{s.h}</div>
                <h3 className="font-display text-2xl mt-2">{s.t}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IL PROGETTO – con immagini */}
      <section className="py-24 md:py-32">
        <div className="container-prose">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <p className="eyebrow"><span/>Il MUSE</p>
              <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight">
                Un museo che ha la forma delle montagne.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Il percorso espositivo del MUSE si sviluppa per piani, ognuno dedicato a un'altitudine diversa:
                dalle vette dei ghiacciai fino agli ambienti tropicali. Abbiamo osservato animali, ecosistemi
                e fossili, ragionando su come il <em>paesaggio</em> non sia mai solo natura, ma anche frutto
                dell'azione dell'uomo nel tempo.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Ci hanno colpito particolarmente la <span className="text-foreground font-medium">foresta pluviale della Tanzania</span>,
                con la sua cascata e la sua umidità, e l'incontro con il <span className="text-foreground font-medium">castoro</span>,
                un animale che modifica l'ambiente costruendo dighe — un piccolo grande esempio di rapporto fra esseri viventi e territorio.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src={muse} alt="Architettura del MUSE" className="rounded-2xl shadow-elev w-full h-72 object-cover col-span-2" loading="lazy"/>
              <img src={foresta} alt="Foresta tropicale" className="rounded-2xl shadow-soft w-full h-56 object-cover" loading="lazy"/>
              <img src={geologia} alt="Stalattite" className="rounded-2xl shadow-soft w-full h-56 object-cover" loading="lazy"/>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mt-28">
            <div className="md:order-2 space-y-6">
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
            <img src={centro} alt="Piazza Duomo a Trento" className="md:order-1 rounded-2xl shadow-elev w-full h-[420px] object-cover" loading="lazy"/>
          </div>
        </div>
      </section>

      {/* COLLEGAMENTI ALLE PAGINE */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container-prose">
          <div className="max-w-2xl mb-14">
            <p className="eyebrow text-primary-foreground/70"><span className="!bg-primary-foreground/40"/>Esplora il sito</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4">Tre modi per raccontare il viaggio.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { to:"/galleria", icon:Camera, title:"Galleria foto", desc:"Oltre cento immagini dal MUSE e dal centro storico, raccolte dagli studenti." },
              { to:"/video", icon:Film, title:"Video dei gruppi", desc:"Otto gruppi, otto sguardi diversi sulla stessa giornata." },
              { to:"/articoli", icon:FileText, title:"Articoli degli studenti", desc:"Ventitré articoli scritti dalla classe, da leggere e scaricare in PDF." },
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
        </div>
      </section>

      {/* EDUCAZIONE CIVICA */}
      <section className="py-28">
        <div className="container-prose">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="eyebrow"><span/>Educazione civica</p>
              <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4 leading-tight">
                Capire il territorio per averne cura.
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                Questa visita non è stata solo un viaggio: è stata un'occasione per riflettere su
                temi che riguardano tutti noi come cittadini.
              </p>
            </div>
            <div className="md:col-span-8 grid sm:grid-cols-2 gap-4">
              {[
                {i:Leaf, t:"Rapporto uomo-ambiente", d:"Comprendere come le nostre scelte modellano il paesaggio."},
                {i:Mountain, t:"Trasformazione del paesaggio", d:"Il territorio cambia: la natura agisce, ma anche l'uomo."},
                {i:Droplets, t:"Rischio idrogeologico", d:"Acqua, frane e alluvioni: il ruolo di briglie e prevenzione."},
                {i:Compass, t:"Tutela del territorio", d:"Conoscere è il primo passo per proteggere ciò che ci circonda."},
                {i:Sparkles, t:"Sostenibilità", d:"Un equilibrio tra sviluppo, turismo e rispetto degli ecosistemi."},
                {i:BookOpen, t:"Osservare per imparare", d:"Vedere con i propri occhi vale più di mille pagine di libro."},
              ].map((c, i) => (
                <div key={i} className="card-elev p-6">
                  <c.i className="w-6 h-6 text-primary mb-4" strokeWidth={1.5} />
                  <h3 className="font-medium text-lg">{c.t}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COSA ABBIAMO IMPARATO */}
      <section className="py-24 bg-gradient-soft">
        <div className="container-prose">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="eyebrow justify-center"><span/>Riflessioni</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4">Cosa abbiamo imparato</h2>
            <p className="mt-4 text-muted-foreground">
              Tre idee che ci portiamo a casa dalla giornata trentina.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n:"01", t:"Il paesaggio è una storia", d:"Ogni montagna, ogni fiume, ogni piazza racconta secoli di trasformazioni — naturali e umane." },
              { n:"02", t:"La scienza si tocca", d:"Vedere dal vivo una stalattite o una foresta tropicale rende vere le pagine dei nostri libri." },
              { n:"03", t:"Essere cittadini consapevoli", d:"Conoscere il territorio significa imparare a difenderlo, oggi e in futuro." },
            ].map((c) => (
              <div key={c.n} className="p-8 rounded-2xl bg-card border border-border/60 shadow-soft">
                <div className="font-display text-5xl text-accent mb-4">{c.n}</div>
                <h3 className="font-display text-2xl mb-3">{c.t}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LA CLASSE 2CI */}
      <section className="py-28">
        <div className="container-prose">
          <div className="rounded-3xl bg-gradient-forest text-primary-foreground p-10 md:p-16 shadow-glow relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative max-w-3xl">
              <p className="eyebrow text-primary-foreground/80"><span className="!bg-primary-foreground/50"/>La classe 2CI</p>
              <h2 className="font-display text-4xl md:text-6xl font-semibold mt-5 leading-tight">
                Un sito costruito insieme, dopo il viaggio.
              </h2>
              <p className="mt-6 text-primary-foreground/85 text-lg leading-relaxed">
                Questo spazio raccoglie il lavoro che la classe 2CI ha realizzato di ritorno da Trento:
                articoli, video di gruppo e fotografie. Ognuno ha contribuito con il proprio sguardo,
                trasformando una visita d'istruzione in un piccolo progetto editoriale di educazione civica.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link to="/articoli" className="btn-primary !bg-primary-foreground !text-primary hover:!bg-accent">Leggi gli articoli</Link>
                <Link to="/galleria" className="btn-ghost !border-primary-foreground/30 !bg-transparent !text-primary-foreground hover:!bg-primary-foreground/10">Apri la galleria</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
