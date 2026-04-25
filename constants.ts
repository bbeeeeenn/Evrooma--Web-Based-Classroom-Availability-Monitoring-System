export const homePage = "/";
export const scanLandingPage = "/scan";

export const adminLoginPage = "/admin";
export const adminLoginForgotPage = "/admin/forgot";
export const adminRoomsPage = "/admin/rooms";
export const adminAccountsPage = "/admin/accounts";
export const adminCreateAccountPage = "/admin/accounts/create";
export const adminChartsPage = "/admin/charts";
export const adminLogoutPage = "/admin/logout";

export const instructorLoginPage = "/instructor";
export const instructorLoginForgotPage = "/instructor/forgot";
export const instructorDashboardPage = "/instructor/dashboard";
export const instructorScanPage = "/instructor/dashboard/scan";
export const instructorSchedulesPage = "/instructor/dashboard/schedules";
export const instructorRoomsPage = "/instructor/dashboard/rooms";
export const instructorLogoutPage = "/instructor/logout";

export const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET!;
export const INSTRUCTOR_SESSION_SECRET = process.env.INSTRUCTOR_SESSION_SECRET!;
export const MONGODB_URI = process.env.MONGODB_URI!;
export const DB_NAME = process.env.DB_NAME!;
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME!;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

export const DaysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
