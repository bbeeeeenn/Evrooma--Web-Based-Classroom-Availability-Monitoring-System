import { BackButton } from "../../../ClientComponents";
import { Divider } from "../ClientComponents";
import { ClassroomCodeHeader, ClassroomSettings } from "./ClientComponents";

export default function AdminClassroomPage() {
    return (
        <>
            <BackButton />
            <ClassroomCodeHeader />
            <Divider text="Settings" />
            <ClassroomSettings />
        </>
    );
}
