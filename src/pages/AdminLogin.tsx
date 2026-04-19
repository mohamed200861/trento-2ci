import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Mountain } from "lucide-react";

export default function AdminLogin() {
  const nav = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && user && isAdmin) { nav("/admin"); return null; }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` }
        });
        if (error) throw error;
        toast.success("Registrato! Ora puoi accedere.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Accesso effettuato");
        nav("/admin");
      }
    } catch (e: any) {
      toast.error(e.message ?? "Errore");
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-paper p-6">
      <div className="w-full max-w-md card-elev p-10">
        <div className="flex items-center gap-3 mb-8">
          <span className="grid place-items-center w-11 h-11 rounded-full bg-primary text-primary-foreground"><Mountain className="w-5 h-5"/></span>
          <div>
            <div className="font-display text-2xl font-semibold">Area riservata</div>
            <div className="text-xs text-muted-foreground">2CI a Trento · gestione contenuti</div>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"/>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Password</label>
            <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"/>
          </div>
          <button disabled={busy} type="submit" className="btn-primary w-full">
            {busy ? "Attendi…" : mode === "login" ? "Accedi" : "Registrati"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-5 text-sm text-muted-foreground hover:text-foreground w-full text-center">
          {mode === "login" ? "Primo accesso? Registrati" : "Hai già un account? Accedi"}
        </button>
        {user && !isAdmin && (
          <p className="mt-4 text-xs text-destructive text-center">Account senza permessi admin.</p>
        )}
      </div>
    </div>
  );
}
