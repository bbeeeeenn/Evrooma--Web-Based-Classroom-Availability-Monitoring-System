"use client";
import { useUserInfo } from "@/app/contexts/UserInfoProvider";
import {
    BookText,
    Building2,
    DoorOpen,
    History,
    LinkIcon,
    LoaderCircle,
    Trash2,
    TriangleAlert,
    X,
} from "lucide-react";
import { Divider } from "@/app/components/Divider";
import { useActionState, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { toast } from "react-toastify";
import { DeleteUser } from "@/app/actions/UserActions";
import { useRouter } from "next/navigation";
import { adminInstructorsPage, adminRoomsPage, Months } from "@/constants";
import { DeleteSchedule } from "@/app/actions/ScheduleActions";
import Link from "next/link";
import { getPHDateTime } from "@/app/lib/clientUtils";

function DeleteAccount() {
    const router = useRouter();
    const dialog = useRef<HTMLDialogElement>(null);
    const { userId: instructorId, email: instructorEmail } = useUserInfo();

    const onFormAction = async (
        _: {
            modalOpened: boolean;
            email: string;
        },
        formData: FormData,
    ): Promise<{
        modalOpened: boolean;
        email: string;
    }> => {
        const loadingToast = toast.loading("Waiting...");
        const email = (formData.get("email") as string)?.trim() || "";
        if (!email) {
            toast.update(loadingToast, {
                isLoading: false,
                type: "error",
                autoClose: 3000,
                render: "Please enter the email to confirm.",
            });
            return { email, modalOpened: true };
        }

        if (email !== instructorEmail) {
            toast.update(loadingToast, {
                isLoading: false,
                type: "error",
                autoClose: 3000,
                render: "Email doesn't match.",
            });
            return { email, modalOpened: true };
        }

        const response = await DeleteUser(instructorId);
        toast.update(loadingToast, {
            isLoading: false,
            type: response.status as "success" | "error",
            autoClose: 3000,
            render: response.message,
        });
        if (response.status === "success") router.replace(adminInstructorsPage);

        return { email: "", modalOpened: response.status === "error" };
    };

    const [state, formAction, isPending] = useActionState(onFormAction, {
        modalOpened: false,
        email: "",
    });

    useEffect(() => {
        if (state.modalOpened) {
            dialog.current?.showModal();
        } else {
            dialog.current?.close();
        }
    });

    return (
        <>
            <dialog
                ref={dialog}
                className="bg-green-secondary text-text-primary border-green-quarternary m-auto w-[calc(100%-1.5rem)] max-w-md overflow-hidden rounded-md border-b-4 px-6 pt-5 pb-7 select-none backdrop:bg-black/30"
                onClick={(e) => {
                    if (!dialog.current) return;
                    const { top, bottom, left, right } =
                        dialog.current.getBoundingClientRect();
                    if (
                        e.clientX < left ||
                        e.clientX > right ||
                        e.clientY < top ||
                        e.clientY > bottom
                    )
                        dialog.current.close();
                }}
            >
                <p className="mb-4 flex items-center justify-center gap-2 text-2xl font-semibold">
                    <span>
                        <TriangleAlert size={25} />
                    </span>
                    Delete User
                </p>
                <form action={formAction}>
                    <label
                        htmlFor="email"
                        className="font-poppins mb-2 block text-sm"
                    >
                        To confirm, type{" "}
                        <span className="bg-white/10">{instructorEmail}</span>{" "}
                        in the box below
                    </label>
                    <input
                        spellCheck={false}
                        autoComplete="off"
                        type="text"
                        id="email"
                        name="email"
                        defaultValue={state.email}
                        className="peer w-full rounded-md border-2 border-white/25 bg-white/10 px-2 py-1 text-xl font-semibold tracking-wide outline-none"
                        required
                        placeholder="Confirm Email"
                    />
                    <div className="flex gap-2 font-semibold">
                        <button
                            type="button"
                            className={clsx(
                                "bg-yellow-primary hover:bg-yellow-secondary active:bg-yellow-secondary focus-visible:bg-yellow-secondary mt-5 flex cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-2 text-black",
                            )}
                            onClick={() => dialog.current?.close()}
                        >
                            <X /> Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className={clsx(
                                "bg-yellow-primary hover:bg-yellow-secondary active:bg-yellow-secondary focus-visible:bg-yellow-secondary mt-5 flex grow items-center justify-center gap-1 rounded-md px-3 py-2 text-black",
                                !isPending && "cursor-pointer",
                            )}
                        >
                            {isPending ? (
                                <>
                                    <LoaderCircle className="animate-spin" />{" "}
                                    Waiting...
                                </>
                            ) : (
                                <>
                                    <Trash2 /> Delete
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </dialog>
            <button
                className="font-poppins hover:bg-yellow-secondary bg-yellow-primary flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-md transition-colors sm:text-base"
                onClick={() => dialog.current?.showModal()}
            >
                <Trash2 size={20} /> Delete Account
            </button>
        </>
    );
}

export function InstructorInfoComponent() {
    const {
        email,
        fname,
        lname,
        userId: instructorId,
        createdAt,
    } = useUserInfo();

    const dateCreated = getPHDateTime(createdAt ?? new Date());

    return (
        <>
            <div className="flex w-full items-center gap-2 text-white/90">
                <div className="rounded-md border border-white/15 bg-white/10 p-2">
                    <BookText size={30} />
                </div>
                <div>
                    <p className="text-2xl font-bold wrap-anywhere">{`${fname} ${lname}`}</p>
                    <p className="text-sm font-semibold wrap-anywhere">
                        {email}
                    </p>
                </div>
            </div>

            <Divider text="Account" />
            {createdAt && (
                <p className="font-dm-sans text-text-primary mb-6">
                    <span className="text-text-primary/70">Date created:</span>{" "}
                    {Months[dateCreated.month]} {dateCreated.day},{" "}
                    {dateCreated.year}
                </p>
            )}
            <div className="flex">
                <Link
                    href={`${instructorId}/logs`}
                    className="font-poppins hover:bg-yellow-secondary bg-yellow-primary mr-3 flex w-fit cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-md transition-colors sm:text-base"
                >
                    <History size={20} /> Logs
                </Link>
                <DeleteAccount />
            </div>
        </>
    );
}

export function InstructorScheduleCard({
    _id,
    building,
    buildingId,
    room,
    roomId,
    subject,
    startHour,
    startMinute,
    startMeridiem,
    endHour,
    endMinute,
    endMeridiem,
    day,
}: {
    _id: string;
    building: string;
    buildingId: string;
    room: string;
    roomId: string;
    subject: string;
    startHour: number;
    startMinute: string;
    startMeridiem: string;
    endHour: number;
    endMinute: string;
    endMeridiem: string;
    day: string;
}) {
    const dialog = useRef<HTMLDialogElement>(null);
    const [isPending, setIsPending] = useState(false);
    const { fname, lname } = useUserInfo();
    const handleDelete = async () => {
        if (isPending) return;
        setIsPending(true);
        const loadingToast = toast.loading("Waiting...");
        const response = await DeleteSchedule(_id);
        toast.update(loadingToast, {
            isLoading: false,
            type: response.status as "success" | "error",
            autoClose: 3000,
            render: response.message,
        });
        setIsPending(false);
    };
    return (
        <>
            <dialog
                ref={dialog}
                className="bg-green-primary text-text-primary m-auto w-[calc(100%-1.5rem)] max-w-md rounded-md p-4 shadow-md select-none backdrop:bg-black/30"
                onClick={(e) => {
                    if (!dialog.current) return;
                    const { left, right, top, bottom } =
                        dialog.current.getBoundingClientRect();
                    const { clientX: x, clientY: y } = e;
                    if (x < left || x > right || y < top || y > bottom)
                        dialog.current.close();
                }}
            >
                <div className="bg-green-secondary rounded-md px-2 py-1 shadow-md">
                    <p className="font-poppins text-2xl font-semibold">
                        {day}{" "}
                        <span className="font-roboto-mono">
                            @{startHour}:{!startMinute && "0"}
                            {startMinute}
                            {startMeridiem}-{endHour}:{endMinute}
                            {endMeridiem}
                        </span>
                    </p>
                    <p className="font-poppins mt-1 flex items-center gap-1 text-xl font-semibold">
                        <span>
                            <BookText size={20} />
                        </span>
                        <span>
                            {fname} {lname}
                        </span>
                    </p>
                    <p className="font-poppins mt-1 flex items-center gap-1 text-xl font-semibold">
                        <span>
                            <DoorOpen size={20} />
                        </span>
                        <Link
                            href={`${adminRoomsPage}/${buildingId}/${roomId}`}
                            className="hover:underline focus:underline active:underline"
                            onClick={() => dialog.current?.close()}
                        >
                            {room}
                        </Link>
                        <span>
                            <LinkIcon size={15} />
                        </span>
                    </p>
                    <p className="font-poppins mt-1 flex items-center gap-1 font-semibold">
                        <span>
                            <Building2 size={20} />
                        </span>
                        <span>{building}</span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className={clsx(
                            "bg-yellow-primary active:bg-yellow-secondary focus-visible:bg-yellow-secondary hover:bg-yellow-secondary mt-5 flex cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-2 font-semibold text-black",
                        )}
                        onClick={() => dialog.current?.close()}
                    >
                        <X /> Cancel
                    </button>
                    <button
                        type="submit"
                        className={clsx(
                            "bg-yellow-primary focus-visible:bg-yellow-secondary active:bg-yellow-secondary hover:bg-yellow-secondary mt-5 flex grow cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-2 font-semibold text-black shadow-md",
                        )}
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <LoaderCircle className="animate-spin" />{" "}
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 /> Delete
                            </>
                        )}
                    </button>
                </div>
            </dialog>
            <button
                className="text-text-primary focus-visible:bg-green-tertiary active:bg-green-tertiary hover:bg-green-tertiary border-yellow-primary bg-green-secondary mt-3 block w-full rounded-md border-l-4 px-5 py-3 text-start shadow-md transition-all duration-200 hover:-translate-y-0.5"
                onClick={() => dialog.current?.showModal()}
            >
                <p className="font-roboto-mono text-xl font-bold sm:text-2xl">
                    {`${startHour}:${startMinute}${startMeridiem}`} -{" "}
                    {`${endHour}:${endMinute}${endMeridiem}`}
                </p>
                <p className="font-poppins text-sm font-semibold sm:text-base">
                    <span className="text-yellow-primary">{building} - </span>
                    <span className="text-yellow-primary">{room}</span> -{" "}
                    {subject}
                </p>
            </button>
        </>
    );
}
