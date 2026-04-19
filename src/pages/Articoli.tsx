import { Download, FileText } from "lucide-react";
import { studenti } from "@/data/site";

export default function Articoli() {
  return (
    <>
      <section className="py-20 md:py-28 bg-gradient-paper border-b border-border/60">
        <div className="container-prose">
          <p className="eyebrow"><span/>Articoli degli studenti</p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold mt-5 leading-[1] max-w-3xl">
            Ventitré voci, <em className="text-accent not-italic">una sola classe</em>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Ogni studente della 2CI ha scritto un articolo sulla visita d'istruzione a Trento.
            Qui sotto trovi l'elenco completo, in ordine, con la possibilità di leggere o scaricare ogni PDF.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-prose">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {studenti.map((nome, i) => {
              const num = i + 1;
              return (
                <article key={num} className="card-elev p-7 flex flex-col group">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Articolo</div>
                      <div className="font-display text-5xl font-semibold text-primary mt-1 leading-none">
                        {String(num).padStart(2, "0")}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full grid place-items-center bg-muted text-primary">
                      <FileText className="w-4 h-4" strokeWidth={1.5}/>
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-semibold leading-tight">{nome}</h3>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed flex-1">
                    Riflessioni e racconto della giornata a Trento: il MUSE, l'ambiente, il centro storico
                    e le scoperte fatte in classe dopo il viaggio.
                  </p>
                  <div className="mt-6 pt-6 border-t border-border/60 flex gap-2">
                    <a href={`/pdf/articolo-${num}.pdf`} target="_blank" rel="noopener" className="btn-primary flex-1 !py-2.5 !text-xs">
                      Apri PDF
                    </a>
                    <a href={`/pdf/articolo-${num}.pdf`} download className="btn-ghost !py-2.5 !px-4" aria-label="Scarica">
                      <Download className="w-4 h-4"/>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-12">
            I file PDF sono segnaposto: potranno essere sostituiti con gli articoli reali degli studenti.
          </p>
        </div>
      </section>
    </>
  );
}
