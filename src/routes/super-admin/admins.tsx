import { createFileRoute } from "@tanstack/react-router";
import { MoreHorizontal, Plus, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminShell, ConfirmDialog, DataTable, EmptyState, LabeledField, SectionCard, StatusPill, Td } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminAccounts, permissionGroups, roleLabel, useAdminSession } from "@/lib/mock-admin";

export const Route = createFileRoute("/super-admin/admins")({
  head: () => ({
    meta: [
      { title: "Admin Management — University of Ilesa Wi-Fi" },
      { name: "description", content: "Create, invite and manage administrators with access to the university Wi-Fi management portal." },
      { property: "og:title", content: "Admin Management" },
      { property: "og:description", content: "Invite administrators and assign least-privilege permissions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminManagementPage,
});

function AdminManagementPage() {
  const session = useAdminSession();
  const [createOpen, setCreateOpen] = useState(false);
  const [permissionsFor, setPermissionsFor] = useState<string | null>(null);
  const [disableTarget, setDisableTarget] = useState<string | null>(null);

  if (session.role !== "super-admin") {
    return (
      <AdminShell title="Admin Management" subtitle="Restricted to Super Administrators.">
        <SectionCard title="Access restricted">
          <EmptyState icon={ShieldAlert} title="You do not have access to this page" description="Admin management is available to Super Administrators only. Permissions are enforced by the server in the live system." />
        </SectionCard>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Admin Management" subtitle="Create and manage administrators who have access to the Wi-Fi management portal.">
      <SectionCard
        title={`${adminAccounts.length} administrators`}
        description="Invited administrators set their own password — passwords are never created or stored here."
        aside={<Button onClick={() => setCreateOpen(true)}><Plus /> Create Admin</Button>}
      >
        <DataTable head={["Name", "Admin ID", "Email", "Role", "Permissions", "Status", "Last Login", "Created", ""]}>
          {adminAccounts.map((account) => (
            <tr key={account.adminId} className="hover:bg-muted/40">
              <Td className="font-semibold">{account.name}</Td>
              <Td className="font-mono text-xs">{account.adminId}</Td>
              <Td className="text-muted-foreground">{account.email}</Td>
              <Td>{roleLabel(account.role)}</Td>
              <Td>{account.permissions.length} granted</Td>
              <Td><StatusPill status={account.status} /></Td>
              <Td>{account.lastLogin}</Td>
              <Td>{account.createdAt}</Td>
              <Td>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`Actions for ${account.name}`}><MoreHorizontal /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toast.info(account.name, { description: `${roleLabel(account.role)} · ${account.department}` })}>View</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPermissionsFor(account.adminId)}>Edit Permissions</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.success("Access reset link sent", { description: account.email })}>Reset Access</DropdownMenuItem>
                    {account.status === "Active"
                      ? <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDisableTarget(account.name)}>Disable</DropdownMenuItem>
                      : <DropdownMenuItem onClick={() => toast.success("Administrator reactivated", { description: account.name })}>Reactivate</DropdownMenuItem>}
                  </DropdownMenuContent>
                </DropdownMenu>
              </Td>
            </tr>
          ))}
        </DataTable>
      </SectionCard>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Admin</DialogTitle>
            <DialogDescription>Send an invitation. The administrator creates their own password from the invitation link.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <LabeledField label="First Name"><Input className="h-11" placeholder="First name" /></LabeledField>
            <LabeledField label="Last Name"><Input className="h-11" placeholder="Last name" /></LabeledField>
            <LabeledField label="Admin ID"><Input className="h-11" placeholder="e.g. ADM/005" /></LabeledField>
            <LabeledField label="Official University Email"><Input className="h-11" type="email" placeholder="name@unilesa.edu.ng" /></LabeledField>
            <LabeledField label="Department / Unit"><Input className="h-11" placeholder="e.g. ICT Network Operations" /></LabeledField>
            <LabeledField label="Role">
              <Select defaultValue="admin">
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="super-admin">Super Admin</SelectItem></SelectContent>
              </Select>
            </LabeledField>
          </div>
          <PermissionsPicker />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => { setCreateOpen(false); toast.success("Invitation sent successfully."); }}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={permissionsFor !== null} onOpenChange={(open) => !open && setPermissionsFor(null)}>
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit permissions</DialogTitle>
            <DialogDescription>Grant only the access this administrator needs. Least privilege is applied by default.</DialogDescription>
          </DialogHeader>
          <PermissionsPicker granted={adminAccounts.find((account) => account.adminId === permissionsFor)?.permissions ?? []} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setPermissionsFor(null)}>Cancel</Button>
            <Button onClick={() => { setPermissionsFor(null); toast.success("Permissions updated", { description: "The change has been recorded in the audit log." }); }}>Save permissions</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={disableTarget !== null}
        onOpenChange={(open) => !open && setDisableTarget(null)}
        title="Disable this administrator?"
        description="The administrator will immediately lose access to the Wi-Fi management portal until reactivated."
        confirmLabel="Disable Admin"
        onConfirm={() => toast.success("Administrator disabled", { description: `${disableTarget} can no longer sign in.` })}
      />
    </AdminShell>
  );
}

function PermissionsPicker({ granted = [] }: { granted?: string[] }) {
  return (
    <div className="grid gap-5 rounded-xl border p-4 sm:grid-cols-2">
      {permissionGroups.map((group) => (
        <div key={group.group}>
          <p className="mb-2 text-sm font-semibold">{group.group}</p>
          <div className="space-y-2">
            {group.items.map((item) => (
              <label key={item} className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
                <Checkbox defaultChecked={granted.includes(item)} /> {item}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
