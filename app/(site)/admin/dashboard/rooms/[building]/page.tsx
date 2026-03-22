import { adminRoomsPage } from "@/constants";
import { BackButton } from "../../SmallComponents";

export default async function BuildingPage({
    params,
}: Readonly<{ params: Promise<{ building: string }> }>) {
    const { building } = await params;
    return (
        <>
            <BackButton dest={adminRoomsPage} />
            {building}
        </>
    );
}
