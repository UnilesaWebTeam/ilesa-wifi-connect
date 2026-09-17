import { createFileRoute } from "@tanstack/react-router";
import { Download, FileBarChart, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminShell, DataTable, EmptyState, LabeledField, SectionCard, StatCard, StatusPill, Td } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminDepartments, adminFaculties, managedUsers, reportTypes, wifiStats } from "@/lib/mock-admin";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [
      { title: "Reports — University of Ilesa Wi-Fi Admin" },
      { name: "description", content: "Generate and export reports about university Wi-Fi users, credentials and network activity." },
      { property: "og:title", content: "Wi-Fi Reports" },
      { property: "og:description", content: "Build, preview and export university Wi-Fi reports." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const [reportType, setReportType] = useState(reportTypes[0]!);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const rows = managedUsers.slice(0, 12);

  const generate = () => {
    setLoading(true);
    window.setTimeout(() => { setLoading(false); setGenerated(true); toast.success("Report generated", { description: reportType }); }, 900);
  };

  return (
    <AdminShell title="Reports" subtitle="Generate reports about users, credentials and Wi-Fi activity.">
      <SectionCard title="Report Builder" description="Choose a report type and filters, then preview before exporting.">
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
          <LabeledField label="Report type">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="h-11 bg-card"><SelectValue /></SelectTrigger>
              <SelectContent>{reportTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
            </Select>
          </LabeledField>
          <LabeledField label="From date"><Input type="date" className="h-11 bg-card" /></LabeledField>
          <LabeledField label="To date"><Input type="date" className="h-11 bg-card" /></LabeledField>
          <ReportFilter label="User type" options={["Student", "Staff"]} />
          <ReportFilter label="Faculty" options={adminFaculties} />
          <ReportFilter label="Department" options={adminDepartments} />
          <ReportFilter label="Account status" options={["Active", "Inactive"]} />
          <ReportFilter label="Credential status" options={["Assigned", "Pending", "Disabled", "Compromised"]} />
          <ReportFilter label="Connection status" options={["Online", "Offline"]} />
        </div>
        <div className="flex flex-wrap gap-3 border-t bg-muted/40 px-5 py-4 sm:px-6">
          <Button onClick={generate} disabled={loading}>{loading ? <><Loader2 className="animate-spin" />Generating...</> : <><FileBarChart /> Generate Report</>}</Button>
          {(["CSV", "Excel", "PDF"] as const).map((format) => (
            <Button key={format} variant="outline" disabled={!generated} onClick={() => toast.success(`${format} export started`, { description: `${reportType} report will download shortly.` })}>
              <Download /> Export {format}
            </Button>
          ))}
        </div>
      </SectionCard>

      {!generated ? (
        <SectionCard title="Report Preview">
          <EmptyState title="No reports yet" description="Choose a report type and select Generate Report to see a preview here." icon={FileBarChart} />
        </SectionCard>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={FileBarChart} label="Records" value={rows.length.toLocaleString()} hint={reportType} />
            <StatCard icon={FileBarChart} label="Students" value={rows.filter((row) => row.type === "Student").length.toString()} />
            <StatCard icon={FileBarChart} label="Staff" value={rows.filter((row) => row.type === "Staff").length.toString()} />
            <StatCard icon={FileBarChart} label="Credentials assigned" value={wifiStats.credentialsAssigned.toLocaleString()} />
          </section>
          <SectionCard title="Report Preview" description={`${reportType} · generated 16 Sep 2026`}>
            <DataTable head={["Name", "University ID", "Type", "Faculty", "Department", "Credential", "Account", "Registered"]}>
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/40">
                  <Td className="font-semibold">{row.name}</Td>
                  <Td className="font-mono text-xs">{row.universityId}</Td>
                  <Td>{row.type}</Td>
                  <Td>{row.faculty}</Td>
                  <Td>{row.department}</Td>
                  <Td><StatusPill status={row.credentialStatus} /></Td>
                  <Td><StatusPill status={row.accountStatus} /></Td>
                  <Td>{row.registeredAt}</Td>
                </tr>
              ))}
            </DataTable>
          </SectionCard>
        </>
      )}
    </AdminShell>
  );
}

function ReportFilter({ label, options }: { label: string; options: string[] }) {
  const [value, setValue] = useState("all");
  return (
    <LabeledField label={label}>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="h-11 bg-card"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
        </SelectContent>
      </Select>
    </LabeledField>
  );
}
