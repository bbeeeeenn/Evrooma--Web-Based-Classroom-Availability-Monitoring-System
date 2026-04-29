import { BackButton } from "@/app/components/BackButton";
import { studentLoginPage } from "@/constants";
import { GraduationCap } from "lucide-react";
import { CreateInstructorForm } from "./ClientComponents";

export default function AdminCreateAccountPage() {
    return (
        <>
            <BackButton text="Login" dest={studentLoginPage} />
            <h1 className="flex items-center justify-center gap-2 text-3xl font-semibold text-white/90">
                <GraduationCap size={30} /> Sign Up
            </h1>
            <CreateInstructorForm />
        </>
    );
}
