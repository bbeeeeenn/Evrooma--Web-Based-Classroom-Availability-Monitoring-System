import { AuthenticateInstructor } from "@/app/actions/InstructorActions";
import { AuthProvider } from "@/app/contexts/AuthProvider";

export default function Layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <AuthProvider authAction={AuthenticateInstructor}>
            {children}
        </AuthProvider>
    );
}
