import { AuthenticateAdmin } from "@/app/actions/AdminActions";
import { AuthProvider } from "@/app/contexts/AuthProvider";

export default async function AdminLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const initialUser = await AuthenticateAdmin();

    return (
        <AuthProvider initialUser={initialUser} authAction={AuthenticateAdmin}>
            {children}
        </AuthProvider>
    );
}
