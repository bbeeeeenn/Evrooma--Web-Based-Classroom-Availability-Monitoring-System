# EVROOMA

## Project description

Evrooma is a web-based classroom availability and attendance monitoring system. It provides:

- Real-time classroom occupancy and schedule visibility
- QR-based scanning for instructors and students to mark attendance
- Role-based dashboards for administrators, instructors, and students
- Attendance logging and simple reporting features

---

## Setup instructions

Prerequisites:

- Node.js (v18+ recommended)
- A running MongoDB instance (connection URI)

Steps:

1. Create a copy of environment variables (example `.env.local`) and set at minimum:

```
MONGODB_URI=<your-mongodb-uri>
DB_NAME=<your-database-name>
ADMIN_SESSION_SECRET=<random-secret>
INSTRUCTOR_SESSION_SECRET=<random-secret>
STUDENT_SESSION_SECRET=<random-secret>
ADMIN_USERNAME=<admin-username>
ADMIN_PASSWORD=<admin-password>
RESEND_API_KEY=<optional-resend-key>
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Build and start for production:

```bash
npm run build
npm run start
```

## Technologies used

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- MongoDB with Mongoose
- iron-session for server-side sessions
- @yudiel/react-qr-scanner for QR scanning
- lucide-react for icons
- bcrypt for password hashing

For details, see `package.json` dependencies.
