export type UserType = "student" | "staff";

export type PortalUser = {
  name: string;
  firstName: string;
  universityId: string;
  email: string;
  department: string;
  faculty: string;
  type: UserType;
  status: "Active";
};

export type WifiCredential = {
  username: string;
  password: string;
  network: string;
  status: "Active";
  assignedAt: string;
};

export const students: Record<UserType, PortalUser> = {
  student: {
    name: "Ibrahim Salami",
    firstName: "Ibrahim",
    universityId: "CSC/2021/0042",
    email: "i•••••@unilesa.edu.ng",
    department: "Computer Science",
    faculty: "Computing",
    type: "student",
    status: "Active",
  },
  staff: {
    name: "Amina Yusuf",
    firstName: "Amina",
    universityId: "UNI/STAFF/0184",
    email: "a•••••@unilesa.edu.ng",
    department: "Information and Communication Technology",
    faculty: "Registry and ICT",
    type: "staff",
    status: "Active",
  },
};

export const wifiCredential: WifiCredential = {
  username: "UNI-WIFI-001284",
  password: "UwiFi@2026!284",
  network: "University-WiFi",
  status: "Active",
  assignedAt: "September 14, 2026",
};

export const departments = [
  "Computer Science",
  "Accounting",
  "Biological Sciences",
  "Business Administration",
  "Economics",
  "English and Literary Studies",
  "Information and Communication Technology",
];

export const faculties = [
  "Computing",
  "Arts",
  "Basic and Applied Sciences",
  "Management Sciences",
  "Social Sciences",
  "Registry and ICT",
];
