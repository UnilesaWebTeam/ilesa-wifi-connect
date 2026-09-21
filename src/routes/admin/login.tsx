import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { Loader2, ShieldCheck, Wifi } from "lucide-react";
import { Brand, Field, FormAlert, PasswordField } from "@/components/portal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AdminRole } from "@/lib/mock-admin";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Portal Sign In — University of Ilesa Wi-Fi" },
      { name: "description", content: "Secure sign in for University of Ilesa network administrators managing Wi-Fi credentials." },
      { property: "og:title", content: "University of Ilesa Wi-Fi Admin Portal" },
      { property: "og:description", content: "Sign in to manage the university Wi-Fi credential system." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminLoginPage,
});

type LoginError = "invalid" | "disabled" | "expired" | null;

function AdminLoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<LoginError>(null);
  const [loading, setLoading] = useState(false);

  const signIn = (role: AdminRole) => {
    setLoading(true);
    window.setTimeout(() => void navigate({ to: "/admin/verify", search: { role } }), 700);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!identifier || !password) { setError("invalid"); return; }
    if (identifier.toLowerCase().includes("disabled")) { setError("disabled"); return; }
    signIn(identifier.toLowerCase().includes("super") ? "super-admin" : "admin");
  };

  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-[45%_55%]">
      <section className="auth-visual relative hidden min-h-screen overflow-hidden p-10 lg:flex lg:flex-col" aria-label="University administration portal">
        <Brand inverse />
        <div className="my-auto max-w-md">
          <div className="mb-8 grid size-20 place-items-center rounded-2xl border border-brand-foreground/20 bg-brand-foreground/10">
            <Wifi className="size-10 text-brand-foreground" strokeWidth={1.6} />
          </div>
          <h1 className="max-w-sm text-4xl font-semibold leading-tight text-brand-foreground">Wi-Fi Credential Management</h1>
          <p className="mt-5 max-w-sm text-base leading-7 text-brand-foreground/75">Secure access for university network administrators.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-brand-foreground/65"><ShieldCheck className="size-4" /> Official University of Ilesa system</div>
      </section>
      <section className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-5 py-5 lg:hidden"><Brand /></header>
        <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
          <div className="w-full max-w-[460px] animate-page-in">
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold text-primary">Administration</p>
              <h2 className="text-3xl font-semibold">Admin Portal</h2>
              <p className="mt-2 text-sm text-muted-foreground">Sign in to manage the university Wi-Fi credential system.</p>
            </div>
            <form onSubmit={submit} className="space-y-5" noValidate>
              {error === "invalid" && <FormAlert title="Unable to sign in">Incorrect email/ID or password. Please check your details and try again.</FormAlert>}
              {error === "disabled" && <FormAlert title="Account disabled">Your administrator account has been disabled. Please contact the Super Admin.</FormAlert>}
              {error === "expired" && <FormAlert title="Session expired">Your session has expired. Please sign in again.</FormAlert>}
              <Field id="admin-id" label="Admin Email / Admin ID" placeholder="Enter your admin email or ID" value={identifier} onChange={(event) => setIdentifier(event.target.value)} />
              <PasswordField id="admin-password" label="Password" value={password} onChange={setPassword} />
              <div className="flex items-center justify-between gap-3">
                <Label className="flex cursor-pointer items-center gap-2 font-normal"><Checkbox /> Remember me</Label>
                <Button type="button" variant="link" className="h-auto p-0" onClick={() => setError("expired")}>Forgot password?</Button>
              </div>
              <Button className="h-11 w-full" disabled={loading}>{loading ? <><Loader2 className="animate-spin" />Signing in...</> : "Sign In"}</Button>
            </form>
            <div className="mt-7 rounded-xl border border-dashed p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Demo login — prototype only</p>
              <p className="mt-1 text-xs text-muted-foreground">Not a production authentication mechanism. Roles are verified on the server in the real system.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => signIn("admin")}>Sign in as Admin</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => signIn("super-admin")}>Sign in as Super Admin</Button>
              </div>
            </div>
            <div className="mt-7 space-y-3 text-center">
              <p className="text-sm text-muted-foreground">Super administrator? <Link to="/super-admin/login" className="font-semibold text-primary hover:underline">Sign in here</Link></p>
              <p className="text-sm text-muted-foreground">Are you a student or staff member?</p>
              <Button asChild variant="outline" className="h-11 w-full"><Link to="/">Go to Student/Staff Portal</Link></Button>
              <p className="text-xs text-muted-foreground">Authorized university personnel only.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
