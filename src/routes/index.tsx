import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";
import { AuthShell, Field, FormAlert, PasswordField, UserTypeTabs } from "@/components/portal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UserType } from "@/lib/mock-portal";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Sign In — University of Ilesa Wi-Fi" }, { name: "description", content: "Sign in to view your University of Ilesa Wi-Fi credential." }, { property: "og:title", content: "University of Ilesa Wi-Fi Portal" }, { property: "og:description", content: "Secure student and staff access to university Wi-Fi credentials." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  const [type, setType] = useState<UserType>("student");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submit = (event: FormEvent) => { event.preventDefault(); setError(false); if (!id || !password) { setError(true); return; } setLoading(true); window.setTimeout(() => void navigate({ to: "/dashboard", search: { type } }), 700); };
  return (
    <AuthShell><div className="mb-8"><p className="mb-2 text-sm font-semibold text-primary">Wi-Fi Credential Portal</p><h1 className="text-3xl font-semibold">Welcome back</h1><p className="mt-2 text-sm text-muted-foreground">Sign in to access your Wi-Fi credentials.</p></div><form onSubmit={submit} className="space-y-5"><UserTypeTabs value={type} onChange={setType} />{error && <FormAlert title="Unable to sign in">Please check your university ID and password and try again.</FormAlert>}<Field id="university-id" label={type === "student" ? "Matriculation Number" : "Staff ID"} placeholder={type === "student" ? "Enter your matriculation number" : "Enter your staff ID"} value={id} onChange={(event) => setId(event.target.value)} /><PasswordField id="password" label="Password" value={password} onChange={setPassword} /><div className="flex items-center justify-between gap-3"><Label className="flex cursor-pointer items-center gap-2 font-normal"><Checkbox /> Remember me</Label><Dialog><DialogTrigger asChild><Button type="button" variant="link" className="h-auto p-0">Forgot password?</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Reset your password</DialogTitle><DialogDescription>Enter your university email and we’ll send you secure reset instructions.</DialogDescription></DialogHeader><Field id="reset-email" label="University Email" type="email" placeholder="Enter your university email" /><DialogFooter><Button>Send reset link</Button></DialogFooter></DialogContent></Dialog></div><Button className="h-11 w-full" disabled={loading}>{loading ? <><Loader2 className="animate-spin" />Signing in...</> : "Sign In"}</Button></form><p className="mt-7 text-center text-sm text-muted-foreground">Don’t have an account? <Link to="/register" className="font-semibold text-primary hover:underline">Register here</Link></p></AuthShell>
  );
}
