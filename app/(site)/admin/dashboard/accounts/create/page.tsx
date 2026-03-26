import { adminAccountsPage } from "@/constants";
import { BackButton } from "../../ClientComponents";

export default function AdminCreateAccountPage() {
    return (
        <>
            <BackButton dest={adminAccountsPage} />
        </>
    );
}
