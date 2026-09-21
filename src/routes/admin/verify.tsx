import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { Brand, FormAlert } from "@/components/portal";
import { Button } from "@/components/ui/button";
import { AdminRole, setAdminSession } from "@/lib/mock-admin";

export const Route = createFileRoute("/admin/verify")({
  validateSearch: (search: Record<string, unknown>) => ({
    role: search["role"] === "super-admin" ? ("super-admin" as AdminRole) : ("admin" as AdminRole),
  }),
  head: () => ({
    meta: [
      { title: "Admin Verification — University of Ilesa Wi-Fi" },
      { name: "description", content: "Enter the one-time code sent to your administrator email to complete sign in." },
      { property: "og:title", content: "Administrator Verification" },
      { property: "og:description", content: "Two-step verification for University of Ilesa Wi-Fi administrators." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminVerifyPage,
});

function AdminVerifyPage() {
  const { role } = Route.useSearch();
  const navigate = useNavigate();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(42);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<"incorrect" | "expired" | null>(null);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  const update = (index: number, value: string) => {
    const next = [...digits];
    next[index] = value.slice(-1).replace(/\D/g, "");
    setDigits(next);
    if (next[index] && index < 5) refs.current[index + 1]?.focus();
  };

  const verify = () => {
    setError(null);
    const code = digits.join("");
    if (code !== "482173") { setError(code === "000000" ? "expired" : "incorrect"); return; }
    setLoading(true);
    setAdminSession(role);
    window.setTimeout(() => void navigate({ to: role === "super-admin" ? "/super-admin/dashboard" : "/admin/dashboard" }), 700);
  };

  const backTo = role === "super-admin" ? "/super-admin/login" : "/admin/login";
  const maskedEmail = role === "super-admin" ? "s•••••@unilesa.edu.ng" : "j•••••@unilesa.edu.ng";

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between px-5 py-5 sm:px-8"><Brand /></header>
      <div className="flex flex-1 items-center justify-center px-5 pb-12 sm:px-8">
        <div className="w-full max-w-[460px] animate-page-in">
          <div className="text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-primary"><ShieldCheck /></span>
            <h1 className="mt-5 text-3xl font-semibold">Two-step verification</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              For your security, we’ve sent a one-time code to <strong className="text-foreground">{maskedEmail}</strong>. Enter it to finish signing in as {role === "super-admin" ? "Super Admin" : "Admin"}.
            </p>
          </div>
          <div className="mt-8 space-y-5">
            {error && <FormAlert title={error === "expired" ? "This code has expired" : "Incorrect verification code"}>{error === "expired" ? "Request a new code and try again." : "That verification code is incorrect. Please try again."}</FormAlert>}
            <div className="grid grid-cols-6 gap-2" aria-label="Six-digit administrator code">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(node) => { refs.current[index] = node; }}
                  value={digit}
                  onChange={(event) => update(index, event.target.value)}
                  onKeyDown={(event) => { if (event.key === "Backspace" && !digit && index > 0) refs.current[index - 1]?.focus(); }}
                  inputMode="numeric"
                  aria-label={`Digit ${index + 1}`}
                  className="h-12 min-w-0 rounded-lg border bg-card text-center text-lg font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              ))}
            </div>
            <Button className="h-11 w-full" onClick={verify} disabled={loading}>{loading ? <><Loader2 className="animate-spin" />Verifying...</> : "Verify and continue"}</Button>
            <div className="text-center text-sm text-muted-foreground">
              <p>Didn’t receive the code?</p>
              {seconds > 0 ? <p className="mt-1">Resend available in 00:{String(seconds).padStart(2, "0")}</p> : <Button variant="link" className="h-auto p-0" onClick={() => setSeconds(42)}>Resend code</Button>}
              <p className="mt-4"><Link to={backTo} className="font-semibold text-primary hover:underline">Back to sign in</Link></p>
            </div>
            <p className="rounded-lg bg-muted p-3 text-center text-xs text-muted-foreground">Prototype code: 482173. Use 000000 to preview an expired code.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
