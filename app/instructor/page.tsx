import { InstructorAuth } from "@/actions/InstructorAuth";
import InstructorLoginForm from "./LoginForm";

export default function InstructorLoginPage() {
    return (
        <section className="flex h-svh flex-col items-center justify-center bg-white sm:bg-transparent">
            <InstructorLoginForm action={InstructorAuth} />
        </section>
    );
}
