import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, Users, Wifi, X } from "lucide-react";
import { useState } from "react";
import { AdminShell, DemoDataNote, SectionCard, StatCard } from "@/components/admin";
import { adminFaculties, credentialPool, managedUsers, wifiStats } from "@/lib/mock-admin";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — University of Ilesa Wi-Fi" },
      { name: "description", content: "Overview of University of Ilesa Wi-Fi users and credential allocation." },
      { property: "og:title", content: "Wi-Fi Administration Dashboard" },
      { property: "og:description", content: "Monitor users, credentials and Wi-Fi activity across the university." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminDashboardPage,
});

type StatKey = "users" | "assigned" | "available";

const statTitles: Record<StatKey, string> = {
  users: "Total users",
  assigned: "Credentials assigned",
  available: "Available credentials",
};

const studentCount = managedUsers.filter((u) => u.type === "Student").length;
const staffCount = managedUsers.filter((u) => u.type === "Staff").length;
const activeAccounts = managedUsers.filter((u) => u.accountStatus === "Active").length;
const inactiveAccounts = managedUsers.filter((u) => u.accountStatus === "Inactive").length;
const activeCredentials = Math.max(wifiStats.credentialsAssigned - wifiStats.disabledCredentials - wifiStats.compromisedCredentials, 0);
const sampleSize = managedUsers.length || 1;
const scale = (sample: number, total: number) => Math.round((sample / sampleSize) * total);

const facultyCounts = adminFaculties
  .map((faculty) => ({ faculty, count: managedUsers.filter((u) => u.faculty === faculty).length }))
  .filter((entry) => entry.count > 0)
  .sort((a, b) => b.count - a.count);

const topFaculties = facultyCounts.slice(0, 4);
const otherFacultyCount = facultyCounts.slice(4).reduce((sum, entry) => sum + entry.count, 0);

const recentlyAssigned = credentialPool.filter((entry) => entry.status === "Assigned").slice(0, 4);
const availablePool = credentialPool.filter((entry) => entry.status === "Available").slice(0, 4);
const recentRegistrations = managedUsers.slice(0, 4);

function DistributionRow({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-foreground/80">{label}</span>
        <span className="shrink-0 font-semibold tabular-nums">
          {count.toLocaleString()}
          <span className="ml-1 text-xs font-normal text-muted-foreground">({pct}%)</span>
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary/70" style={{ width: `${Math.max(pct, 2)}%` }} />
      </div>
    </div>
  );
}

function InfoRow({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "warning" | "destructive" }) {
  const toneClass = tone === "warning" ? "text-warning" : tone === "destructive" ? "text-destructive" : "font-semibold";
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 py-2.5 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={`tabular-nums ${toneClass}`}>{value}</span>
    </div>
  );
}

function RecentList({ title, items }: { title: string; items: { primary: string; secondary: string; meta: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={`${item.primary}-${item.meta}`} className="flex items-center justify-between gap-3 rounded-lg border bg-background/50 px-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{item.primary}</p>
              <p className="truncate text-xs text-muted-foreground">{item.secondary}</p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">{item.meta}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatDetails({ stat }: { stat: StatKey }) {
  if (stat === "users") {
    return (
      <SectionCard
        title="Total users — breakdown"
        description="How registered students and staff are distributed across the university."
        aside={<DemoDataNote />}
      >
        <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Distribution</h3>
            <DistributionRow label="Students" count={scale(studentCount, wifiStats.totalUsers)} total={wifiStats.totalUsers} />
            <DistributionRow label="Staff" count={scale(staffCount, wifiStats.totalUsers)} total={wifiStats.totalUsers} />
            <DistributionRow label="Active accounts" count={scale(activeAccounts, wifiStats.totalUsers)} total={wifiStats.totalUsers} />
            <DistributionRow label="Inactive accounts" count={scale(inactiveAccounts, wifiStats.totalUsers)} total={wifiStats.totalUsers} />
            {topFaculties.map((entry) => (
              <DistributionRow key={entry.faculty} label={entry.faculty} count={scale(entry.count, wifiStats.totalUsers)} total={wifiStats.totalUsers} />
            ))}
            {otherFacultyCount > 0 && (
              <DistributionRow label="Other faculties & units" count={scale(otherFacultyCount, wifiStats.totalUsers)} total={wifiStats.totalUsers} />
            )}
          </div>
          <RecentList
            title="Recent registrations"
            items={recentRegistrations.map((user) => ({
              primary: user.name,
              secondary: `${user.type} — ${user.department}`,
              meta: user.registeredAt,
            }))}
          />
        </div>
      </SectionCard>
    );
  }

  if (stat === "assigned") {
    return (
      <SectionCard
        title="Credentials assigned — breakdown"
        description="How allocated credentials are spread across account types and statuses."
        aside={<DemoDataNote />}
      >
        <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Distribution</h3>
            <DistributionRow label="Assigned to students" count={scale(studentCount, wifiStats.credentialsAssigned)} total={wifiStats.credentialsAssigned} />
            <DistributionRow label="Assigned to staff" count={scale(staffCount, wifiStats.credentialsAssigned)} total={wifiStats.credentialsAssigned} />
            <DistributionRow label="Active credentials" count={activeCredentials} total={wifiStats.credentialsAssigned} />
            <DistributionRow label="Disabled credentials" count={wifiStats.disabledCredentials} total={wifiStats.credentialsAssigned} />
            <DistributionRow label="Compromised credentials" count={wifiStats.compromisedCredentials} total={wifiStats.credentialsAssigned} />
          </div>
          <RecentList
            title="Recently assigned credentials"
            items={recentlyAssigned.map((entry) => ({
              primary: entry.reference,
              secondary: entry.assignedUser ?? "",
              meta: entry.assignedAt,
            }))}
          />
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Available credentials"
      description="Credentials ready for allocation to new student and staff accounts."
      aside={<DemoDataNote />}
    >
      <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-2">
        <div className="space-y-1">
          <h3 className="mb-3 text-sm font-semibold">Pool summary</h3>
          <InfoRow label="Ready for allocation" value={wifiStats.credentialsAvailable.toLocaleString()} />
          <InfoRow label="Next allocation batch" value="500 — September intake" />
          <InfoRow label="Disabled, pending review" value={wifiStats.disabledCredentials.toLocaleString()} tone="warning" />
          <InfoRow label="Compromised, quarantined" value={wifiStats.compromisedCredentials.toLocaleString()} tone="destructive" />
          <p className="pt-3 text-xs text-muted-foreground">
            New credential batches are generated by the network provider and released to the ICT unit for allocation.
          </p>
        </div>
        <RecentList
          title="Available credential references"
          items={availablePool.map((entry) => ({
            primary: entry.reference,
            secondary: "Unassigned — ready for allocation",
            meta: "Available",
          }))}
        />
      </div>
    </SectionCard>
  );
}

export function DashboardBody() {
  const [selected, setSelected] = useState<StatKey>("users");
  const toggle = (key: StatKey) => setSelected((current) => (current === key ? current : key));

  return (
    <div className="space-y-6" aria-live="polite">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          icon={Users}
          label="Total Users"
          value={wifiStats.totalUsers.toLocaleString()}
          hint="Students and staff registered"
          onClick={() => toggle("users")}
          active={selected === "users"}
        />
        <StatCard
          icon={KeyRound}
          label="Credentials Assigned"
          value={wifiStats.credentialsAssigned.toLocaleString()}
          hint={`of ${wifiStats.totalCredentials.toLocaleString()} credentials`}
          onClick={() => toggle("assigned")}
          active={selected === "assigned"}
        />
        <StatCard
          icon={Wifi}
          label="Available Credentials"
          value={wifiStats.credentialsAvailable.toLocaleString()}
          hint="Ready for allocation"
          onClick={() => toggle("available")}
          active={selected === "available"}
        />
      </section>
      <StatDetails stat={selected} />
    </div>
  );
}

function AdminDashboardPage() {
  return (
    <AdminShell title="Dashboard" subtitle="Overview of the university Wi-Fi credential system.">
      <DashboardBody />
    </AdminShell>
  );
}
