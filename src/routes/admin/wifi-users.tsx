import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell, DataTable, DemoDataNote, EmptyState, FilterBar, FilterSelect, SearchField, SectionCard, StatusPill, TablePagination, Td } from "@/components/admin";
import { adminDepartments, adminFaculties, connectedUsers, wifiStats } from "@/lib/mock-admin";

export const Route = createFileRoute("/admin/wifi-users")({
  head: () => ({
    meta: [
      { title: "Connected Wi-Fi Users — University of Ilesa" },
      { name: "description", content: "Monitor students and staff currently connected to the University of Ilesa Wi-Fi network." },
      { property: "og:title", content: "Connected Wi-Fi Users" },
      { property: "og:description", content: "Live view of current university Wi-Fi sessions by faculty, department and device." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WifiUsersPage,
});

const PAGE_SIZE = 10;

function WifiUsersPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [faculty, setFaculty] = useState("all");
  const [department, setDepartment] = useState("all");
  const [device, setDevice] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => connectedUsers.filter((user) =>
    (query === "" || `${user.name} ${user.universityId} ${user.department}`.toLowerCase().includes(query.toLowerCase()))
    && (type === "all" || user.type === type)
    && (faculty === "all" || user.faculty === faculty)
    && (department === "all" || user.department === department)
    && (device === "all" || user.device === device)
    && (status === "all" || user.status === status)
  ), [query, type, faculty, department, device, status]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const update = (setter: (value: string) => void) => (value: string) => { setter(value); setPage(1); };

  return (
    <AdminShell title="Wi-Fi Users" subtitle="Students and staff currently connected to the university Wi-Fi.">
      <SectionCard
        title={`${wifiStats.currentlyOnline.toLocaleString()} Users Online`}
        description={`Students: ${wifiStats.onlineStudents.toLocaleString()} · Staff: ${wifiStats.onlineStaff.toLocaleString()}`}
        aside={<DemoDataNote />}
      >
        <FilterBar>
          <SearchField value={query} onChange={update(setQuery)} placeholder="Search by name, university ID or department..." />
          <FilterSelect label="Types" value={type} onChange={update(setType)} options={["Student", "Staff"]} />
          <FilterSelect label="Faculties" value={faculty} onChange={update(setFaculty)} options={adminFaculties} />
          <FilterSelect label="Departments" value={department} onChange={update(setDepartment)} options={adminDepartments} />
          <FilterSelect label="Devices" value={device} onChange={update(setDevice)} options={["Mobile", "Laptop", "Tablet"]} />
          <FilterSelect label="Statuses" value={status} onChange={update(setStatus)} options={["Online", "Idle"]} />
        </FilterBar>
        {current.length === 0 ? (
          <EmptyState title="No active Wi-Fi users" description="Try adjusting your search or filters." />
        ) : (
          <>
            <DataTable head={["Name", "University ID", "Type", "Faculty", "Department", "Device", "Connected Since", "Status"]}>
              {current.map((user) => (
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
            <TablePagination page={page} pageCount={pageCount} total={filtered.length} onPage={setPage} />
          </>
        )}
      </SectionCard>
    </AdminShell>
  );
}
