import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MoreHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminShell, ConfirmDialog, DataTable, EmptyState, FilterBar, FilterSelect, SearchField, SectionCard, StatusPill, TablePagination, Td } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { adminDepartments, adminFaculties, managedUsers } from "@/lib/mock-admin";

export const Route = createFileRoute("/admin/users/")({
  head: () => ({
    meta: [
      { title: "Students & Staff — University of Ilesa Wi-Fi Admin" },
      { name: "description", content: "View and manage registered University of Ilesa Wi-Fi users, accounts and credential status." },
      { property: "og:title", content: "Students & Staff Management" },
      { property: "og:description", content: "Search, filter and manage registered university Wi-Fi users." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UsersPage,
});

const PAGE_SIZE = 10;
const tabs = ["All Users", "Students", "Staff", "Active", "Inactive"] as const;

function UsersPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof tabs)[number]>("All Users");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [faculty, setFaculty] = useState("all");
  const [department, setDepartment] = useState("all");
  const [accountStatus, setAccountStatus] = useState("all");
  const [credentialStatus, setCredentialStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [disableTarget, setDisableTarget] = useState<string | null>(null);

  const filtered = useMemo(() => managedUsers.filter((user) => {
    const tabMatch = tab === "All Users"
      || (tab === "Students" && user.type === "Student")
      || (tab === "Staff" && user.type === "Staff")
      || (tab === "Active" && user.accountStatus === "Active")
      || (tab === "Inactive" && user.accountStatus === "Inactive");
    return tabMatch
      && (query === "" || `${user.name} ${user.universityId} ${user.email} ${user.department}`.toLowerCase().includes(query.toLowerCase()))
      && (type === "all" || user.type === type)
      && (faculty === "all" || user.faculty === faculty)
      && (department === "all" || user.department === department)
      && (accountStatus === "all" || user.accountStatus === accountStatus)
      && (credentialStatus === "all" || user.credentialStatus === credentialStatus);
  }), [tab, query, type, faculty, department, accountStatus, credentialStatus]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const update = (setter: (value: string) => void) => (value: string) => { setter(value); setPage(1); };

  return (
    <AdminShell title="Students & Staff" subtitle="View and manage registered university Wi-Fi users.">
      <SectionCard title={`${filtered.length} users`} description="Administrators can review accounts and credential status, but never browse Wi-Fi passwords.">
        <div className="flex gap-1 overflow-x-auto border-b px-5 py-3 sm:px-6">
          {tabs.map((item) => (
            <button
              key={item}
              onClick={() => { setTab(item); setPage(1); }}
              className={cn("whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors", tab === item ? "bg-primary/8 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}
            >
              {item}
            </button>
          ))}
        </div>
        <FilterBar>
          <SearchField value={query} onChange={update(setQuery)} placeholder="Search by name, university ID, email or department..." />
          <FilterSelect label="User Types" value={type} onChange={update(setType)} options={["Student", "Staff"]} />
          <FilterSelect label="Faculties" value={faculty} onChange={update(setFaculty)} options={adminFaculties} />
          <FilterSelect label="Departments" value={department} onChange={update(setDepartment)} options={adminDepartments} />
          <FilterSelect label="Account Statuses" value={accountStatus} onChange={update(setAccountStatus)} options={["Active", "Inactive"]} />
          <FilterSelect label="Credential Statuses" value={credentialStatus} onChange={update(setCredentialStatus)} options={["Assigned", "Pending", "Disabled", "Compromised"]} />
        </FilterBar>
        {current.length === 0 ? (
          <EmptyState title="No users found" description="Try adjusting your search or filters." />
        ) : (
          <>
            <DataTable head={["Name", "University ID", "Email", "Type", "Faculty", "Department", "Credential", "Account", "Registered", ""]}>
              {current.map((user) => (
                <tr key={user.id} className="hover:bg-muted/40">
                  <Td className="font-semibold"><Link to="/admin/users/$userId" params={{ userId: user.id }} className="hover:text-primary hover:underline">{user.name}</Link></Td>
                  <Td className="font-mono text-xs">{user.universityId}</Td>
                  <Td className="text-muted-foreground">{user.email}</Td>
                  <Td>{user.type}</Td>
                  <Td>{user.faculty}</Td>
                  <Td>{user.department}</Td>
                  <Td><StatusPill status={user.credentialStatus} /></Td>
                  <Td><StatusPill status={user.accountStatus} /></Td>
                  <Td>{user.registeredAt}</Td>
                  <Td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`Actions for ${user.name}`}><MoreHorizontal /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => void navigate({ to: "/admin/users/$userId", params: { userId: user.id } })}>View Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info(`Credential status: ${user.credentialStatus}`)}>View Credential Status</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Activity opened", { description: `Recent activity for ${user.name}.` })}>View Activity</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => setDisableTarget(user.name)}>Disable Account</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Td>
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
        title="Disable this user account?"
        description="The user will not be able to sign in to the Wi-Fi portal until the account is reactivated. This action is recorded in the audit log."
        confirmLabel="Disable Account"
        onConfirm={() => toast.success("Account disabled", { description: `${disableTarget} can no longer sign in.` })}
      />
    </AdminShell>
  );
}
