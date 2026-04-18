"use client";
import clsx from "clsx";
import { ChangeEvent, FormEvent, SubmitEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CreateSchedule } from "@/app/actions/ScheduleActions";
import { adminRoomsPage } from "@/constants";
import {
    _Instructor,
    DayOfWeek,
    Meridiem,
    Minute,
    useNewScheduleData,
    useUpdateScheduleData,
} from "./NewScheduleProvider";
import {
    BookText,
    ChevronDown,
    ClockAlert,
    ClockCheck,
    LoaderCircle,
    Pencil,
    PlusCircle,
    Sun,
} from "lucide-react";

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
                    "flex min-w-12 grow cursor-pointer items-center justify-center rounded-md py-1 text-xs font-bold uppercase shadow-sm transition-all sm:py-2",
                    checked
                        ? "bg-yellow-primary scale-y-120 text-black"
                        : "text-text-primary/90 bg-green-secondary",
                )}
            >
                <input
                    type="checkbox"
                    name={name}
                    id={name}
                    checked={checked}
                    className="hidden"
                    onChange={onDayChange}
                />
                {name}
            </label>
        </>
    );
}

function Day() {
    const newScheduleData = useNewScheduleData();
    const { day } = newScheduleData;
    const updateNewSchedule = useUpdateScheduleData();

    const onDayChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newSet = new Set(day);
        if (e.target.checked) newSet.add(e.target.name as DayOfWeek);
        else newSet.delete(e.target.name as DayOfWeek);
        updateNewSchedule({ ...newScheduleData, day: newSet });
    };

    return (
        <div className="flex flex-wrap justify-evenly gap-1">
            {(["mon", "tue", "wed", "thu", "fri", "sat"] as DayOfWeek[]).map(
                (d) => (
                    <DayOfWeekInput
                        key={d}
                        day={day}
                        name={d}
                        onDayChange={onDayChange}
                    />
                ),
            )}
        </div>
    );
}

function Time({ type }: { type: "start" | "end" }) {
    const newScheduleData = useNewScheduleData();
    const updateNewSchedule = useUpdateScheduleData();

    const dialog = useRef<HTMLDialogElement>(null);
    const hour =
        type === "start"
            ? newScheduleData.startTime.hour
            : newScheduleData.endTime.hour;
    const updateHour = (h: number) => {
        updateNewSchedule(
            type === "start"
                ? {
                      ...newScheduleData,
                      startTime: { ...newScheduleData.startTime, hour: h },
                  }
                : {
                      ...newScheduleData,
                      endTime: { ...newScheduleData.endTime, hour: h },
                  },
        );
    };

    const minute =
        type === "start"
            ? newScheduleData.startTime.minute
            : newScheduleData.endTime.minute;
    const updateMinute = () => {
        updateNewSchedule(
            type === "start"
                ? {
                      ...newScheduleData,
                      startTime: {
                          ...newScheduleData.startTime,
                          minute:
                              newScheduleData.startTime.minute === 0 ? 30 : 0,
                      },
                  }
                : {
                      ...newScheduleData,
                      endTime: {
                          ...newScheduleData.endTime,
                          minute: newScheduleData.endTime.minute === 0 ? 30 : 0,
                      },
                  },
        );
    };

    const meridiem =
        type === "start"
            ? newScheduleData.startTime.meridiem
            : newScheduleData.endTime.meridiem;
    const updateMeridiem = (newMeridiem: Meridiem) => {
        updateNewSchedule(
            type === "start"
                ? {
                      ...newScheduleData,
                      startTime: {
                          ...newScheduleData.startTime,
                          hour: newMeridiem === "am" ? 5 : 12,
                          meridiem: newMeridiem,
                      },
                  }
                : {
                      ...newScheduleData,
                      endTime: {
                          ...newScheduleData.endTime,
                          hour: newMeridiem === "am" ? 5 : 12,
                          meridiem: newMeridiem,
                      },
                  },
        );
    };
    return (
        <>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="bg-green-secondary hover:bg-green-tertiary active:bg-green-tertiary focus-visible:bg-green-tertiary text-text-primary font-roboto max-w-50 grow cursor-pointer appearance-none rounded-md px-5 py-2 text-center text-2xl shadow-md sm:text-4xl"
                    onClick={() => {
                        if (dialog.current?.open) dialog.current.close();
                        else dialog.current?.show();
                    }}
                >
                    {hour < 10 ? "0" + hour : hour}
                </button>
                <p className="text-text-primary text-2xl sm:text-4xl">:</p>
                <button
                    type="button"
                    className="bg-green-secondary hover:bg-green-tertiary active:bg-green-tertiary focus-visible:bg-green-tertiary text-text-primary font-roboto max-w-50 grow appearance-none rounded-md px-5 py-2 text-center text-2xl shadow-md sm:text-4xl"
                    onClick={updateMinute}
                >
                    {minute === 0 ? "00" : "30"}
                </button>
                <button
                    type="button"
                    className="bg-green-secondary hover:bg-green-tertiary active:bg-green-tertiary focus-visible:bg-green-tertiary text-text-primary font-roboto ml-2 appearance-none rounded-md px-5 py-2 text-center text-2xl shadow-md sm:text-4xl"
                    onClick={() =>
                        updateMeridiem(meridiem === "am" ? "pm" : "am")
                    }
                >
                    {meridiem === "am" ? "AM" : "PM"}
                </button>
            </div>
            <dialog
                ref={dialog}
                className="text-text-primary static mt-2 w-full space-y-2 bg-transparent"
            >
                {Array.from({ length: meridiem === "am" ? 7 : 9 }, (_, i) =>
                    meridiem === "am" ? i + 5 : i === 0 ? 12 : i,
                ).map((n) => {
                    const selected = hour === n;
                    return (
                        <button
                            key={n}
                            type="button"
                            className={clsx(
                                "block w-1/3 max-w-50 min-w-17 rounded-md py-2 font-semibold tracking-wider shadow-md",
                                selected
                                    ? "bg-yellow-primary hover:bg-yellow-secondary active:bg-yellow-secondary focus-visible:bg-yellow-secondary text-black"
                                    : "bg-green-secondary hover:bg-green-tertiary active:bg-green-tertiary focus-visible:bg-green-tertiary",
                            )}
                            onClick={() => {
                                updateHour(n);
                                dialog.current?.close();
                            }}
                        >
                            {n < 10 ? "0" + n : n}
                        </button>
                    );
                })}
            </dialog>
        </>
    );
}

function SelectInstructor({ instructors }: { instructors: _Instructor[] }) {
    const newScheduleData = useNewScheduleData();
    const updateNewSchedule = useUpdateScheduleData();
    const chosen = newScheduleData.instructor;
    const setChosen = (instructor: _Instructor | null) => {
        updateNewSchedule({ ...newScheduleData, instructor });
    };

    const modal = useRef<HTMLDialogElement>(null);
    return (
        <>
            {chosen && (
                <input type="hidden" name="instructor" value={chosen?.id} />
            )}
            <button
                type="button"
                className={clsx(
                    "font-roboto hover:bg-green-tertiary text-text-primary active:bg-green-tertiary focus-visible:bg-green-tertiary bg-green-secondary mt-8 flex w-full items-center justify-between rounded-md px-5 py-2 text-xl font-bold shadow-md sm:text-2xl",
                    chosen && "border-yellow-primary border-l-4",
                )}
                onClick={() => {
                    if (modal.current?.open) modal.current.close();
                    else modal.current?.show();
                }}
            >
                <span className="truncate tracking-wide">
                    {!chosen ? (
                        "Select Instructor"
                    ) : (
                        <span className="flex items-center gap-1">
                            <span>
                                <BookText />
                            </span>
                            <p className="truncate">{chosen.name}</p>
                        </span>
                    )}
                </span>
                <span>
                    <ChevronDown />
                </span>
            </button>
            <dialog
                ref={modal}
                className="text-text-primary static w-full space-y-2 overflow-visible bg-transparent px-3 pt-2"
                onClick={(e) => {
                    if (!modal.current) return;
                    const x = e.clientX;
                    const y = e.clientY;
                    const modalDimensions =
                        modal.current.getBoundingClientRect();
                    if (
                        x < modalDimensions.left ||
                        x > modalDimensions.right ||
                        y < modalDimensions.top ||
                        y > modalDimensions.bottom
                    )
                        modal.current.close();
                }}
            >
                {instructors.map((instructor) => {
                    const selected = instructor.id === chosen?.id;
                    return (
                        <button
                            type="button"
                            key={instructor.id}
                            className={clsx(
                                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-start text-lg shadow-md",
                                selected
                                    ? "hover:bg-yellow-secondary active:bg-yellow-secondary focus-visible:bg-yellow-secondary bg-yellow-primary font-semibold text-black"
                                    : "hover:bg-green-tertiary text-text-primary active:bg-green-tertiary focus-visible:bg-green-tertiary bg-green-secondary",
                            )}
                            onClick={() => {
                                setChosen(selected ? null : instructor);
                                modal.current?.close();
                            }}
                        >
                            <span>
                                <BookText />
                            </span>
                            <p className="truncate">{instructor.name}</p>
                        </button>
                    );
                })}
            </dialog>
        </>
    );
}

function InputSubject() {
    const newScheduleData = useNewScheduleData();
    const updateNewSchedule = useUpdateScheduleData();
    const onSubjectChange = (e: ChangeEvent<HTMLInputElement>) => {
        updateNewSchedule({ ...newScheduleData, subject: e.target.value });
    };
    return (
        <div className="text-text-primary bg-green-secondary relative mt-10 flex items-center gap-2 rounded-md py-2 pr-5 pl-3 shadow-md">
            <input
                type="text"
                name="subject"
                id="subject"
                required
                className="peer w-full text-xl font-medium uppercase placeholder:text-transparent sm:text-2xl"
                placeholder="Subject"
                autoComplete="off"
                value={newScheduleData.subject}
                onChange={onSubjectChange}
            />
            <label htmlFor="subject" className="cursor-text">
                <Pencil />
            </label>
            <label
                htmlFor="subject"
                className={clsx(
                    "pointer-events-none absolute -top-6 left-3 text-sm font-semibold transition-all peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-2xl peer-focus:-top-6 peer-focus:text-sm sm:peer-placeholder-shown:top-2 sm:peer-focus:-top-6",
                )}
            >
                Subject / Course
            </label>
        </div>
    );
}

const Label = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <p className="text-text-primary mt-6 mb-1.5 flex items-center gap-1 text-xl font-bold">
        <span>{icon}</span>
        {text}
    </p>
);

export function CreateScheduleForm({
    instructors,
    buildingId,
    classroomId,
}: {
    instructors: _Instructor[];
    buildingId: string;
    classroomId: string;
}) {
    const newScheduleData = useNewScheduleData();
    const updateScheduleData = useUpdateScheduleData();
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const onFormSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isPending) return;

        setIsPending(true);
        const loadingToast = toast.loading("Creating schedule...");
        const response = await CreateSchedule({
            ...newScheduleData,
            day: [...newScheduleData.day],
        });

        if (response.status === "success") {
            toast.update(loadingToast, {
                isLoading: false,
                type: "success",
                render: response.message,
                autoClose: 3000,
            });
            router.replace(`${adminRoomsPage}/${buildingId}/${classroomId}`);
            updateScheduleData({
                day: new Set(),
                startTime: { hour: 5, minute: 0, meridiem: "am" },
                endTime: { hour: 5, minute: 0, meridiem: "am" },
                instructor: null,
                roomId: classroomId,
                subject: "",
            });
        } else {
            toast.update(loadingToast, {
                isLoading: false,
                type: "error",
                render: response.message,
                autoClose: 3000,
            });
        }

        setIsPending(false);
    };

    return (
        <form onSubmit={onFormSubmit}>
            <Label icon={<Sun />} text="Day" />
            <Day />
            <Label icon={<ClockAlert />} text="Start Time" />
            <Time type="start" />
            <Label icon={<ClockCheck />} text="End Time" />
            <Time type="end" />
            <SelectInstructor instructors={instructors} />
            <InputSubject />
            <button
                type="submit"
                disabled={isPending}
                className="bg-yellow-primary focus-visible:bg-yellow-secondary active:bg-yellow-secondary hover:bg-yellow-secondary mt-10 flex w-full items-center justify-center gap-2 rounded-md px-5 py-2.5 font-bold text-black shadow-md"
            >
                {isPending ? (
                    <>
                        <LoaderCircle className="animate-spin" />
                        <p>Creating...</p>
                    </>
                ) : (
                    <>
                        <span>
                            <PlusCircle />
                        </span>
                        <p>Create</p>
                    </>
                )}
            </button>
        </form>
    );
}
