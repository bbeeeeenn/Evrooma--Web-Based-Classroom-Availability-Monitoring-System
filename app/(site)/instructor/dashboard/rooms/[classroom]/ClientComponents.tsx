"use client";

import { DoorOpen } from "lucide-react";

export function ClassroomHeader({
    buildingName,
    classroomCode,
}: {
    buildingName: string;
    classroomCode: string;
}) {
    return (
        <>
            <div className="mx-auto my-15 flex w-fit flex-col items-center space-y-1">
                <p className="font-poppins text-text-secondary font-semibold tracking-wide">
                    {buildingName}
                </p>
                <div className="text-text-primary flex items-center gap-2 px-3 text-4xl font-bold">
                    <span>
                        <DoorOpen size={30} />
                    </span>
                    <p className="truncate underline">{classroomCode}</p>
                </div>
            </div>
        </>
    );
}
