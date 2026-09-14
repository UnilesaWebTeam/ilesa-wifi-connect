import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell, RegistrationForm } from "@/components/portal";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register — University of Ilesa Wi-Fi" }, { name: "description", content: "Register your university identity for Wi-Fi access." }, { property: "og:title", content: "Register for University Wi-Fi" }, { property: "og:description", content: "Create your University of Ilesa Wi-Fi portal account." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: RegisterPage,
});
function RegisterPage() { return <AuthShell step="Step 1 of 3"><div className="mb-7"><p className="mb-2 text-sm font-semibold text-primary">Get started</p><h1 className="text-3xl font-semibold">Create your account</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Register to access your university Wi-Fi credentials.</p></div><RegistrationForm /><p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link to="/" className="font-semibold text-primary hover:underline">Sign in</Link></p></AuthShell>; }
