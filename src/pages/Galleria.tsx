import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import heroFoto from "@/assets/real-muse-serra.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";
import muse from "@/assets/real-muse-sala.jpg";
import serra from "@/assets/real-muse-serra.jpg";
import piazza from "@/assets/real-piazza-duomo.jpg";
import terrazza from "@/assets/real-terrazza.jpg";

const fallback = [serra, muse, piazza, terrazza];

export default function Galleria() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [photos, setPhotos] = useState<{ src: string }[]>([]);
  const { get } = useSiteContent();

  useEffect(() => {
    supabase.from("gallery_photos").select("url").order("sort_order").order("created_at").then(({ data }) => {
      if (data && data.length > 0) {
        setPhotos(data.map((p: any) => ({ src: p.url })));
      } else {
        // 12 segnaposto dalle foto vere finché non si caricano le altre
        setPhotos(Array.from({ length: 12 }, (_, i) => ({ src: fallback[i % fallback.length] })));
      }
    });
  }, []);

  return (
    <>
      <section className="relative -mt-20 h-[70svh] min-h-[460px] w-full overflow-hidden">
        <img src={heroFoto} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/45 to-primary/85" />
        <div className="absolute inset-0 flex items-end pb-16">
          <div className="container-prose text-primary-foreground">
            <p className="eyebrow text-primary-foreground/80"><span className="!bg-primary-foreground/60"/>Galleria foto</p>
            <h1 className="font-display text-5xl md:text-7xl font-semibold mt-5 leading-[1] max-w-3xl">
              La giornata <em className="text-accent not-italic">in immagini</em>.
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/90 max-w-2xl leading-relaxed">
              {get("galleria_intro", "Le fotografie raccolgono i momenti più significativi della nostra visita al MUSE e della passeggiata nel centro storico di Trento.")}
            </p>
          </div>
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
                  alt=""
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={photos.map(p => ({ src: p.src }))}
        styles={{ container: { backgroundColor: "rgba(10, 20, 16, .95)" } }}
      />
    </>
  );
}
