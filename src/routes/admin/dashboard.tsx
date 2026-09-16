import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, KeyRound, Users, Wifi } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AdminShell, DataTable, DemoDataNote, EmptyState, SectionCard, StatCard, StatusPill, Td } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { activitySummary, connectedUsers, connectionSeries, wifiStats } from "@/lib/mock-admin";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — University of Ilesa Wi-Fi" },
      { name: "description", content: "Overview of University of Ilesa Wi-Fi users, credential allocation and current network activity." },
      { property: "og:title", content: "Wi-Fi Administration Dashboard" },
      { property: "og:description", content: "Monitor users, credentials and Wi-Fi activity across the university." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminDashboardPage,
});

export function DashboardBody() {
  const preview = connectedUsers.slice(0, 8);
  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={wifiStats.totalUsers.toLocaleString()} hint="Students and staff registered" />
        <StatCard icon={KeyRound} label="Credentials Assigned" value={wifiStats.credentialsAssigned.toLocaleString()} hint={`of ${wifiStats.totalCredentials.toLocaleString()} credentials`} />
        <StatCard icon={Wifi} label="Available Credentials" value={wifiStats.credentialsAvailable.toLocaleString()} hint="Ready for allocation" />
        <StatCard icon={Activity} label="Currently Online" value={wifiStats.currentlyOnline.toLocaleString()} hint="Active Wi-Fi sessions" />
      </section>

      <SectionCard
        title="Currently Connected"
        description="Students and staff currently connected to the university Wi-Fi."
        aside={<DemoDataNote />}
      >
        <div className="grid gap-4 border-b p-5 sm:grid-cols-3 sm:p-6">
          <div><p className="text-sm text-muted-foreground">Users online</p><p className="mt-1 text-2xl font-semibold">{wifiStats.currentlyOnline.toLocaleString()}</p><p className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-success" /> Live connection data</p></div>
          <div><p className="text-sm text-muted-foreground">Students</p><p className="mt-1 text-2xl font-semibold">{wifiStats.onlineStudents.toLocaleString()}</p></div>
          <div><p className="text-sm text-muted-foreground">Staff</p><p className="mt-1 text-2xl font-semibold">{wifiStats.onlineStaff.toLocaleString()}</p></div>
        </div>
        {preview.length === 0 ? (
          <EmptyState title="No active Wi-Fi users" description="No students or staff are currently connected to the network." />
        ) : (
          <DataTable head={["Name", "University ID", "Type", "Faculty", "Department", "Device", "Connected Since", "Status"]}>
            {preview.map((user) => (
              <tr key={user.universityId} className="hover:bg-muted/40">
                <Td className="font-semibold">{user.name}</Td>
                <Td className="font-mono text-xs">{user.universityId}</Td>
                <Td>{user.type}</Td>
                <Td>{user.faculty}</Td>
                <Td>{user.department}</Td>
                <Td>{user.device}</Td>
                <Td>{user.connectedSince}</Td>
                <Td><StatusPill status={user.status} /></Td>
              </tr>
            ))}
          </DataTable>
        )}
        <div className="border-t px-5 py-4 sm:px-6">
          <Button asChild variant="outline" size="sm"><Link to="/admin/wifi-users">View all connected users</Link></Button>
        </div>
      </SectionCard>

      <SectionCard title="Wi-Fi Connections Today" description="Connections recorded across the day." aside={<DemoDataNote />}>
        <div className="h-[260px] p-4 sm:p-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={connectionSeries} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="connections" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", fontSize: 13 }} />
              <Area type="monotone" dataKey="users" stroke="var(--color-primary)" strokeWidth={2} fill="url(#connections)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="grid border-t sm:grid-cols-3">
          <div className="border-b px-5 py-4 sm:border-b-0 sm:border-r sm:px-6"><p className="text-xs text-muted-foreground">Peak connected users</p><p className="mt-1 text-lg font-semibold">{activitySummary.peak.toLocaleString()}</p></div>
          <div className="border-b px-5 py-4 sm:border-b-0 sm:border-r sm:px-6"><p className="text-xs text-muted-foreground">Average connected users</p><p className="mt-1 text-lg font-semibold">{activitySummary.average.toLocaleString()}</p></div>
          <div className="px-5 py-4 sm:px-6"><p className="text-xs text-muted-foreground">Total sessions today</p><p className="mt-1 text-lg font-semibold">{activitySummary.sessions.toLocaleString()}</p></div>
        </div>
      </SectionCard>
    </>
  );
}

function AdminDashboardPage() {
  return (
    <AdminShell title="Dashboard" subtitle="Overview of the university Wi-Fi credential system.">
      <DashboardBody />
    </AdminShell>
  );
}
