import { useSyncExternalStore } from "react";

export type AdminRole = "admin" | "super-admin";

export type AdminAccount = {
  name: string;
  adminId: string;
  email: string;
  role: AdminRole;
  department: string;
  status: "Active" | "Disabled";
  lastLogin: string;
  createdAt: string;
  permissions: string[];
};

export type ManagedUser = {
  id: string;
  name: string;
  universityId: string;
  email: string;
  phone: string;
  type: "Student" | "Staff";
  faculty: string;
  department: string;
  level: string;
  credentialStatus: "Assigned" | "Pending" | "Disabled" | "Compromised";
  accountStatus: "Active" | "Inactive";
  registeredAt: string;
  lastConnection: string;
  connection: "Online" | "Offline";
  sessions: number;
  lastLogin: string;
  failedLogins: number;
  reportedCompromised: boolean;
};

export type ConnectedUser = {
  name: string;
  universityId: string;
  type: "Student" | "Staff";
  faculty: string;
  department: string;
  device: "Mobile" | "Laptop" | "Tablet";
  connectedSince: string;
  status: "Online" | "Idle";
};

export type AuditEntry = {
  timestamp: string;
  administrator: string;
  role: "Admin" | "Super Admin";
  action: string;
  target: string;
  ip: string;
  status: "Successful" | "Failed";
};

export const wifiStats = {
  totalUsers: 18426,
  credentialsAssigned: 17850,
  credentialsAvailable: 2150,
  totalCredentials: 20000,
  currentlyOnline: 1284,
  onlineStudents: 1067,
  onlineStaff: 217,
  disabledCredentials: 64,
  compromisedCredentials: 3,
  totalAdmins: 8,
  activeAdmins: 7,
  systemAlerts: 3,
  auditEventsToday: 126,
};

export const connectionSeries = [
  { time: "6 AM", users: 182 },
  { time: "8 AM", users: 764 },
  { time: "10 AM", users: 1284 },
  { time: "12 PM", users: 1196 },
  { time: "2 PM", users: 1042 },
  { time: "4 PM", users: 878 },
  { time: "6 PM", users: 594 },
];

export const activitySummary = { peak: 1284, average: 848, sessions: 4312 };

export const adminFaculties = ["Computing", "Science", "Management Sciences", "Arts", "Social Sciences", "Registry and ICT"];
export const adminDepartments = ["Computer Science", "Mathematics", "Accounting", "Economics", "English and Literary Studies", "Information and Communication Technology"];

const firstNames = ["Adebayo", "Fatima", "Chinedu", "Aisha", "Tunde", "Ngozi", "Ibrahim", "Blessing", "Yusuf", "Folake", "Emeka", "Halima", "Segun", "Zainab", "Kelechi", "Amina", "Olumide", "Grace", "Musa", "Temitope"];
const lastNames = ["James", "Bello", "Okonkwo", "Suleiman", "Adeyemi", "Eze", "Salami", "Ojo", "Lawal", "Balogun", "Nwosu", "Ibrahim", "Adeleke", "Umar", "Chukwu", "Yusuf", "Fashola", "Oladele", "Danjuma", "Ogundipe"];

function pick<T>(list: readonly T[], index: number): T {
  return list[index % list.length] as T;
}

export const managedUsers: ManagedUser[] = Array.from({ length: 48 }, (_, index) => {
  const isStaff = index % 5 === 0;
  const name = `${pick(firstNames, index)} ${pick(lastNames, index * 3 + 1)}`;
  const faculty = pick(adminFaculties, index);
  const department = pick(adminDepartments, index + 2);
  const credentialStatus: ManagedUser["credentialStatus"] = index % 17 === 0 ? "Compromised" : index % 11 === 0 ? "Disabled" : index % 7 === 0 ? "Pending" : "Assigned";
  return {
    id: `u-${1000 + index}`,
    name,
    universityId: isStaff ? `UNI/STAFF/${String(400 + index).padStart(4, "0")}` : `UNI/2024/${String(1000 + index)}`,
    email: `${name.toLowerCase().replace(/ /g, ".")}@unilesa.edu.ng`,
    phone: `080${String(30000000 + index * 1237).slice(0, 8)}`,
    type: isStaff ? "Staff" : "Student",
    faculty,
    department,
    level: isStaff ? "Administrative Unit" : `${((index % 4) + 1) * 100} Level`,
    credentialStatus,
    accountStatus: index % 9 === 0 ? "Inactive" : "Active",
    registeredAt: `${String((index % 28) + 1).padStart(2, "0")} Aug 2026`,
    lastConnection: `${String((index % 12) + 1).padStart(2, "0")}:${String((index * 7) % 60).padStart(2, "0")} ${index % 2 ? "AM" : "PM"}`,
    connection: index % 3 === 0 ? "Online" : "Offline",
    sessions: index % 3 === 0 ? (index % 2) + 1 : 0,
    lastLogin: `1${(index % 5) + 1} Sep 2026, 0${(index % 8) + 1}:${String((index * 11) % 60).padStart(2, "0")}`,
    failedLogins: index % 6,
    reportedCompromised: credentialStatus === "Compromised",
  };
});

export const connectedUsers: ConnectedUser[] = managedUsers
  .filter((user) => user.connection === "Online")
  .map((user, index) => ({
    name: user.name,
    universityId: user.universityId,
    type: user.type,
    faculty: user.faculty,
    department: user.department,
    device: index % 3 === 0 ? "Mobile" : index % 3 === 1 ? "Laptop" : "Tablet",
    connectedSince: `0${(index % 8) + 1}:${String((index * 13) % 60).padStart(2, "0")} AM`,
    status: index % 7 === 0 ? "Idle" : "Online",
  }));

export const compromisedReports = managedUsers
  .filter((user) => user.reportedCompromised)
  .map((user, index) => ({
    user: user.name,
    universityId: user.universityId,
    reportedAt: `1${index + 2} Sep 2026`,
    credentialStatus: user.credentialStatus,
    connection: user.connection,
  }));

export const credentialPool = Array.from({ length: 36 }, (_, index) => {
  const assignedUser = managedUsers[index % managedUsers.length]!;
  const available = index % 6 === 0;
  return {
    reference: `UNI-WIFI-${String(1000 + index).padStart(6, "0")}`,
    assignedUser: available ? null : assignedUser.name,
    userType: available ? null : assignedUser.type,
    assignedAt: available ? "—" : `${String((index % 28) + 1).padStart(2, "0")} Aug 2026`,
    status: available ? "Available" : index % 13 === 0 ? "Disabled" : index % 17 === 0 ? "Compromised" : "Assigned",
  };
});

export const permissionGroups = [
  { group: "User Management", items: ["View Students", "View Staff", "View User Profiles", "Disable User Accounts"] },
  { group: "Wi-Fi", items: ["View Wi-Fi Statistics", "View Connected Users", "View Credential Status", "Manage Credentials", "Manage Compromised Credentials"] },
  { group: "Reports", items: ["Generate Reports", "Export Reports"] },
  { group: "Security", items: ["View Audit Logs", "View Security Alerts"] },
];

export const adminAccounts: AdminAccount[] = [
  { name: "John Ade", adminId: "ADM/001", email: "john.ade@unilesa.edu.ng", role: "admin", department: "ICT Network Operations", status: "Active", lastLogin: "16 Sep 2026, 08:04", createdAt: "02 Feb 2026", permissions: ["View Students", "View Staff", "View User Profiles", "View Wi-Fi Statistics", "View Connected Users", "Generate Reports", "Export Reports"] },
  { name: "Halima Sanni", adminId: "ADM/002", email: "halima.sanni@unilesa.edu.ng", role: "admin", department: "ICT Support", status: "Active", lastLogin: "15 Sep 2026, 16:21", createdAt: "18 Mar 2026", permissions: ["View Students", "View Staff", "View Credential Status", "Manage Compromised Credentials"] },
  { name: "Peter Oyelaran", adminId: "ADM/003", email: "peter.oyelaran@unilesa.edu.ng", role: "admin", department: "Registry", status: "Disabled", lastLogin: "02 Sep 2026, 10:11", createdAt: "11 Apr 2026", permissions: ["View Students", "Generate Reports"] },
  { name: "Grace Aluko", adminId: "ADM/004", email: "grace.aluko@unilesa.edu.ng", role: "admin", department: "ICT Security", status: "Active", lastLogin: "16 Sep 2026, 07:32", createdAt: "05 May 2026", permissions: ["View Audit Logs", "View Security Alerts", "Manage Credentials"] },
  { name: "Dr. Samuel Adigun", adminId: "ADM/000", email: "samuel.adigun@unilesa.edu.ng", role: "super-admin", department: "Directorate of ICT", status: "Active", lastLogin: "16 Sep 2026, 08:15", createdAt: "12 Jan 2026", permissions: permissionGroups.flatMap((group) => group.items) },
];

export const auditLog: AuditEntry[] = Array.from({ length: 42 }, (_, index) => {
  const actions = ["Admin logged in", "Admin logged out", "User profile viewed", "Credential disabled", "Report generated", "Report exported", "Admin created", "Admin disabled", "Admin permissions changed", "System setting changed"];
  const admins = ["John Ade", "Halima Sanni", "Grace Aluko", "Dr. Samuel Adigun"];
  const administrator = pick(admins, index);
  return {
    timestamp: `${15 - (index % 4)} Sep 2026, ${String((index % 12) + 8).padStart(2, "0")}:${String((index * 9) % 60).padStart(2, "0")}`,
    administrator,
    role: administrator === "Dr. Samuel Adigun" ? "Super Admin" : "Admin",
    action: pick(actions, index),
    target: pick(["Students", "Staff", "Credential pool", "System settings", "Admin account"], index + 1),
    ip: `196.220.${(index % 20) + 10}.${(index * 7) % 250}`,
    status: index % 11 === 0 ? "Failed" : "Successful",
  };
});

export const notifications = [
  { title: "3 credentials have been reported as compromised.", time: "12 minutes ago", unread: true },
  { title: "New Admin invitation accepted.", time: "1 hour ago", unread: true },
  { title: "System generated a scheduled report.", time: "3 hours ago", unread: false },
  { title: "5 failed Admin login attempts detected.", time: "Yesterday", unread: false },
];

export const reportTypes = ["Registered Students", "Registered Staff", "All Users", "Credential Allocation", "Currently Connected Users", "Wi-Fi Connections", "Disabled Credentials", "Compromised Credentials", "User Registration", "Security Activity", "Admin Activity"];

/* Demo-only session store. A real deployment authenticates on the server and
   derives the role from the verified session, never from client state. */
const SUPER_ADMIN = adminAccounts.find((account) => account.role === "super-admin")!;
const DEFAULT_ADMIN = adminAccounts[0]!;

let current: AdminAccount = DEFAULT_ADMIN;
const listeners = new Set<() => void>();

export function setAdminSession(role: AdminRole) {
  current = role === "super-admin" ? SUPER_ADMIN : DEFAULT_ADMIN;
  listeners.forEach((listener) => listener());
}

export function useAdminSession(): AdminAccount {
  return useSyncExternalStore(
    (listener) => { listeners.add(listener); return () => listeners.delete(listener); },
    () => current,
    () => DEFAULT_ADMIN,
  );
}

export const roleLabel = (role: AdminRole) => (role === "super-admin" ? "Super Admin" : "Admin");
