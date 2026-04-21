import { useEffect, useState } from "react";
import { Download, FileText, ExternalLink, Globe } from "lucide-react";
import heroFotoDefault from "@/assets/real-piazza-duomo.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";

interface Article {
  id: string;
  student_name: string;
  title: string;
  description: string;
  pdf_url: string | null;
  content_type: string;
  link_url: string | null;
}

export default function Articoli() {
  const [articles, setArticles] = useState<Article[]>([]);
  const { get } = useSiteContent();

  useEffect(() => {
    supabase.from("articles").select("*").then(({ data }) => {
      if (data) {
        const sorted = [...data].sort((a: any, b: any) =>
          a.student_name.localeCompare(b.student_name, "it", { sensitivity: "base" })
        );
        setArticles(sorted as any);
      }
    });
  }, []);

  return (
    <>
      <section className="relative -mt-20 h-[60svh] min-h-[420px] w-full overflow-hidden">
        <img src={heroFoto} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/45 to-primary/85" />
        <div className="absolute inset-0 flex items-end pb-16">
          <div className="container-prose text-primary-foreground">
            <p className="eyebrow text-primary-foreground/80"><span className="!bg-primary-foreground/60"/>Articoli degli studenti</p>
            <h1 className="font-display text-5xl md:text-7xl font-semibold mt-5 leading-[1] max-w-3xl">
              Ventitré voci, <em className="text-accent not-italic">una sola classe</em>.
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/90 max-w-2xl leading-relaxed">
              {get("articoli_intro", "Ogni studente ha raccontato l'esperienza con il proprio articolo, mettendo in evidenza osservazioni, momenti significativi e riflessioni personali.")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-prose">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((a) => (
              <article key={a.id} className="card-elev p-7 flex flex-col group">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Articolo di</div>
                    <h3 className="font-display text-2xl font-semibold leading-tight mt-1">{a.student_name}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full grid place-items-center bg-muted text-primary shrink-0">
                    <FileText className="w-4 h-4" strokeWidth={1.5}/>
                  </div>
                </div>
                {a.title && (
                  <p className="font-display text-lg text-accent mb-2 italic leading-snug">«{a.title}»</p>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {a.description || "Riflessioni e racconto della giornata a Trento."}
                </p>
                <div className="mt-6 pt-6 border-t border-border/60 flex gap-2">
                  {a.pdf_url ? (
                    <>
                      <a href={a.pdf_url} target="_blank" rel="noopener" className="btn-primary flex-1 !py-2.5 !text-xs">
                        Apri PDF
                      </a>
                      <a href={a.pdf_url} download className="btn-ghost !py-2.5 !px-4" aria-label="Scarica">
                        <Download className="w-4 h-4"/>
                      </a>
                    </>
                  ) : (
                    <span className="btn-ghost flex-1 !py-2.5 !text-xs opacity-60 cursor-default">
                      In preparazione
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
