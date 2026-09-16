import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminShell, ConfirmDialog, DetailList, EmptyState, SectionCard, StatusPill } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { managedUsers } from "@/lib/mock-admin";

export const Route = createFileRoute("/admin/users/$userId")({
  head: () => ({
    meta: [
      { title: "User Details — University of Ilesa Wi-Fi Admin" },
      { name: "description", content: "Review a university Wi-Fi user's account, credential status and security activity." },
      { property: "og:title", content: "Wi-Fi User Details" },
      { property: "og:description", content: "Account, credential and security information for a university Wi-Fi user." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UserDetailPage,
});

function UserDetailPage() {
  const { userId } = Route.useParams();
  const user = managedUsers.find((item) => item.id === userId);
  const [confirm, setConfirm] = useState<"disable-account" | "disable-credential" | null>(null);

  if (!user) {
    return (
      <AdminShell title="User not found" subtitle="The requested user record is unavailable.">
        <SectionCard title="User record">
          <EmptyState title="No user found" description="This user may have been removed. Return to the user list and try again." />
        </SectionCard>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={user.name} subtitle={`${user.type} · ${user.universityId}`}>
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="outline" size="sm"><Link to="/admin/users"><ArrowLeft /> Back to users</Link></Button>
        <StatusPill status={user.accountStatus} />
        <StatusPill status={user.credentialStatus} />
        <span className="rounded-md border bg-muted px-2.5 py-1 text-xs font-semibold">{user.type}</span>
      </div>

      <SectionCard title="Personal Information">
        <DetailList items={[["Full Name", user.name], ["University ID", user.universityId], ["Email", user.email], ["Phone", user.phone], ["User Type", user.type]]} />
      </SectionCard>

      <SectionCard title="University Information">
        <DetailList items={[["Faculty", user.faculty], ["Department", user.department], [user.type === "Student" ? "Level" : "Staff Unit", user.level]]} />
      </SectionCard>

      <SectionCard title="Wi-Fi Account" description="Credential values are never shown to administrators.">
        <DetailList items={[
          ["Credential Status", <StatusPill key="c" status={user.credentialStatus} />],
          ["Assigned Date", user.registeredAt],
          ["Last Connection", user.lastConnection],
          ["Current Connection Status", <StatusPill key="n" status={user.connection} />],
          ["Active Sessions", String(user.sessions)],
        ]} />
      </SectionCard>

      <SectionCard title="Security">
        <DetailList items={[
          ["Account status", <StatusPill key="a" status={user.accountStatus} />],
          ["Last login", user.lastLogin],
          ["Failed login attempts", String(user.failedLogins)],
          ["Credential reported as compromised", user.reportedCompromised ? "Yes" : "No"],
        ]} />
        <div className="flex flex-wrap gap-3 bg-muted/40 px-5 py-4 sm:px-6">
          <Button variant="outline" onClick={() => toast.info("Activity opened", { description: `Recent activity for ${user.name}.` })}>View Activity</Button>
          <Button variant="outline" className="text-destructive" onClick={() => setConfirm("disable-credential")}>Disable Credential</Button>
          <Button variant="outline" className="text-destructive" onClick={() => setConfirm("disable-account")}>Disable Account</Button>
        </div>
      </SectionCard>

      <ConfirmDialog
        open={confirm === "disable-credential"}
        onOpenChange={(open) => !open && setConfirm(null)}
        title="Disable this Wi-Fi credential?"
        description="This will prevent the credential from being used until a new credential is assigned."
        confirmLabel="Disable Credential"
        onConfirm={() => toast.success("Credential disabled", { description: "The action has been recorded in the audit log." })}
      />
      <ConfirmDialog
        open={confirm === "disable-account"}
        onOpenChange={(open) => !open && setConfirm(null)}
        title="Disable this user account?"
        description="The user will not be able to sign in to the Wi-Fi portal until the account is reactivated."
        confirmLabel="Disable Account"
        onConfirm={() => toast.success("Account disabled", { description: "The action has been recorded in the audit log." })}
      />
    </AdminShell>
  );
}
