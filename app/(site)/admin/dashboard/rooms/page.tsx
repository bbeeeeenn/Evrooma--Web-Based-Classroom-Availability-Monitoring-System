import { BackButton } from "../SmallComponents";
import AddBuilding from "./AddBuilding";

export default function AdminRoomsPage() {
    return (
        <>
            <BackButton />
            <h1 className="flex items-center gap-2 text-4xl font-bold">
                Buildings
            </h1>
            <AddBuilding />
        </>
    );
}
