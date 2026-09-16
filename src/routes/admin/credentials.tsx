import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, KeyRound, ShieldOff, Wifi } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminShell, ConfirmDialog, DataTable, EmptyState, FilterBar, FilterSelect, SearchField, SectionCard, StatCard, StatusPill, TablePagination, Td } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { compromisedReports, credentialPool, wifiStats } from "@/lib/mock-admin";

export const Route = createFileRoute("/admin/credentials")({
  head: () => ({
    meta: [
      { title: "Wi-Fi Credentials — University of Ilesa Admin" },
      { name: "description", content: "Manage the University of Ilesa Wi-Fi credential pool, allocation and compromised credential reports." },
      { property: "og:title", content: "Wi-Fi Credential Management" },
      { property: "og:description", content: "Track credential allocation, disabled credentials and security alerts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CredentialsPage,
});

const PAGE_SIZE = 10;

function CredentialsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [disableTarget, setDisableTarget] = useState<string | null>(null);

  const filtered = useMemo(() => credentialPool.filter((item) =>
    (query === "" || `${item.reference} ${item.assignedUser ?? ""}`.toLowerCase().includes(query.toLowerCase()))
    && (status === "all" || item.status === status)
  ), [query, status]);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allocation = Math.round((wifiStats.credentialsAssigned / wifiStats.totalCredentials) * 100);

  return (
    <AdminShell title="Wi-Fi Credentials" subtitle="Manage credential allocation, status and security alerts.">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={KeyRound} label="Total Credentials" value={wifiStats.totalCredentials.toLocaleString()} />
        <StatCard icon={Wifi} label="Assigned" value={wifiStats.credentialsAssigned.toLocaleString()} />
        <StatCard icon={Wifi} label="Available" value={wifiStats.credentialsAvailable.toLocaleString()} />
        <StatCard icon={ShieldOff} label="Disabled" value={String(wifiStats.disabledCredentials)} />
        <StatCard icon={AlertTriangle} label="Reported / Compromised" value={String(wifiStats.compromisedCredentials)} />
      </section>

      <SectionCard title="Credential Allocation" description={`${wifiStats.credentialsAssigned.toLocaleString()} / ${wifiStats.totalCredentials.toLocaleString()} credentials assigned`}>
        <div className="p-5 sm:p-6">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={allocation} aria-valuemin={0} aria-valuemax={100} aria-label="Credential allocation">
            <div className="h-full rounded-full bg-primary" style={{ width: `${allocation}%` }} />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{allocation}% of the credential pool has been allocated.</p>
        </div>
      </SectionCard>

      <SectionCard title="Security Alerts" description="Credentials reported as compromised by their owners.">
        {compromisedReports.length === 0 ? (
          <EmptyState title="No compromised credentials" description="No credentials have been reported as compromised." />
        ) : (
          <DataTable head={["User", "University ID", "Report date", "Credential status", "Connection", "Actions"]}>
            {compromisedReports.map((report) => (
              <tr key={report.universityId} className="hover:bg-muted/40">
                <Td className="font-semibold">{report.user}</Td>
                <Td className="font-mono text-xs">{report.universityId}</Td>
                <Td>{report.reportedAt}</Td>
                <Td><StatusPill status={report.credentialStatus} /></Td>
                <Td><StatusPill status={report.connection} /></Td>
                <Td>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setDisableTarget(report.universityId)}>Disable Credential</Button>
                    <Button variant="ghost" size="sm" onClick={() => toast.info("Account review opened", { description: report.user })}>Review Account</Button>
                  </div>
                </Td>
              </tr>
            ))}
          </DataTable>
        )}
      </SectionCard>

      <SectionCard title="Credential Pool" description="Passwords are never displayed here; administrators manage status and allocation only.">
        <FilterBar>
          <SearchField value={query} onChange={(value) => { setQuery(value); setPage(1); }} placeholder="Search by credential reference or assigned user..." />
          <FilterSelect label="Statuses" value={status} onChange={(value) => { setStatus(value); setPage(1); }} options={["Assigned", "Available", "Disabled", "Compromised"]} />
        </FilterBar>
        {current.length === 0 ? (
          <EmptyState title="No credentials found" description="Try adjusting your search or filters." />
        ) : (
          <>
            <DataTable head={["Credential", "Password", "Assigned user", "User type", "Assigned date", "Status"]}>
              {current.map((item) => (
                <tr key={item.reference} className="hover:bg-muted/40">
                  <Td className="font-mono text-xs font-semibold">{item.reference}</Td>
                  <Td className="font-mono text-muted-foreground">••••••••••••</Td>
                  <Td>{item.assignedUser ?? "—"}</Td>
                  <Td>{item.userType ?? "—"}</Td>
                  <Td>{item.assignedAt}</Td>
                  <Td><StatusPill status={item.status} /></Td>
                </tr>
              ))}
            </DataTable>
            <TablePagination page={page} pageCount={pageCount} total={filtered.length} onPage={setPage} />
          </>
        )}
      </SectionCard>

      <ConfirmDialog
        open={disableTarget !== null}
        onOpenChange={(open) => !open && setDisableTarget(null)}
        title="Disable this Wi-Fi credential?"
        description="This will prevent the credential from being used until a new credential is assigned."
        confirmLabel="Disable Credential"
        onConfirm={() => toast.success("Credential disabled", { description: "The action has been recorded in the audit log." })}
      />
    </AdminShell>
  );
}
