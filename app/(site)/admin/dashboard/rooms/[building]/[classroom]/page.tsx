import { CalendarDays } from "lucide-react";
import { BackButton } from "../../../ClientComponents";
import { Divider } from "../../ClientComponents";
import { ClassroomCodeHeader, ClassroomSettings } from "./ClientComponents";

export default function AdminClassroomPage() {
    return (
        <>
            <BackButton />
            <ClassroomCodeHeader />
            <Divider text="Settings" />
            <ClassroomSettings />
            <div className="mt-15 flex items-center gap-3">
                <CalendarDays size={40} />
                <h1 className="text-4xl font-bold">Schedules</h1>
            </div>
            <Divider text="Monday" />
            <Divider text="Tuesday" />
            <Divider text="Wednesday" />
            <Divider text="Thursday" />
            <Divider text="Friday" />
            <Divider text="Saturday" />
            <Divider text="Sunday" />
        </>
    );
}
