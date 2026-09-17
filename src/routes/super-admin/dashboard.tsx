import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ScrollText, UserCog, Users } from "lucide-react";
import { AdminShell, StatCard } from "@/components/admin";
import { DashboardBody } from "@/routes/admin/dashboard";
import { wifiStats } from "@/lib/mock-admin";

export const Route = createFileRoute("/super-admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Super Admin Dashboard — University of Ilesa Wi-Fi" },
      { name: "description", content: "System-wide overview of administrators, alerts, audit activity and Wi-Fi credential usage." },
      { property: "og:title", content: "Super Admin System Overview" },
      { property: "og:description", content: "System-wide overview and administration for the university Wi-Fi platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SuperAdminDashboardPage,
});

function SuperAdminDashboardPage() {
  return (
    <AdminShell title="Super Admin Dashboard" subtitle="System-wide overview and administration.">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={UserCog} label="Total Admins" value={String(wifiStats.totalAdmins)} hint="Administrator accounts" />
        <StatCard icon={Users} label="Active Admins" value={String(wifiStats.activeAdmins)} hint="Currently enabled" />
        <StatCard icon={AlertTriangle} label="System Alerts" value={String(wifiStats.systemAlerts)} hint="Require attention" />
        <StatCard icon={ScrollText} label="Audit Events Today" value={String(wifiStats.auditEventsToday)} hint="Recorded administrative actions" />
      </section>
      <DashboardBody />
    </AdminShell>
  );
}
