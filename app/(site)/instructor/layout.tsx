import { AuthenticateInstructor } from "@/app/actions/InstructorAuth";
import { AuthProvider } from "@/app/context_providers/AuthProvider";

export default function Layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <AuthProvider authAction={AuthenticateInstructor}>
            {children}
        </AuthProvider>
    );
}
