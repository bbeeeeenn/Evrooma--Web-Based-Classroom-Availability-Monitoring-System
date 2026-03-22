import { adminDashboardPage } from "@/constants";
import { BackButton } from "../SmallComponents";

export default function ChartsPage() {
    return (
        <>
            <BackButton dest={adminDashboardPage} />
            <h1 className="flex items-center gap-2 text-4xl font-bold">
                Charts
            </h1>
        </>
    );
}
