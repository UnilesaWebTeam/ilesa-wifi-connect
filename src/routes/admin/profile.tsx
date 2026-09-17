import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, LogOut, MonitorSmartphone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminShell, ConfirmDialog, DetailList, SectionCard, StatusPill } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { permissionGroups, roleLabel, useAdminSession } from "@/lib/mock-admin";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({
    meta: [
      { title: "Admin Profile — University of Ilesa Wi-Fi" },
      { name: "description", content: "Review your administrator account details, permissions and active sessions." },
      { property: "og:title", content: "Administrator Profile" },
      { property: "og:description", content: "Administrator account, security settings and active sessions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminProfilePage,
});

function AdminProfilePage() {
  const admin = useAdminSession();
  const isSuper = admin.role === "super-admin";
  const [confirmSessions, setConfirmSessions] = useState(false);

  return (
    <AdminShell title="Admin Profile" subtitle="Your administrator account and security settings.">
      <SectionCard title="Account Information" aside={<StatusPill status={admin.status} />}>
        <DetailList items={[
          ["Name", admin.name],
          ["Email", admin.email],
          ["Admin ID", admin.adminId],
          ["Role", roleLabel(admin.role)],
          ["Department", admin.department],
          ["Last login", admin.lastLogin],
          ...(isSuper ? ([["Account created", admin.createdAt]] as [string, string][]) : []),
        ]} />
      </SectionCard>

      {isSuper && (
        <SectionCard title="Permissions" description="Super Admins hold every system permission.">
          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            {permissionGroups.map((group) => (
              <div key={group.group}>
                <p className="text-sm font-semibold">{group.group}</p>
                <ul className="mt-2 space-y-1.5">
                  {group.items.map((item) => <li key={item} className="text-sm text-muted-foreground">{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <SectionCard title="Security" description="Manage your password and signed-in devices.">
        <div className="divide-y">
          <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div><p className="text-sm font-semibold">Change password</p><p className="text-sm text-muted-foreground">Last changed 42 days ago.</p></div>
            <Button variant="outline" onClick={() => toast.info("Password reset email sent", { description: admin.email })}><KeyRound /> Change Password</Button>
          </div>
          <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div><p className="text-sm font-semibold">Active sessions</p><p className="text-sm text-muted-foreground">2 devices — Windows desktop (ICT Office), Android phone.</p></div>
            <Button variant="outline"><MonitorSmartphone /> View Sessions</Button>
          </div>
          <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div><p className="text-sm font-semibold">Sign out of other sessions</p><p className="text-sm text-muted-foreground">Ends every session except this one.</p></div>
            <Button variant="outline" className="text-destructive" onClick={() => setConfirmSessions(true)}><LogOut /> Sign Out Other Sessions</Button>
          </div>
        </div>
      </SectionCard>

      <ConfirmDialog
        open={confirmSessions}
        onOpenChange={setConfirmSessions}
        title="Sign out of other sessions?"
        description="All other devices signed in with this administrator account will be signed out immediately."
        confirmLabel="Sign Out Sessions"
        onConfirm={() => toast.success("Other sessions ended", { description: "This action has been recorded in the audit log." })}
      />
    </AdminShell>
  );
}
