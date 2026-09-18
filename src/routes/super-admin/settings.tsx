import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { ReactNode, useState } from "react";
import { toast } from "sonner";
import { AdminShell, EmptyState, LabeledField, SectionCard } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAdminSession } from "@/lib/mock-admin";

export const Route = createFileRoute("/super-admin/settings")({
  head: () => ({
    meta: [
      { title: "System Settings — University of Ilesa Wi-Fi" },
      { name: "description", content: "Configure university, Wi-Fi, security and notification settings for the credential management system." },
      { property: "og:title", content: "System Settings" },
      { property: "og:description", content: "Super Admin configuration for the university Wi-Fi credential platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SystemSettingsPage,
});

function SystemSettingsPage() {
  const session = useAdminSession();
  const [alerts, setAlerts] = useState({ security: true, credential: true, admin: false });

  if (session.role !== "super-admin") {
    return (
      <AdminShell title="System Settings" subtitle="Restricted to Super Administrators.">
        <SectionCard title="Access restricted">
          <EmptyState icon={ShieldAlert} title="You do not have access to this page" description="System settings are available to Super Administrators only." />
        </SectionCard>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="System Settings" subtitle="Configure the Wi-Fi credential management system.">
      <SectionCard title="General">
        <Grid>
          <LabeledField label="University Name"><Input className="h-11" defaultValue="University of Ilesa" /></LabeledField>
          <LabeledField label="Portal Name"><Input className="h-11" defaultValue="Wi-Fi Credential Portal" /></LabeledField>
          <LabeledField label="Support Email"><Input className="h-11" type="email" defaultValue="ictsupport@unilesa.edu.ng" /></LabeledField>
        </Grid>
      </SectionCard>

      <SectionCard title="Wi-Fi" description="Applied to newly issued credentials once network integration is live.">
        <Grid>
          <LabeledField label="Network Name"><Input className="h-11" defaultValue="University-WiFi" /></LabeledField>
          <LabeledField label="Credential validity">
            <Choice options={["One academic session", "One semester", "12 months", "No expiry"]} />
          </LabeledField>
          <LabeledField label="Maximum concurrent sessions"><Choice options={["1 device", "2 devices", "3 devices", "Unlimited"]} /></LabeledField>
        </Grid>
      </SectionCard>

      <SectionCard title="Security">
        <Grid>
          <LabeledField label="Session timeout"><Choice options={["5 minutes", "15 minutes", "30 minutes", "1 hour"]} /></LabeledField>
          <LabeledField label="Password requirements"><Choice options={["Minimum 8 characters, mixed case, number, symbol", "Minimum 12 characters, mixed case, number, symbol"]} /></LabeledField>
          <LabeledField label="Admin authentication"><Choice options={["Password only", "Password + email code", "Password + authenticator app"]} /></LabeledField>
          <LabeledField label="Login attempt limit"><Choice options={["3 attempts", "5 attempts", "10 attempts"]} /></LabeledField>
        </Grid>
      </SectionCard>

      <SectionCard title="Notifications">
        <div className="divide-y">
          <Toggle label="Security alerts" description="Failed admin logins and suspicious activity." checked={alerts.security} onChange={(value) => setAlerts({ ...alerts, security: value })} />
          <Toggle label="Credential alerts" description="Compromised or disabled credential reports." checked={alerts.credential} onChange={(value) => setAlerts({ ...alerts, credential: value })} />
          <Toggle label="Admin account alerts" description="Invitations, activations and permission changes." checked={alerts.admin} onChange={(value) => setAlerts({ ...alerts, admin: value })} />
        </div>
        <div className="flex justify-end gap-3 border-t bg-muted/40 px-5 py-4 sm:px-6">
          <Button variant="outline">Reset</Button>
          <Button onClick={() => toast.success("Settings saved", { description: "Prototype settings are stored for this session only." })}>Save changes</Button>
        </div>
      </SectionCard>
    </AdminShell>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">{children}</div>;
}

function Choice({ options }: { options: string[] }) {
  return (
    <Select defaultValue={options[0] ?? ""}>
      <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
      <SelectContent>{options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
    </Select>
  );
}

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
      <div><p className="text-sm font-semibold">{label}</p><p className="text-sm text-muted-foreground">{description}</p></div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}
