"use client";
import clsx from "clsx";
import { ChangeEvent, useState } from "react";

type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
const DayOfWeekArray: DayOfWeek[] = ["mon", "tue", "wed", "thu", "fri", "sat"];

function DayOfWeekInput({
    name,
    day,
    onDayChange,
}: Readonly<{
    name: DayOfWeek;
    day: Set<DayOfWeek>;
    onDayChange: (e: ChangeEvent<HTMLInputElement>) => void;
}>) {
    const checked = day.has(name);
    return (
        <>
            <label
                htmlFor={name}
                className={clsx(
                    "flex min-w-12 grow items-center justify-center rounded-md py-1 text-xs font-bold shadow-sm sm:py-2",
                    checked
                        ? "bg-yellow-500 text-black"
                        : "text-text-primary/90 bg-green-700",
                )}
            >
                <input
                    type="checkbox"
                    name={name}
                    id={name}
                    onChange={onDayChange}
                    checked={checked}
                    className="hidden"
                />
                {name.toUpperCase()}
            </label>
        </>
    );
}

function Day() {
    const [day, setDay] = useState<Set<DayOfWeek>>(new Set());

    const onDayChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDay((prev) => {
            const newSet = new Set(prev);
            if (e.target.checked) newSet.add(e.target.name as DayOfWeek);
            else newSet.delete(e.target.name as DayOfWeek);
            return newSet;
        });
    };

    return (
        <div className="mt-10 flex flex-wrap justify-evenly gap-1">
            {DayOfWeekArray.map((d) => (
                <DayOfWeekInput
                    key={d}
                    day={day}
                    name={d}
                    onDayChange={onDayChange}
                />
            ))}
        </div>
    );
}

export function CreateScheduleForm() {
    return (
        <form action={() => {}} onSubmit={(e) => e.preventDefault()}>
            <Day />
        </form>
    );
}
