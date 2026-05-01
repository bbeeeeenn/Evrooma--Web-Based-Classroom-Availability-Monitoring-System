export const homePage = "/";
export const scanLandingPage = "/scan";
export const forgotPasswordPage = "/forgot";
export const resetPasswordPage = "/resetpassword";

export const adminLoginPage = "/admin";
export const adminRoomsPage = "/admin/rooms";
export const adminAccountsPage = "/admin/accounts";
export const adminCreateAccountPage = "/admin/accounts/create";
export const adminLogoutPage = "/admin/logout";

export const instructorLoginPage = "/instructor";
export const instructorHomePage = "/instructor/home";
export const instructorScanPage = "/instructor/home/scan";
export const instructorSchedulesPage = "/instructor/home/schedules";
export const instructorRoomsPage = "/instructor/home/rooms";
export const instructorLogsPage = "/instructor/home/logs";
export const instructorLogoutPage = "/instructor/home/logout";
export const instructorSettingsPage = "/instructor/home/settings";

export const studentLoginPage = "/student";
export const studentRegisterPage = "/student/register";
export const studentHomePage = "/student/home";
export const studentRoomsPage = "/student/home/rooms";
export const studentLogsPage = "/student/home/logs";
export const studentScanPage = "/student/home/scan";
export const studentLogoutPage = "/student/home/logout";
export const studentSettingsPage = "/student/home/settings";

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
