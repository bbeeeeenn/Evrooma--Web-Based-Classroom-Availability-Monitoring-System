"use client";
import { Dispatch, SetStateAction, useState } from "react";
import clsx from "clsx";
import { Divider } from "@/app/components/Divider";
import { GetTimeComponentsFromScheduleDocument } from "@/app/lib/clientUtils";
import { PopulatedPlainScheduleDocument } from "@/app/mongoDb/models/schedule";
import { RoomScheduleCard } from "./rooms/[building]/[classroom]/ClientComponents";
import { DaysOfWeek } from "@/constants";
import { InstructorScheduleCard } from "./instructors/[instructor]/ClientComponents";

export function AdminCoolSchedules({
    groupedSchedules,
    type,
}: {
    groupedSchedules: { [key: number]: PopulatedPlainScheduleDocument[] };
    type: "instructor" | "room";
}) {
    const [day, setDay] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
    const schedules = groupedSchedules[day] ? groupedSchedules[day] : null;
    return (
        <>
            <Divider text="Weekly Schedule" />
            <div className="mb-6 flex flex-wrap gap-1.5">
                <SchedTabButton
                    index={1}
                    text="Mon"
                    day={day}
                    setDay={setDay}
                />
                <SchedTabButton
                    index={2}
                    text="Tue"
                    day={day}
                    setDay={setDay}
                />
                <SchedTabButton
                    index={3}
                    text="Wed"
                    day={day}
                    setDay={setDay}
                />
                <SchedTabButton
                    index={4}
                    text="Thu"
                    day={day}
                    setDay={setDay}
                />
                <SchedTabButton
                    index={5}
                    text="Fri"
                    day={day}
                    setDay={setDay}
                />
                <SchedTabButton
                    index={6}
                    text="Sat"
                    day={day}
                    setDay={setDay}
                />
            </div>
            {schedules ? (
                schedules.map((sched) => {
                    const {
                        endHour,
                        endMinute,
                        endMeridiem,
                        startHour,
                        startMeridiem,
                        startMinute,
                    } = GetTimeComponentsFromScheduleDocument(sched);
                    return type === "instructor" ? (
                        <InstructorScheduleCard
                            key={sched._id.toString()}
                            _id={sched._id.toString()}
                            buildingId={sched.room.building._id.toString()}
                            roomId={sched.room._id.toString()}
                            building={sched.room.building.name}
                            room={sched.room.code}
                            subject={sched.subject}
                            endHour={endHour}
                            endMinute={endMinute}
                            endMeridiem={endMeridiem}
                            startHour={startHour}
                            startMinute={startMinute}
                            startMeridiem={startMeridiem}
                            day={DaysOfWeek[sched.slot.dayOfWeek]}
                        />
                    ) : (
                        <RoomScheduleCard
                            key={sched._id.toString()}
                            _id={sched._id.toString()}
                            building={sched.room.building.name}
                            room={sched.room.code}
                            instructorFullName={sched.instructor.fullName}
                            instructorId={sched.instructor._id.toString()}
                            subject={sched.subject}
                            endHour={endHour}
                            endMinute={endMinute}
                            endMeridiem={endMeridiem}
                            startHour={startHour}
                            startMinute={startMinute}
                            startMeridiem={startMeridiem}
                            day={DaysOfWeek[sched.slot.dayOfWeek]}
                        />
                    );
                })
            ) : (
                <div className="font-dm-sans text-text-secondary py-5 text-center text-sm font-semibold">
                    No classes scheduled
                </div>
            )}
        </>
    );
}

function SchedTabButton({
    text,
    index,
    day,
    setDay,
}: {
    text: string;
    index: 1 | 2 | 3 | 4 | 5 | 6;
    day: number;
    setDay: Dispatch<SetStateAction<1 | 2 | 3 | 4 | 5 | 6>>;
}) {
    return (
        <button
            className={clsx(
                "font-dm-sans rounded-full border px-3 py-1 text-xs transition-colors sm:text-sm",
                day === index
                    ? "pointer-events-none border-orange-300/50 bg-orange-300/20 text-orange-300"
                    : "text-text-primary border-transparent hover:border-white/20 hover:bg-white/5 focus-visible:border-white/20 focus-visible:bg-white/5",
            )}
            onClick={() => setDay(index)}
            disabled={day === index}
        >
            {text}
        </button>
    );
}
