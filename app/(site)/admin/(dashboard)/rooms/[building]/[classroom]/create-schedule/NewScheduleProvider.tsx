"use client";
import { createContext, useContext, useState } from "react";

export type _Instructor = { name: string; id: string };
export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
export type Meridiem = "am" | "pm";
export type Minute = 0 | 30;

export type NewSchedule = {
    roomId: string;
    day: Set<DayOfWeek>;
    startTime: { hour: number; minute: Minute; meridiem: Meridiem };
    endTime: { hour: number; minute: Minute; meridiem: Meridiem };
    instructor: _Instructor | null;
    subject: string;
};

const NewScheduleContext = createContext<NewSchedule>({
    roomId: "",
    day: new Set([]),
    instructor: null,
    startTime: { hour: 5, minute: 0, meridiem: "am" },
    endTime: { hour: 5, minute: 0, meridiem: "am" },
    subject: "",
});
const UpdateNewScheduleContext = createContext<(newData: NewSchedule) => void>(
    () => null,
);

export default function NewScheduleProvider({
    classroomId,
    children,
}: {
    classroomId: string;
    children: React.ReactNode;
}) {
    const [newScheduleData, setNewSchedule] = useState<NewSchedule>({
        roomId: classroomId,
        day: new Set([]),
        instructor: null,
        startTime: { hour: 5, minute: 0, meridiem: "am" },
        endTime: { hour: 5, minute: 0, meridiem: "am" },
        subject: "",
    });

    const updateNewScheduleData = (newData: NewSchedule) => {
        setNewSchedule(newData);
    };

    return (
        <NewScheduleContext.Provider value={newScheduleData}>
            <UpdateNewScheduleContext value={updateNewScheduleData}>
                {children}
            </UpdateNewScheduleContext>
        </NewScheduleContext.Provider>
    );
}

export function useNewScheduleData() {
    return useContext(NewScheduleContext);
}

export function useUpdateScheduleData() {
    return useContext(UpdateNewScheduleContext);
}
