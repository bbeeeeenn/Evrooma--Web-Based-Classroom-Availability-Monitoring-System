"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { GetTimeComponentsFromScheduleDocument } from "../lib/clientUtils";
import { PopulatedPlainScheduleDocument } from "../mongoDb/models/schedule";
import { Divider } from "./Divider";
import clsx from "clsx";

export function CoolSchedules({
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
            <div className="mb-4 flex flex-wrap gap-1.5">
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
                    const slot = GetTimeComponentsFromScheduleDocument(sched);
                    return (
                        <div
                            key={sched._id.toString()}
                            className="font-dm-sans bg-green-secondary text-text-primary border-yellow-primary/20 mb-2 flex items-center gap-4 border px-4 py-2 text-sm font-semibold sm:text-base"
                        >
                            <p className="font-roboto-mono text-yellow-primary">
                                {slot.startHour}:{slot.startMinute}
                                {slot.startMeridiem}-{slot.endHour}:
                                {slot.endMinute}
                                {slot.endMeridiem}
                            </p>
                            <div>
                                <p>{sched.subject}</p>
                                <p className="text-text-primary/60 text-xs sm:text-sm">
                                    {type === "instructor"
                                        ? sched.instructor.fullName
                                        : `${sched.room.code}-${sched.room.building.name}`}
                                </p>
                            </div>
                        </div>
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
