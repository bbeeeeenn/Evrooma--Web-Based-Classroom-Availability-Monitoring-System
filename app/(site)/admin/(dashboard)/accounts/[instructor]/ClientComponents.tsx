"use client";
import {
    useInstructorInfo,
    useUpdateInstructorInfo,
} from "@/app/contexts/InstructorProvider";
import {
    BookText,
    Building2,
    DoorOpen,
    LinkIcon,
    LoaderCircle,
    Mail,
    Plus,
    SquarePen,
    Trash2,
    X,
} from "lucide-react";
import { Divider } from "@/app/components/Divider";
import { useActionState, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { toast } from "react-toastify";
import { DeleteUser } from "@/app/actions/UserActions";
import { useRouter } from "next/navigation";
import { adminAccountsPage, adminRoomsPage } from "@/constants";
import { DeleteSchedule } from "@/app/actions/ScheduleActions";
import Link from "next/link";

function Row({
    label,
    content,
    onClick,
}: {
    label: string;
    content: string;
    onClick?: () => void;
}) {
    return (
        <tr>
            <td>{label}:</td>
            <td className="text-white/80">
                <p className="flex items-center gap-2 underline">
                    <span className="break-all">{content}</span>
                    <button>
                        <SquarePen size={20} className="cursor-pointer" />
                    </button>
                </p>
            </td>
        </tr>
    );
}

function DeleteAccount() {
    const router = useRouter();
    const dialog = useRef<HTMLDialogElement>(null);
    const { instructorId, email: instructorEmail } = useInstructorInfo();

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
        const email =
            (formData.get("email") as string)?.trim().toLowerCase() || "";
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
        if (response.status === "success") router.replace(adminAccountsPage);

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
                className="bg-green-secondary text-text-primary border-green-quarternary m-auto w-[calc(100%-1.5rem)] max-w-md overflow-hidden rounded-md border-b-4 px-6 pt-10 pb-7 select-none backdrop:bg-black/30"
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
                <form action={formAction}>
                    <div className="flex items-center gap-2">
                        <span>
                            <Mail />
                        </span>
                        <div className="relative grow">
                            <input
                                spellCheck={false}
                                autoComplete="off"
                                type="email"
                                id="email"
                                name="email"
                                defaultValue={state.email}
                                className="peer w-full border-b-2 border-green-200 py-1 text-xl font-semibold tracking-wide lowercase outline-none placeholder:text-transparent focus:border-green-50"
                                required
                                placeholder="Confirm Email"
                            />
                            <label
                                htmlFor="email"
                                className="pointer-events-none absolute -top-5 left-0 text-sm text-green-50 transition-all peer-placeholder-shown:top-1 peer-placeholder-shown:text-xl peer-placeholder-shown:text-green-200 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-green-50"
                            >
                                Confirm Email
                            </label>
                        </div>
                    </div>
                    <div className="flex gap-2">
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
                                    <Plus /> Delete
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </dialog>
            <button
                className="font-poppins hover:bg-yellow-secondary bg-yellow-primary mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 font-semibold shadow-md transition-colors"
                onClick={() => dialog.current?.showModal()}
            >
                <Trash2 size={20} /> Delete Account
            </button>
        </>
    );
}

export function InstructorInfoComponent() {
    const { email, fname, lname } = useInstructorInfo();
    const updateInstructorInfo = useUpdateInstructorInfo();

    return (
        <>
            <h1 className="flex items-center gap-2 text-4xl font-bold text-white/90">
                <BookText size={40} /> {`${fname} ${lname}`}
            </h1>
            <Divider text="Account" />
            <table className="font-poppins w-full border-separate border-spacing-2 font-semibold text-white/90 select-text">
                <tbody>
                    <Row label="First Name" content={fname} />
                    <Row label="Last Name" content={lname} />
                    <Row label="Email" content={email} />
                    <Row label="Password" content={"•".repeat(15)} />
                </tbody>
            </table>
            <DeleteAccount />
        </>
    );
}

export function ScheduleCard({
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
    startMinute: number;
    startMeridiem: string;
    endHour: number;
    endMinute: number;
    endMeridiem: string;
    day: string;
}) {
    const dialog = useRef<HTMLDialogElement>(null);
    const [isPending, setIsPending] = useState(false);
    const { fname, lname } = useInstructorInfo();
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
                className="text-text-primary focus-visible:bg-green-tertiary active:bg-green-tertiary hover:bg-green-tertiary border-yellow-primary bg-green-secondary mt-5 block w-full rounded-md border-l-4 px-5 py-3 text-start shadow-md"
                onClick={() => dialog.current?.showModal()}
            >
                <p className="font-roboto-mono text-2xl font-bold">
                    {`${startHour}:${startMinute < 10 ? "0" + startMinute : startMinute}${startMeridiem}`}{" "}
                    -{" "}
                    {`${endHour}:${endMinute < 10 ? "0" + endMinute : endMinute}${endMeridiem}`}
                </p>
                <p className="font-poppins font-semibold">
                    <span className="text-yellow-primary">{building} - </span>
                    <span className="text-yellow-primary">{room}</span> -{" "}
                    {subject}
                </p>
            </button>
        </>
    );
}
