import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clipboard,
  Copy,
  Eye,
  EyeOff,
  Home,
  KeyRound,
  Loader2,
  LockKeyhole,
  LogOut,
  Menu,
  ShieldCheck,
  UserRound,
  Wifi,
  X,
} from "lucide-react";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { departments, faculties, PortalUser, students, UserType, WifiCredential, wifiCredential } from "@/lib/mock-portal";

export function Brand({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", inverse && "text-brand-foreground")}>
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-lg bg-primary font-bold text-primary-foreground shadow-sm", inverse && "bg-brand-foreground text-primary")} aria-hidden="true">UI</span>
      {!compact && <span className="text-[15px] font-semibold leading-tight">University of Ilesa</span>}
    </div>
  );
}

export function UserTypeTabs({ value, onChange }: { value: UserType; onChange: (type: UserType) => void }) {
  return (
    <div className="grid grid-cols-2 rounded-lg bg-muted p-1" role="tablist" aria-label="Account type">
      {(["student", "staff"] as const).map((type) => (
        <button
          key={type}
          type="button"
          role="tab"
          aria-selected={value === type}
          onClick={() => onChange(type)}
          className={cn("h-10 rounded-md text-sm font-semibold capitalize transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", value === type ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}
        >
          {type}
        </button>
      ))}
    </div>
  );
}

export function Field({ label, id, error, optional, ...props }: React.ComponentProps<typeof Input> & { label: string; error?: string; optional?: boolean }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {optional && <span className="text-xs text-muted-foreground">Optional</span>}
      </div>
      <Input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="h-11 bg-card" {...props} />
      {error && <p id={`${id}-error`} className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

export function PasswordField({ label, id, value, onChange, placeholder = "Enter your password", error }: { label: string; id: string; value: string; onChange: (value: string) => void; placeholder?: string; error?: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input id={id} type={visible ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-invalid={Boolean(error)} className="h-11 bg-card pr-11" />
        <Button type="button" variant="ghost" size="icon" onClick={() => setVisible((current) => !current)} className="absolute right-1 top-1 size-9" aria-label={visible ? "Hide password" : "Show password"} title={visible ? "Hide password" : "Show password"}>
          {visible ? <EyeOff /> : <Eye />}
        </Button>
      </div>
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

export function FormAlert({ title, children, tone = "error" }: { title: string; children: ReactNode; tone?: "error" | "info" | "success" }) {
  const Icon = tone === "success" ? CheckCircle2 : tone === "info" ? ShieldCheck : AlertCircle;
  return (
    <div role="alert" className={cn("flex gap-3 rounded-lg border p-3.5 text-sm", tone === "error" && "border-destructive/20 bg-destructive/5 text-destructive", tone === "info" && "border-primary/15 bg-primary/5 text-foreground", tone === "success" && "border-success/20 bg-success/5 text-foreground")}>
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div><p className="font-semibold">{title}</p><div className="mt-0.5 text-muted-foreground">{children}</div></div>
    </div>
  );
}

export function AuthShell({ children, step }: { children: ReactNode; step?: string }) {
  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-[45%_55%]">
      <section className="auth-visual relative hidden min-h-screen overflow-hidden p-10 lg:flex lg:flex-col" aria-label="University Wi-Fi portal">
        <Brand inverse />
        <div className="my-auto max-w-md">
          <div className="mb-8 grid size-20 place-items-center rounded-2xl border border-brand-foreground/20 bg-brand-foreground/10">
            <Wifi className="size-10 text-brand-foreground" strokeWidth={1.6} />
          </div>
          <h1 className="max-w-sm text-4xl font-semibold leading-tight text-brand-foreground">Secure access to your university Wi-Fi.</h1>
          <p className="mt-5 max-w-sm text-base leading-7 text-brand-foreground/75">Sign in to view the Wi-Fi credentials assigned to your account.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-brand-foreground/65"><ShieldCheck className="size-4" /> Official University of Ilesa system</div>
      </section>
      <section className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-5 py-5 lg:hidden"><Brand />{step && <span className="text-xs font-medium text-muted-foreground">{step}</span>}</header>
        <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
          <div className="w-full max-w-[460px] animate-page-in">{children}</div>
        </div>
      </section>
    </main>
  );
}

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/credentials", label: "Wi-Fi Credentials", icon: KeyRound },
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/help", label: "Help", icon: CircleHelp },
] as const;

export function PortalShell({ children, user = students.student }: { children: ReactNode; user?: PortalUser }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [timeoutOpen, setTimeoutOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useLocation({ select: (location) => location.pathname });

  useEffect(() => {
    const warning = window.setTimeout(() => setTimeoutOpen(true), 240000);
    return () => window.clearTimeout(warning);
  }, []);

  const signOut = () => void navigate({ to: "/" });

  return (
    <div className="min-h-screen bg-subtle">
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-17 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8"><Brand />
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
              {navItems.map((item) => <Link key={item.to} to={item.to} className={cn("rounded-md px-3 py-2 text-sm font-medium transition-colors", pathname === item.to ? "bg-primary/8 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>{item.label}</Link>)}
            </nav>
          </div>
          <div className="relative hidden lg:block">
            <Button variant="ghost" onClick={() => setUserOpen((value) => !value)} aria-expanded={userOpen} className="h-11 px-2">
              <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{user.name.split(" ").map((part) => part[0]).join("")}</span>
              <span className="text-left"><span className="block text-sm font-semibold">{user.name}</span><span className="block text-xs capitalize text-muted-foreground">{user.type}</span></span><ChevronDown className="size-4 text-muted-foreground" />
            </Button>
            {userOpen && <div className="absolute right-0 top-12 w-44 rounded-lg border bg-card p-1.5 shadow-lg"><Link to="/profile" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"><UserRound className="size-4" /> Profile</Link><button onClick={signOut} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/5"><LogOut className="size-4" /> Sign out</button></div>}
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu /></Button>
        </div>
      </header>
      {menuOpen && <div className="fixed inset-0 z-50 lg:hidden"><button className="absolute inset-0 bg-overlay" onClick={() => setMenuOpen(false)} aria-label="Close navigation" /><aside className="absolute right-0 top-0 flex h-full w-[84%] max-w-sm flex-col bg-card p-5 shadow-xl"><div className="flex items-center justify-between"><Brand /><Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X /></Button></div><nav className="mt-8 space-y-1">{navItems.map((item) => { const Icon = item.icon; return <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className={cn("flex h-12 items-center gap-3 rounded-lg px-3 text-sm font-semibold", pathname === item.to ? "bg-primary/8 text-primary" : "text-muted-foreground")}><Icon className="size-5" />{item.label}</Link>; })}</nav><div className="mt-auto border-t pt-4"><div className="mb-3 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">IS</span><div><p className="text-sm font-semibold">{user.name}</p><p className="text-xs capitalize text-muted-foreground">{user.type}</p></div></div><Button variant="outline" className="h-11 w-full justify-start text-destructive" onClick={signOut}><LogOut /> Sign out</Button></div></aside></div>}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">{children}</main>
      <Dialog open={timeoutOpen} onOpenChange={setTimeoutOpen}><DialogContent><DialogHeader><DialogTitle>Your session is about to expire</DialogTitle><DialogDescription>For your security, you’ll be signed out after a period of inactivity.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={signOut}>Sign out</Button><Button onClick={() => setTimeoutOpen(false)}>Stay signed in</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
}

export function PageHeading({ title, description, badge }: { title: string; description: string; badge?: ReactNode }) {
  return <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">{title}</h1><p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">{description}</p></div>{badge}</div>;
}

export function StatusBadge({ children = "Active" }: { children?: ReactNode }) {
  return <span className="inline-flex w-fit items-center gap-2 rounded-full border border-success/20 bg-success/8 px-3 py-1.5 text-xs font-semibold text-success"><span className="size-2 rounded-full bg-success" />{children}</span>;
}

async function copyValue(value: string, label: string) {
  await navigator.clipboard.writeText(value);
  toast.success(`${label} copied`, { description: "Ready to paste into your Wi-Fi settings." });
}

export function CredentialCard({ credential = wifiCredential, user = students.student, detailed = false }: { credential?: WifiCredential; user?: PortalUser; detailed?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const reveal = () => visible ? setVisible(false) : setConfirmOpen(true);
  return (
    <section className="credential-card overflow-hidden rounded-xl border bg-card shadow-soft">
      <div className="flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-7"><div><div className="mb-2 flex items-center gap-2 text-primary"><Wifi className="size-5" /><span className="text-xs font-bold uppercase tracking-wide">University-WiFi</span></div><h2 className="text-xl font-semibold">Your Wi-Fi Credentials</h2><p className="mt-1 text-sm text-muted-foreground">Use these details to connect to the university Wi-Fi network.</p></div><StatusBadge /></div>
      <div className="grid gap-5 p-5 sm:p-7 md:grid-cols-2">
        <CredentialValue label="Wi-Fi username" value={credential.username} action={<Button variant="outline" size="sm" onClick={() => copyValue(credential.username, "Username")}><Copy /> Copy</Button>} />
        <CredentialValue label="Password" value={visible ? credential.password : "••••••••••••••"} action={<div className="flex gap-1"><Button variant="ghost" size="icon" onClick={reveal} aria-label={visible ? "Hide Wi-Fi password" : "Show Wi-Fi password"} title={visible ? "Hide password" : "Show password"}>{visible ? <EyeOff /> : <Eye />}</Button><Button variant="outline" size="sm" onClick={() => copyValue(credential.password, "Password")}><Copy /> Copy</Button></div>} />
      </div>
      {detailed && <div className="grid gap-4 border-t px-5 py-5 text-sm sm:grid-cols-2 sm:px-7"><div><p className="text-xs font-medium text-muted-foreground">Assigned to</p><p className="mt-1 font-semibold">{user.universityId}</p></div><div><p className="text-xs font-medium text-muted-foreground">Assigned on</p><p className="mt-1 font-semibold">{credential.assignedAt}</p></div></div>}
      <div className="flex flex-col gap-3 border-t bg-warning/5 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-7"><div className="flex gap-2 text-muted-foreground"><LockKeyhole className="mt-0.5 size-4 shrink-0 text-warning" /><span>Keep these credentials private. Do not share them with others.</span></div>{detailed && <Button variant="outline" size="sm" onClick={() => copyValue(`Network: ${credential.network}\nUsername: ${credential.username}\nPassword: ${credential.password}`, "Credentials")}><Clipboard /> Copy all</Button>}</div>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}><DialogContent><DialogHeader><DialogTitle>Reveal Wi-Fi password?</DialogTitle><DialogDescription>Make sure no one else can see your screen before showing your password.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button><Button onClick={() => { setVisible(true); setConfirmOpen(false); }}>Reveal password</Button></DialogFooter></DialogContent></Dialog>
    </section>
  );
}

function CredentialValue({ label, value, action }: { label: string; value: string; action: ReactNode }) {
  return <div className="min-w-0 rounded-lg bg-muted/60 p-4"><p className="text-xs font-medium text-muted-foreground">{label}</p><div className="mt-2 flex min-h-9 items-center justify-between gap-3"><p className="truncate font-mono text-[15px] font-semibold tracking-wide" title={value}>{value}</p>{action}</div></div>;
}

export function PendingCredential() {
  return <div className="rounded-xl border bg-card px-6 py-12 text-center shadow-soft"><span className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-primary"><Loader2 className="size-6 animate-spin" /></span><h2 className="mt-5 text-lg font-semibold">Your Wi-Fi credential is being prepared</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">Your account has been successfully verified. Your Wi-Fi credential will appear here once it has been assigned.</p></div>;
}

export function RegistrationForm() {
  const [type, setType] = useState<UserType>("student");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSubmitted(true);
    const form = new FormData(event.currentTarget);
    if (!form.get("universityId") || !form.get("email") || !form.get("firstName") || !form.get("lastName") || !form.get("department") || !form.get("faculty") || !form.get("confirm")) return;
    setLoading(true); window.setTimeout(() => void navigate({ to: "/verify", search: { type } }), 800);
  };
  return <form onSubmit={submit} className="space-y-5" noValidate><UserTypeTabs value={type} onChange={(value) => { setType(value); setSubmitted(false); }} /><div className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><Field id="universityId" name="universityId" label={type === "student" ? "Matriculation Number" : "Staff ID"} placeholder={type === "student" ? "Enter your matriculation number" : "Enter your staff ID"} error={submitted ? "Enter your university ID." : undefined} /></div><div className="sm:col-span-2"><Field id="email" name="email" type="email" label="University Email" placeholder="Enter your university email address" error={submitted ? "Enter your university email address." : undefined} /></div><Field id="firstName" name="firstName" label="First Name" placeholder="First name" error={submitted ? "Enter your first name." : undefined} /><Field id="lastName" name="lastName" label="Last Name" placeholder="Last name" error={submitted ? "Enter your last name." : undefined} /><PortalSelect name="department" label="Department" placeholder="Select department" values={departments} /><PortalSelect name="faculty" label={type === "student" ? "Faculty" : "Faculty / Unit"} placeholder="Select faculty or unit" values={faculties} /><div className="sm:col-span-2"><Field id="phone" name="phone" label="Phone Number" placeholder="e.g. 0801 234 5678" optional /></div></div><label className="flex cursor-pointer items-start gap-3 text-sm leading-5"><Checkbox name="confirm" value="yes" className="mt-0.5" /><span>I confirm that the information provided belongs to me.</span></label>{submitted && <FormAlert title="Check your information">Please complete the required fields and confirm the information belongs to you.</FormAlert>}<Button className="h-11 w-full" disabled={loading}>{loading ? <><Loader2 className="animate-spin" />Registering...</> : "Continue"}</Button></form>;
}

function PortalSelect({ name, label, placeholder, values }: { name: string; label: string; placeholder: string; values: string[] }) {
  return <div className="space-y-2"><Label>{label}</Label><Select name={name}><SelectTrigger className="h-11 bg-card"><SelectValue placeholder={placeholder} /></SelectTrigger><SelectContent>{values.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>;
}

export function PasswordRequirements({ password }: { password: string }) {
  const checks = useMemo(() => [
    ["At least 8 characters", password.length >= 8],
    ["Uppercase and lowercase letters", /[a-z]/.test(password) && /[A-Z]/.test(password)],
    ["A number", /\d/.test(password)],
    ["A special character", /[^A-Za-z0-9]/.test(password)],
  ] as const, [password]);
  const strength = checks.filter((item) => item[1]).length;
  return <div><div className="mb-3 flex gap-1.5" aria-label={`Password strength: ${strength < 2 ? "Weak" : strength < 4 ? "Fair" : "Strong"}`}>{[1,2,3,4].map((item) => <span key={item} className={cn("h-1.5 flex-1 rounded-full", item <= strength ? strength === 4 ? "bg-success" : "bg-warning" : "bg-muted")} />)}</div><div className="grid gap-2 sm:grid-cols-2">{checks.map(([label, passed]) => <p key={label} className={cn("flex items-center gap-2 text-xs", passed ? "text-success" : "text-muted-foreground")}><span className={cn("grid size-4 place-items-center rounded-full border", passed && "border-success bg-success text-success-foreground")}>{passed && <Check className="size-3" />}</span>{label}</p>)}</div></div>;
}