export const homePage = "/";
export const scanLandingPage = "/scan";
export const forgotPasswordPage = "/forgot";
export const resetPasswordPage = "/resetpassword";

export const adminLoginPage = "/admin";
export const adminRoomsPage = "/admin/rooms";
export const adminLogoutPage = "/admin/logout";
export const adminInstructorsPage = "/admin/instructors";
export const adminCreateInstructorPage = "/admin/instructors/create";
export const adminStudentsPage = "/admin/students";

export const instructorLoginPage = "/instructor";
export const instructorHomePage = "/instructor/dashboard";
export const instructorScanPage = "/instructor/dashboard/scan";
export const instructorSchedulesPage = "/instructor/dashboard/schedules";
export const instructorRoomsPage = "/instructor/dashboard/rooms";
export const instructorLogsPage = "/instructor/dashboard/logs";
export const instructorLogoutPage = "/instructor/dashboard/logout";
export const instructorSettingsPage = "/instructor/dashboard/settings";

export const studentLoginPage = "/student";
export const studentRegisterPage = "/student/register";
export const studentHomePage = "/student/dashboard";
export const studentRoomsPage = "/student/dashboard/rooms";
export const studentLogsPage = "/student/dashboard/logs";
export const studentScanPage = "/student/dashboard/scan";
export const studentLogoutPage = "/student/dashboard/logout";
export const studentSettingsPage = "/student/dashboard/settings";

export const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "";
export const INSTRUCTOR_SESSION_SECRET =
    process.env.INSTRUCTOR_SESSION_SECRET || "";
export const STUDENT_SESSION_SECRET = process.env.STUDENT_SESSION_SECRET || "";
export const MONGODB_URI = process.env.MONGODB_URI || "";
export const DB_NAME = process.env.DB_NAME || "";
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
export const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

export const DaysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

export const Months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
