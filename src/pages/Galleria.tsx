import { useState, useMemo } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import muse from "@/assets/muse.jpg";
import centro from "@/assets/centro-trento.jpg";
import foresta from "@/assets/foresta.jpg";
import geologia from "@/assets/geologia.jpg";
import hero from "@/assets/hero-trento.jpg";

const base = [hero, muse, foresta, geologia, centro];
const captions = [
  "Le Dolomiti viste dalla Valle dell'Adige",
  "L'architettura del MUSE",
  "La foresta tropicale della Tanzania",
  "Stalattiti e geologia",
  "Piazza Duomo, Trento",
];

export default function Galleria() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // 24 segnaposto a partire dalle 5 immagini reali
  const photos = useMemo(
    () => Array.from({ length: 24 }, (_, i) => ({
      src: base[i % base.length],
      caption: captions[i % captions.length],
    })),
    []
  );

  return (
    <>
      <section className="py-20 md:py-28 bg-gradient-paper border-b border-border/60">
        <div className="container-prose">
          <p className="eyebrow"><span/>Galleria foto</p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold mt-5 leading-[1] max-w-3xl">
            La giornata <em className="text-accent not-italic">in immagini</em>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Le fotografie raccolgono i momenti più significativi della visita al MUSE e della
            passeggiata nel centro storico di Trento. Clicca un'immagine per ingrandirla.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-prose">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={() => { setIndex(i); setOpen(true); }}
                className="group relative block w-full mb-5 overflow-hidden rounded-2xl shadow-soft hover:shadow-elev transition-all duration-500"
              >
                <img
                  src={p.src}
                  alt={p.caption}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                  <span className="text-primary-foreground text-sm font-medium">{p.caption}</span>
                </div>
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-10">
            Galleria pronta per ospitare oltre cento fotografie reali della visita.
          </p>
        </div>
      </section>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={photos.map(p => ({ src: p.src, description: p.caption }))}
      />
    </>
  );
}
