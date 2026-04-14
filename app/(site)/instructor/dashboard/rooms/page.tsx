import { BackButton } from "@/app/components/BackButton";
import { instructorDashboardPage } from "@/constants";

export default function RoomsPage() {
    return (
        <>
            <BackButton dest={instructorDashboardPage} />
        </>
    );
}
