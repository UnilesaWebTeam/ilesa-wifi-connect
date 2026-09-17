import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell, DataTable, EmptyState, FilterBar, FilterSelect, SearchField, SectionCard, StatusPill, TablePagination, Td } from "@/components/admin";
import { Input } from "@/components/ui/input";
import { auditLog, roleLabel, useAdminSession } from "@/lib/mock-admin";

export const Route = createFileRoute("/admin/audit-logs")({
  head: () => ({
    meta: [
      { title: "Audit Logs — University of Ilesa Wi-Fi Admin" },
      { name: "description", content: "Track important administrative activity within the University of Ilesa Wi-Fi credential system." },
      { property: "og:title", content: "Administrative Audit Logs" },
      { property: "og:description", content: "Review administrator actions, targets and outcomes across the system." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuditLogsPage,
});

const PAGE_SIZE = 12;

function AuditLogsPage() {
  const admin = useAdminSession();
  const isSuper = admin.role === "super-admin";
  const [query, setQuery] = useState("");
  const [administrator, setAdministrator] = useState("all");
  const [action, setAction] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  // Regular admins only see entries their permissions allow; the real system
  // enforces this server-side from the authenticated session.
  const visible = useMemo(() => isSuper ? auditLog : auditLog.filter((entry) => entry.role === "Admin" && !entry.action.startsWith("Admin ")), [isSuper]);
  const administrators = [...new Set(visible.map((entry) => entry.administrator))];
  const actions = [...new Set(visible.map((entry) => entry.action))];

  const filtered = useMemo(() => visible.filter((entry) =>
    (query === "" || `${entry.administrator} ${entry.action} ${entry.target}`.toLowerCase().includes(query.toLowerCase()))
    && (administrator === "all" || entry.administrator === administrator)
    && (action === "all" || entry.action === action)
    && (status === "all" || entry.status === status)
  ), [visible, query, administrator, action, status]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const update = (setter: (value: string) => void) => (value: string) => { setter(value); setPage(1); };

  return (
    <AdminShell title="Audit Logs" subtitle="Track important administrative activity within the system.">
      <SectionCard title={`${filtered.length} events`} description={isSuper ? `Viewing all system audit events as ${roleLabel(admin.role)}.` : "You are viewing the audit events allowed by your permissions."}>
        <FilterBar>
          <SearchField value={query} onChange={update(setQuery)} placeholder="Search by administrator, action or target..." />
          <FilterSelect label="Administrators" value={administrator} onChange={update(setAdministrator)} options={administrators} />
          <FilterSelect label="Actions" value={action} onChange={update(setAction)} options={actions} />
          <FilterSelect label="Statuses" value={status} onChange={update(setStatus)} options={["Successful", "Failed"]} />
          <div className="flex items-center gap-2">
            <Input type="date" aria-label="From date" className="h-11 bg-card" />
            <span className="text-sm text-muted-foreground">to</span>
            <Input type="date" aria-label="To date" className="h-11 bg-card" />
          </div>
        </FilterBar>
        {current.length === 0 ? (
          <EmptyState title="No audit activity" description="Try adjusting your search, filters or date range." />
        ) : (
          <>
            <DataTable head={["Date & Time", "Administrator", "Role", "Action", "Target", "IP Address", "Status"]}>
              {current.map((entry, index) => (
                <tr key={`${entry.timestamp}-${index}`} className="hover:bg-muted/40">
                  <Td>{entry.timestamp}</Td>
                  <Td className="font-semibold">{entry.administrator}</Td>
                  <Td>{entry.role}</Td>
                  <Td>{entry.action}</Td>
                  <Td>{entry.target}</Td>
                  <Td className="font-mono text-xs text-muted-foreground">{entry.ip}</Td>
                  <Td><StatusPill status={entry.status} /></Td>
                </tr>
              ))}
            </DataTable>
            <TablePagination page={page} pageCount={pageCount} total={filtered.length} onPage={setPage} />
          </>
        )}
      </SectionCard>
    </AdminShell>
  );
}
