import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logoFoto from "@/assets/real-muse-sala.jpg";
import footerFoto from "@/assets/real-terrazza.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";

const nav = [
  { to: "/", label: "Home" },
  { to: "/galleria", label: "Galleria foto" },
  { to: "/video", label: "Video dei gruppi" },
  { to: "/articoli", label: "Articoli degli studenti" },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { get } = useSiteContent();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border/60" : "bg-transparent"}`}>
        <div className="container-prose flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="block w-11 h-11 rounded-full overflow-hidden ring-2 ring-primary/20 shadow-soft">
              <img src={logoFoto} alt="2CI a Trento" className="w-full h-full object-cover" />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">2CI a Trento</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map(n => (
              <NavLink key={n.to} to={n.to} end={n.to === "/"}
                className={({isActive}) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-foreground/75 hover:text-foreground hover:bg-muted"}`
                }>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <button className="md:hidden p-2 rounded-full bg-card border border-border" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border">
            <div className="container-prose py-4 flex flex-col gap-1">
              {nav.map(n => (
                <NavLink key={n.to} to={n.to} end={n.to === "/"}
                  className={({isActive}) =>
                    `px-4 py-3 rounded-xl text-sm font-medium ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`
                  }>
                  {n.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pt-20"><Outlet /></main>

      <footer className="bg-primary text-primary-foreground mt-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src={footerFoto} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary/90 to-primary" />
        <div className="relative">
          <div className="container-prose py-20 grid md:grid-cols-3 gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <span className="block w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary-foreground/30">
                  <img src={logoFoto} alt="2CI" className="w-full h-full object-cover" />
                </span>
                <span className="font-display text-2xl">2CI a Trento</span>
              </div>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                {get("footer_phrase", "Un progetto realizzato dagli studenti della 2CI dopo il viaggio a Trento.")}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/60 mb-4">Naviga</p>
              <ul className="space-y-2 text-sm">
                {nav.map(n => (
                  <li key={n.to}><Link to={n.to} className="text-primary-foreground/85 hover:text-primary-foreground transition-colors">{n.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/60 mb-4">Ai professori</p>
              <p className="text-sm text-primary-foreground/85 leading-relaxed italic">
                {get("teachers_thanks", "Grazie per l'attenzione e per il tempo dedicato alla visione del nostro lavoro.")}
              </p>
            </div>
          </div>
          <div className="border-t border-primary-foreground/10">
            <div className="container-prose py-6 flex flex-wrap items-center justify-between gap-3 text-xs text-primary-foreground/60">
              <span>© {new Date().getFullYear()} Classe 2CI — Progetto di educazione civica</span>
              <Link to="/admin" className="text-primary-foreground/40 hover:text-primary-foreground/80 transition-colors">Area riservata</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
