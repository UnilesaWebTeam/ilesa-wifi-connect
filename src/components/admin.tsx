import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  CircleHelp,
  FileBarChart,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ScrollText,
  Settings,
  ShieldCheck,
  UserCog,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { ComponentType, ReactNode, useState } from "react";
import { Brand } from "@/components/portal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { notifications, roleLabel, useAdminSession } from "@/lib/mock-admin";

type NavItem = { to: string; label: string; icon: ComponentType<{ className?: string }> };

const mainNav: NavItem[] = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Students & Staff", icon: Users },
  { to: "/admin/credentials", label: "Credentials", icon: KeyRound },
  { to: "/admin/reports", label: "Reports", icon: FileBarChart },
  { to: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
];

const superNav: NavItem[] = [
  { to: "/super-admin/dashboard", label: "System Overview", icon: ShieldCheck },
  { to: "/super-admin/admins", label: "Admin Management", icon: UserCog },
  { to: "/super-admin/settings", label: "System Settings", icon: Settings },
];

const bottomNav: NavItem[] = [
  { to: "/help", label: "Help", icon: CircleHelp },
  { to: "/admin/profile", label: "Admin Profile", icon: UserRound },
];

function initials(name: string) {
  return name.split(" ").filter((part) => !part.includes(".")).map((part) => part[0]).slice(0, 2).join("");
}

function NavLinks({ items, pathname, onNavigate }: { items: NavItem[]; pathname: string; onNavigate?: (() => void) | undefined }) {
  return (
    <>
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn("flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors", active ? "bg-primary/8 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}
          >
            <Icon className="size-[18px]" />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function AdminShell({ title, subtitle, actions, children }: { title: string; subtitle: string; actions?: ReactNode; children: ReactNode }) {
  const admin = useAdminSession();
  const pathname = useLocation({ select: (location) => location.pathname });
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const isSuper = admin.role === "super-admin";
  const unread = notifications.filter((item) => item.unread).length;
  const signOut = () => void navigate({ to: "/admin/login" });

  const sidebar = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col gap-1 p-4">
      <div className="mb-4 flex items-center justify-between px-1">
        <Brand />
        {onNavigate && <Button variant="ghost" size="icon" onClick={onNavigate} aria-label="Close navigation"><X /></Button>}
      </div>
      <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Management</p>
      <NavLinks items={mainNav} pathname={pathname} onNavigate={onNavigate} />
      {isSuper && (
        <>
          <p className="px-3 pb-2 pt-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Super Admin</p>
          <NavLinks items={superNav} pathname={pathname} onNavigate={onNavigate} />
        </>
      )}
      <div className="mt-auto space-y-1 border-t pt-4">
        <NavLinks items={bottomNav} pathname={pathname} onNavigate={onNavigate} />
        <button onClick={signOut} className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-destructive hover:bg-destructive/5">
          <LogOut className="size-[18px]" /> Logout
        </button>
        <div className="mt-3 flex items-center gap-3 rounded-lg bg-muted/60 p-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{initials(admin.name)}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{admin.name}</p>
            <p className="text-xs text-muted-foreground">{admin.department}</p>
          </div>
          <RoleBadge role={roleLabel(admin.role)} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-subtle lg:grid lg:grid-cols-[272px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r bg-card lg:block">{sidebar()}</aside>
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-overlay" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />
          <aside className="absolute left-0 top-0 h-full w-[86%] max-w-xs overflow-y-auto bg-card shadow-xl">{sidebar(() => setMenuOpen(false))}</aside>
        </div>
      )}
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu /></Button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-semibold sm:text-2xl">{title}</h1>
              <p className="hidden truncate text-sm text-muted-foreground sm:block">{subtitle}</p>
            </div>
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => { setBellOpen((value) => !value); setUserOpen(false); }} aria-label={`Notifications, ${unread} unread`}>
                <Bell />
                {unread > 0 && <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />}
              </Button>
              {bellOpen && (
                <div className="absolute right-0 top-12 z-50 w-[300px] rounded-xl border bg-card p-2 shadow-lg sm:w-[340px]">
                  <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notifications</p>
                  {notifications.map((item) => (
                    <div key={item.title} className="flex gap-3 rounded-lg px-3 py-2.5 hover:bg-muted">
                      <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", item.unread ? "bg-primary" : "bg-border")} />
                      <div><p className="text-sm leading-5">{item.title}</p><p className="mt-0.5 text-xs text-muted-foreground">{item.time}</p></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <Button variant="ghost" onClick={() => { setUserOpen((value) => !value); setBellOpen(false); }} aria-expanded={userOpen} className="h-11 px-2">
                <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{initials(admin.name)}</span>
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-semibold">{admin.name}</span>
                  <span className="block text-xs text-muted-foreground">{roleLabel(admin.role)}</span>
                </span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
              {userOpen && (
                <div className="absolute right-0 top-12 z-50 w-48 rounded-lg border bg-card p-1.5 shadow-lg">
                  <Link to="/admin/profile" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"><UserRound className="size-4" /> Admin Profile</Link>
                  <button onClick={signOut} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/5"><LogOut className="size-4" /> Logout</button>
                </div>
              )}
            </div>
          </div>
          {actions && <div className="border-t px-4 py-3 sm:px-6">{actions}</div>}
        </header>
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <p className="mb-5 text-sm text-muted-foreground sm:hidden">{subtitle}</p>
          <div className="animate-page-in space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function RoleBadge({ role }: { role: string }) {
  return <span className="ml-auto rounded-md border border-primary/20 bg-primary/8 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">{role}</span>;
}

export function StatCard({ icon: Icon, label, value, hint }: { icon: ComponentType<{ className?: string }>; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="grid size-9 place-items-center rounded-lg bg-primary/8 text-primary"><Icon className="size-[18px]" /></span>
      </div>
      <p className="mt-3 text-[28px] font-semibold leading-none tracking-tight">{value}</p>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function SectionCard({ title, description, aside, children, className }: { title: string; description?: string; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("overflow-hidden rounded-xl border bg-card shadow-soft", className)}>
      <div className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function DemoDataNote({ children = "Demo data — network integration required" }: { children?: ReactNode }) {
  return <span className="inline-flex items-center gap-2 rounded-md border border-warning/25 bg-warning/8 px-2.5 py-1 text-xs font-medium text-warning">{children}</span>;
}

export function StatusPill({ status }: { status: string }) {
  const tone =
    ["Active", "Assigned", "Online", "Successful", "Available"].includes(status) ? "success"
      : ["Pending", "Idle", "Inactive"].includes(status) ? "warning"
        : ["Disabled", "Compromised", "Failed"].includes(status) ? "error" : "muted";
  return (
    <span className={cn("inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold",
      tone === "success" && "border-success/20 bg-success/8 text-success",
      tone === "warning" && "border-warning/25 bg-warning/8 text-warning",
      tone === "error" && "border-destructive/20 bg-destructive/8 text-destructive",
      tone === "muted" && "border-border bg-muted text-muted-foreground")}
    >
      <span className={cn("size-1.5 rounded-full", tone === "success" && "bg-success", tone === "warning" && "bg-warning", tone === "error" && "bg-destructive", tone === "muted" && "bg-muted-foreground")} />
      {status}
    </span>
  );
}

export function SearchField({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <div className="relative min-w-0 flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label={placeholder} className="h-11 bg-card pl-9" />
    </div>
  );
}

export function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-11 min-w-[150px] bg-card" aria-label={label}><SelectValue placeholder={label} /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All {label}</SelectItem>
        {options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3 border-b px-5 py-4 sm:px-6 lg:flex-row lg:flex-wrap lg:items-center">{children}</div>;
}

export function DataTable({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-left">
            {head.map((column) => <th key={column} className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{column}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn("whitespace-nowrap px-5 py-3.5 text-[13px]", className)}>{children}</td>;
}

export function EmptyState({ title, description, icon: Icon = Inbox }: { title: string; description: string; icon?: ComponentType<{ className?: string }> }) {
  return (
    <div className="px-6 py-14 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-muted text-muted-foreground"><Icon className="size-5" /></span>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function TablePagination({ page, pageCount, total, onPage }: { page: number; pageCount: number; total: number; onPage: (page: number) => void }) {
  return (
    <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-xs text-muted-foreground">Page {page} of {Math.max(pageCount, 1)} · {total} records</p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</Button>
        <Button variant="outline" size="sm" disabled={page >= pageCount} onClick={() => onPage(page + 1)}>Next</Button>
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel, onConfirm, destructive = true }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; description: string; confirmLabel: string; onConfirm: () => void; destructive?: boolean }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant={destructive ? "destructive" : "default"} onClick={() => { onConfirm(); onOpenChange(false); }}>{confirmLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function LabeledField({ label, children }: { label: string; children: ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}

export function DetailList({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="grid sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="border-b px-5 py-4 sm:px-6 sm:even:border-l">
          <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
          <dd className="mt-1 text-sm font-semibold">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
