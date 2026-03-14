import { AuthenticateAdmin } from "@/app/actions/AdminActions";
import { AuthProvider } from "@/app/contexts/AuthProvider";

export default function AdminLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <AuthProvider authAction={AuthenticateAdmin}>{children}</AuthProvider>
    );
}
