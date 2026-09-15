import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { AuthShell, FormAlert } from "@/components/portal";
import { Button } from "@/components/ui/button";
import { students, UserType } from "@/lib/mock-portal";

export const Route = createFileRoute("/login-verify")({
  validateSearch: (search: Record<string, unknown>) => ({ type: search["type"] === "staff" ? ("staff" as UserType) : ("student" as UserType) }),
  head: () => ({
    meta: [
      { title: "Confirm Sign In — University of Ilesa Wi-Fi" },
      { name: "description", content: "Confirm your sign in with a one-time code before viewing your Wi-Fi credential." },
      { property: "og:title", content: "Confirm Your Sign In" },
      { property: "og:description", content: "Enter the one-time code sent to your email to view your Wi-Fi credential." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginVerifyPage,
});

function LoginVerifyPage() {
  const { type } = Route.useSearch();
  const navigate = useNavigate();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(42);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<"incorrect" | "expired" | null>(null);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => { if (seconds <= 0) return; const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000); return () => window.clearInterval(timer); }, [seconds]);

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
    window.setTimeout(() => void navigate({ to: "/dashboard", search: { type } }), 700);
  };

  return (
    <AuthShell>
      <div className="text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-primary"><ShieldCheck /></span>
        <h1 className="mt-5 text-3xl font-semibold">Confirm it’s you</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">For your security, we’ve sent a one-time code to <strong className="text-foreground">{students[type].email}</strong>. Enter it to view your Wi-Fi credential.</p>
      </div>
      <div className="mt-8 space-y-5">
        {error && <FormAlert title={error === "expired" ? "This code has expired" : "Incorrect verification code"}>{error === "expired" ? "Request a new code and try again." : "That verification code is incorrect. Please try again."}</FormAlert>}
        <div className="grid grid-cols-6 gap-2" aria-label="Six-digit sign in code">
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
          <p className="mt-4"><Link to="/" className="font-semibold text-primary hover:underline">Back to sign in</Link></p>
        </div>
        <p className="rounded-lg bg-muted p-3 text-center text-xs text-muted-foreground">Prototype code: 482173. Use 000000 to preview an expired code.</p>
      </div>
    </AuthShell>
  );
}
