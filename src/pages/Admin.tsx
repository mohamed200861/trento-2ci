import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { LogOut, Upload, Trash2, Star, Save, FileText, Film, Image as ImageIcon, Type, Home as HomeIcon } from "lucide-react";

type Tab = "home" | "gallery" | "videos" | "articles" | "texts";

const TEXT_FIELDS: { key: string; label: string; multiline?: boolean }[] = [
  { key: "home_intro", label: "Home · Introduzione", multiline: true },
  { key: "home_three_ways_subtitle", label: "Home · Sottotitolo \"Tre modi\"", multiline: true },
  { key: "home_three_ways_extra", label: "Home · Frase finale \"Tre modi\"", multiline: true },
  { key: "home_experience_title", label: "Home · Titolo \"Un'esperienza vissuta insieme\"" },
  { key: "home_experience_text", label: "Home · Testo esperienza", multiline: true },
  { key: "home_story_title", label: "Home · Titolo \"Il nostro racconto\"" },
  { key: "home_story_text", label: "Home · Testo racconto", multiline: true },
  { key: "galleria_intro", label: "Galleria · Introduzione", multiline: true },
  { key: "video_intro", label: "Video · Introduzione", multiline: true },
  { key: "articoli_intro", label: "Articoli · Introduzione", multiline: true },
  { key: "footer_phrase", label: "Footer · Frase del progetto", multiline: true },
  { key: "teachers_thanks", label: "Footer · Ringraziamento ai professori", multiline: true },
  { key: "footer_copyright", label: "Footer · Riga del copyright (in basso)" },
];

export default function Admin() {
  const nav = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("home");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) nav("/admin/login");
  }, [user, isAdmin, loading, nav]);

  const logout = async () => { await supabase.auth.signOut(); nav("/admin/login"); };

  if (loading || !user || !isAdmin) return <div className="min-h-screen grid place-items-center text-muted-foreground">Caricamento…</div>;

  return (
    <div className="min-h-screen bg-gradient-paper">
      <header className="bg-primary text-primary-foreground sticky top-0 z-40">
        <div className="container-prose flex items-center justify-between h-16">
          <Link to="/" className="font-display text-lg">2CI a Trento <span className="opacity-60 text-sm">· admin</span></Link>
          <button onClick={logout} className="text-sm flex items-center gap-2 hover:text-accent"><LogOut className="w-4 h-4"/>Esci</button>
        </div>
      </header>
      <div className="container-prose py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { k: "home", label: "Home", i: HomeIcon },
            { k: "gallery", label: "Galleria", i: ImageIcon },
            { k: "videos", label: "Video", i: Film },
            { k: "articles", label: "Articoli", i: FileText },
            { k: "texts", label: "Testi del sito", i: Type },
          ].map(t => (
            <button key={t.k} onClick={() => setTab(t.k as Tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${tab === t.k ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-muted"}`}>
              <t.i className="w-4 h-4"/>{t.label}
            </button>
          ))}
        </div>

        {tab === "home" && <HomeAdmin/>}
        {tab === "gallery" && <GalleryAdmin/>}
        {tab === "videos" && <VideosAdmin/>}
        {tab === "articles" && <ArticlesAdmin/>}
        {tab === "texts" && <TextsAdmin/>}
      </div>
    </div>
  );
}

// ============ GALLERY ============
function GalleryAdmin() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const load = () => supabase.from("gallery_photos").select("*").order("sort_order").order("created_at", { ascending: false }).then(({ data }) => setPhotos(data ?? []));
  useEffect(() => { load(); }, []);

  const upload = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
        const { error: upErr } = await supabase.storage.from("gallery").upload(path, file);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(path);
        await supabase.from("gallery_photos").insert({ url: publicUrl, storage_path: path });
      }
      toast.success(`${files.length} foto caricate`);
      load();
    } catch (e: any) { toast.error(e.message); } finally { setUploading(false); }
  };

  const del = async (p: any) => {
    if (!confirm("Eliminare questa foto?")) return;
    if (p.storage_path) await supabase.storage.from("gallery").remove([p.storage_path]);
    await supabase.from("gallery_photos").delete().eq("id", p.id);
    toast.success("Eliminata"); load();
  };

  const toggleFeatured = async (p: any) => {
    await supabase.from("gallery_photos").update({ is_featured: !p.is_featured }).eq("id", p.id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="card-elev p-6">
        <label className="block">
          <div className="font-display text-xl mb-2">Carica nuove foto</div>
          <p className="text-sm text-muted-foreground mb-4">Puoi selezionare più foto in una volta.</p>
          <input type="file" accept="image/*" multiple onChange={e => upload(e.target.files)} disabled={uploading}
            className="block w-full text-sm file:mr-4 file:py-3 file:px-5 file:rounded-full file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer hover:file:bg-primary/90"/>
          {uploading && <p className="text-sm text-accent mt-2 flex items-center gap-2"><Upload className="w-4 h-4 animate-pulse"/>Caricamento in corso…</p>}
        </label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map(p => (
          <div key={p.id} className="relative group rounded-xl overflow-hidden shadow-soft">
            <img src={p.url} alt="" className="w-full h-40 object-cover"/>
            <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
              <button onClick={() => toggleFeatured(p)} title="In evidenza"
                className={`p-2 rounded-full ${p.is_featured ? "bg-accent text-accent-foreground" : "bg-primary-foreground/20 text-primary-foreground"}`}><Star className="w-4 h-4"/></button>
              <button onClick={() => del(p)} className="p-2 rounded-full bg-destructive text-destructive-foreground"><Trash2 className="w-4 h-4"/></button>
            </div>
            {p.is_featured && <span className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">In evidenza</span>}
          </div>
        ))}
        {photos.length === 0 && <p className="col-span-full text-muted-foreground text-center py-12">Nessuna foto caricata.</p>}
      </div>
    </div>
  );
}

// ============ VIDEOS ============
function VideosAdmin() {
  const [videos, setVideos] = useState<any[]>([]);
  const [activeClass, setActiveClass] = useState<"2CI" | "2BLS">("2CI");
  const load = () => supabase.from("group_videos").select("*").order("class_name").order("group_number").then(({ data }) => setVideos(data ?? []));
  useEffect(() => { load(); }, []);

  const uploadFile = async (v: any, file: File, kind: "video" | "thumb") => {
    const bucket = kind === "video" ? "videos" : "thumbnails";
    const path = `${v.class_name}-gruppo-${v.group_number}-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) { toast.error(error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
    const update = kind === "video" ? { video_url: publicUrl, video_storage_path: path } : { thumbnail_url: publicUrl, thumbnail_storage_path: path };
    await supabase.from("group_videos").update(update).eq("id", v.id);
    toast.success("Caricato"); load();
  };

  const updateDesc = async (v: any, description: string) => {
    await supabase.from("group_videos").update({ description }).eq("id", v.id);
    toast.success("Salvato");
  };

  const filtered = videos.filter(v => v.class_name === activeClass);

  return (
    <div className="space-y-6">
      <div className="inline-flex p-1 rounded-full bg-muted">
        {(["2CI","2BLS"] as const).map(c => (
          <button key={c} onClick={() => setActiveClass(c)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeClass === c ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"}`}>
            Classe {c}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filtered.map(v => (
          <div key={v.id} className="card-elev p-6 grid md:grid-cols-3 gap-5">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground grid place-items-center font-display">{v.group_number}</div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Gruppo · {v.class_name}</div>
                  <div className="font-display text-lg">Numero {v.group_number}</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{(v.members ?? []).join(", ")}</p>
            </div>
            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground">Video {v.video_url && <span className="text-accent normal-case">✓ presente</span>}</label>
              <input type="file" accept="video/*" onChange={e => e.target.files?.[0] && uploadFile(v, e.target.files[0], "video")} className="block w-full text-xs"/>
              {v.thumbnail_url && <img src={v.thumbnail_url} alt="" className="w-full h-20 object-cover rounded-lg mt-1"/>}
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mt-3">Thumbnail {v.thumbnail_url && <span className="text-accent normal-case">✓ presente</span>}</label>
              <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && uploadFile(v, e.target.files[0], "thumb")} className="block w-full text-xs"/>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Descrizione</label>
              <textarea defaultValue={v.description} onBlur={e => e.target.value !== v.description && updateDesc(v, e.target.value)}
                rows={4} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm"/>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground text-center py-12">Nessun gruppo per questa classe.</p>}
      </div>
    </div>
  );
}

// ============ ARTICLES ============
function ArticlesAdmin() {
  const [articles, setArticles] = useState<any[]>([]);
  const load = () => supabase.from("articles").select("*").then(({ data }) => {
    const sorted = [...(data ?? [])].sort((a, b) => a.student_name.localeCompare(b.student_name, "it"));
    setArticles(sorted);
  });
  useEffect(() => { load(); }, []);

  const update = async (a: any, patch: any) => {
    await supabase.from("articles").update(patch).eq("id", a.id);
    toast.success("Salvato"); load();
  };

  const uploadPdf = async (a: any, file: File) => {
    const path = `${a.student_name.replace(/\s+/g, "-")}-${Date.now()}.pdf`;
    const { error } = await supabase.storage.from("articles-pdf").upload(path, file);
    if (error) { toast.error(error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("articles-pdf").getPublicUrl(path);
    await update(a, { pdf_url: publicUrl, pdf_storage_path: path, content_type: "pdf" });
  };

  return (
    <div className="space-y-3">
      {articles.map(a => {
        const isLink = a.content_type === "link";
        return (
          <div key={a.id} className="card-elev p-5 grid md:grid-cols-12 gap-4 items-start">
            <div className="md:col-span-3">
              <input defaultValue={a.student_name} onBlur={e => e.target.value !== a.student_name && update(a, { student_name: e.target.value })}
                className="w-full font-display text-lg font-semibold px-2 py-1 rounded border border-transparent hover:border-border focus:border-primary bg-transparent"/>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${isLink ? "bg-accent/20 text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                  {isLink ? "🌐 Link esterno" : "📄 PDF"}
                </span>
                {isLink ? (
                  a.link_url ? <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground">✓ URL impostato</span>
                  : <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/15 text-destructive">URL mancante</span>
                ) : (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${a.pdf_url ? "bg-accent/20 text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                    {a.pdf_url ? "✓ PDF presente" : "PDF mancante"}
                  </span>
                )}
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="text-xs text-muted-foreground">Titolo articolo</label>
              <input defaultValue={a.title ?? ""} onBlur={e => e.target.value !== (a.title ?? "") && update(a, { title: e.target.value })}
                placeholder="(opzionale)" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-sm"/>
            </div>
            <div className="md:col-span-3">
              <label className="text-xs text-muted-foreground">Descrizione</label>
              <textarea defaultValue={a.description ?? ""} onBlur={e => e.target.value !== (a.description ?? "") && update(a, { description: e.target.value })}
                rows={2} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-sm"/>
            </div>
            <div className="md:col-span-3 space-y-2">
              <label className="text-xs text-muted-foreground">Tipo contenuto</label>
              <select value={a.content_type ?? "pdf"} onChange={e => update(a, { content_type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm">
                <option value="pdf">📄 PDF</option>
                <option value="link">🌐 Link esterno</option>
              </select>
              {isLink ? (
                <input type="url" defaultValue={a.link_url ?? ""} placeholder="https://..."
                  onBlur={e => e.target.value !== (a.link_url ?? "") && update(a, { link_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs"/>
              ) : (
                <>
                  <input type="file" accept="application/pdf" onChange={e => e.target.files?.[0] && uploadPdf(a, e.target.files[0])} className="block w-full text-xs"/>
                  {a.pdf_url && <a href={a.pdf_url} target="_blank" rel="noopener" className="text-xs text-accent hover:underline block">Apri PDF</a>}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============ TEXTS ============
function TextsAdmin() {
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    supabase.from("site_content").select("key,value").then(({ data }) => {
      const m: Record<string, string> = {};
      data?.forEach((r: any) => { m[r.key] = r.value; });
      setValues(m);
    });
  }, []);

  const save = async (key: string) => {
    const { error } = await supabase.from("site_content").upsert({ key, value: values[key] ?? "" });
    if (error) toast.error(error.message); else toast.success("Salvato");
  };

  return (
    <div className="space-y-4">
      {TEXT_FIELDS.map(f => (
        <div key={f.key} className="card-elev p-5">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">{f.label}</label>
          {f.multiline ? (
            <textarea value={values[f.key] ?? ""} onChange={e => setValues({ ...values, [f.key]: e.target.value })}
              rows={3} className="mt-2 w-full px-3 py-2 rounded-lg border border-border bg-card text-sm"/>
          ) : (
            <input value={values[f.key] ?? ""} onChange={e => setValues({ ...values, [f.key]: e.target.value })}
              className="mt-2 w-full px-3 py-2 rounded-lg border border-border bg-card text-sm"/>
          )}
          <button onClick={() => save(f.key)} className="mt-3 text-sm flex items-center gap-2 text-primary hover:text-accent"><Save className="w-4 h-4"/>Salva</button>
        </div>
      ))}
    </div>
  );
}

// ============ HOME IMAGES ============
const HOME_IMAGES: { key: string; label: string; description: string }[] = [
  { key: "home_hero_url", label: "Home · Foto hero in alto", description: "Sfondo grande accanto al titolo \"2CI a Trento\"." },
  { key: "header_logo_url", label: "Header · Foto tonda accanto al titolo", description: "Piccola immagine circolare accanto a \"2CI a Trento\" nella barra in alto." },
  { key: "home_muse_serra_url", label: "Home · Sezione MUSE serra", description: "Foto grande nel blocco \"Tra ghiacciai, foreste e piani di altitudine\"." },
  { key: "home_muse_sala_url", label: "Home · Sezione MUSE sala", description: "Foto piccola sotto, nello stesso blocco MUSE." },
  { key: "home_piazza_url", label: "Home · Sezione Centro storico", description: "Foto grande nel blocco \"Tra piazze, fontane e secoli di storia\"." },
  { key: "galleria_hero_url", label: "Galleria · Foto hero in alto", description: "Sfondo della pagina Galleria foto." },
  { key: "video_hero_url", label: "Video · Foto hero in alto", description: "Sfondo della pagina Video dei gruppi." },
  { key: "articoli_hero_url", label: "Articoli · Foto hero in alto", description: "Sfondo della pagina Articoli degli studenti." },
  { key: "footer_bg_url", label: "Footer · Sfondo del piè di pagina", description: "Immagine sfumata sul fondo del sito." },
];

function HomeAdmin() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const load = () => supabase.from("site_content").select("key,value").then(({ data }) => {
    const m: Record<string, string> = {};
    data?.forEach((r: any) => { m[r.key] = r.value; });
    setValues(m);
  });
  useEffect(() => { load(); }, []);

  const uploadImage = async (key: string, file: File) => {
    setBusyKey(key);
    try {
      const path = `${key}-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error } = await supabase.storage.from("site-images").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("site-images").getPublicUrl(path);
      const { error: e2 } = await supabase.from("site_content").upsert({ key, value: publicUrl });
      if (e2) throw e2;
      toast.success("Immagine aggiornata");
      load();
    } catch (e: any) { toast.error(e.message); } finally { setBusyKey(null); }
  };

  const reset = async (key: string) => {
    if (!confirm("Ripristinare l'immagine originale?")) return;
    await supabase.from("site_content").upsert({ key, value: "" });
    toast.success("Ripristinata"); load();
  };

  return (
    <div className="space-y-5">
      <div className="card-elev p-6 bg-accent/10 border-accent/30">
        <p className="text-sm text-muted-foreground">
          Da qui puoi sostituire <strong>tutte le foto della Home</strong> e dell'header/footer senza toccare il codice.
          Carica una nuova immagine per vedere subito l'anteprima. Se lasci vuoto, viene mostrata la foto originale.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {HOME_IMAGES.map(img => {
          const current = values[img.key];
          const busy = busyKey === img.key;
          return (
            <div key={img.key} className="card-elev p-5">
              <div className="flex items-start gap-2 mb-3">
                <ImageIcon className="w-4 h-4 text-accent mt-1 flex-shrink-0"/>
                <div>
                  <div className="font-display text-base font-semibold">{img.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{img.description}</div>
                </div>
              </div>
              <div className="aspect-video rounded-xl overflow-hidden bg-muted border border-border mb-3 grid place-items-center">
                {current ? (
                  <img src={current} alt="" className="w-full h-full object-cover"/>
                ) : (
                  <span className="text-xs text-muted-foreground italic">Foto originale (predefinita)</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <label className="flex-1">
                  <input type="file" accept="image/*" disabled={busy}
                    onChange={e => e.target.files?.[0] && uploadImage(img.key, e.target.files[0])}
                    className="block w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer hover:file:bg-primary/90"/>
                </label>
                {current && (
                  <button onClick={() => reset(img.key)} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1">
                    <Trash2 className="w-3 h-3"/>Ripristina
                  </button>
                )}
              </div>
              {busy && <p className="text-xs text-accent mt-2 flex items-center gap-2"><Upload className="w-3 h-3 animate-pulse"/>Caricamento…</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
