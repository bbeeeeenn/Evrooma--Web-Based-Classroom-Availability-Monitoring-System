import { BackButton } from "@/app/components/BackButton";
import { instructorDashboardPage } from "@/constants";
import { QRScanner } from "./ScannerComponent";

export default function Page() {
    return (
        <>
            <BackButton dest={instructorDashboardPage} />
            <QRScanner />
        </>
    );
}
