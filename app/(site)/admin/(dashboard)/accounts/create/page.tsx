import { adminAccountsPage } from "@/constants";
import { BackButton } from "../../../ClientComponents";
import { BookText } from "lucide-react";
import { CreateInstructorForm } from "./ClientComponent";

export default function AdminCreateAccountPage() {
    return (
        <>
            <BackButton dest={adminAccountsPage} />
            <h1 className="flex items-center justify-center gap-2 text-3xl font-bold">
                <BookText size={30} /> New Instructor
            </h1>
            <CreateInstructorForm />
        </>
    );
}
