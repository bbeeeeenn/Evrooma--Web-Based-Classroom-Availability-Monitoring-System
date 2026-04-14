import { BackButton } from "@/app/components/BackButton";
import { instructorDashboardPage } from "@/constants";

export default function SchedulesPage() {
    return (
        <>
            <BackButton dest={instructorDashboardPage} />
        </>
    );
}
