import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, Users, Wifi } from "lucide-react";
import { AdminShell, StatCard } from "@/components/admin";
import { wifiStats } from "@/lib/mock-admin";

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

export function DashboardBody() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard icon={Users} label="Total Users" value={wifiStats.totalUsers.toLocaleString()} hint="Students and staff registered" />
      <StatCard icon={KeyRound} label="Credentials Assigned" value={wifiStats.credentialsAssigned.toLocaleString()} hint={`of ${wifiStats.totalCredentials.toLocaleString()} credentials`} />
      <StatCard icon={Wifi} label="Available Credentials" value={wifiStats.credentialsAvailable.toLocaleString()} hint="Ready for allocation" />
    </section>
  );
}

function AdminDashboardPage() {
  return (
    <AdminShell title="Dashboard" subtitle="Overview of the university Wi-Fi credential system.">
      <DashboardBody />
    </AdminShell>
  );
}
