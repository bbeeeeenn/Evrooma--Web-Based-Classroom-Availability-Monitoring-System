import { adminAccountsPage } from "@/constants";
import { BackButton, Divider } from "../../../ClientComponents";
import { InstructorInfoComponent } from "./ClientComponents";
import { CalendarDays } from "lucide-react";

export default function InstructorInfoPage() {
    return (
        <>
            <BackButton dest={adminAccountsPage} />
            <InstructorInfoComponent />
            <div className="mt-10 flex items-center gap-3">
                <CalendarDays size={40} />
                <h1 className="text-4xl font-bold">Schedules</h1>
            </div>
        </>
    );
}
