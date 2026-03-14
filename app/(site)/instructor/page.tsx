import { InstructorAuth } from "@/app/actions/InstructorActions";
import LoginForm from "@/app/components/LoginForm";

export default function InstructorLoginPage() {
    return (
        <section className="flex h-svh flex-col items-center justify-center bg-white sm:bg-transparent">
            <LoginForm formType="instructor" action={InstructorAuth} />
        </section>
    );
}
