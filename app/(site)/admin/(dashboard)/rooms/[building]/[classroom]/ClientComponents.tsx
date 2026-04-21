"use client";

import {
    RemoveClassroom,
    RenameClassroom,
} from "@/app/actions/ClassroomActions";
import { DeleteSchedule } from "@/app/actions/ScheduleActions";
import { useBuildingInfo } from "@/app/contexts/BuildingProvider";
import {
    useClassroomInfo,
    useUpdateClassroomName,
} from "@/app/contexts/ClassroomProvider";
import { PlainScheduleDocument } from "@/app/mongoDb/models/schedule";
import { PlainInstructorDocument } from "@/app/mongoDb/models/user";
import { adminAccountsPage, adminRoomsPage } from "@/constants";
import clsx from "clsx";
import {
    BookText,
    Building2,
    DoorOpen,
    LinkIcon,
    LoaderCircle,
    Pencil,
    Trash2,
    X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export function ClassroomCodeHeader() {
    const { classroomCode } = useClassroomInfo();
    const { buildingName } = useBuildingInfo();
    return (
        <div className="text-text-primary flex items-end gap-2">
            <span>
                <DoorOpen size={45} />
            </span>
            <div>
                <p className="text-text-secondary text-lg font-semibold">
                    {buildingName}
                </p>
                <h1 className="text-4xl font-bold underline">
                    {classroomCode}
                </h1>
            </div>
        </div>
    );
}

function RenameClassroomComponent({
    showModal,
    closeModal,
}: {
    showModal: boolean;
    closeModal: () => void;
}) {
    const { classroomId, classroomCode: originalCode } = useClassroomInfo();
    const [code, setCode] = useState(originalCode);
    const updateRoomCode = useUpdateClassroomName();
    const onAction = async (_: unknown, formData: FormData): Promise<void> => {
        const newCode =
            (formData.get("newCode") as string | null)?.trim().toUpperCase() ??
            "";
        if (newCode === originalCode) {
            closeModal();
            return;
        }
        const loadingToast = toast.loading("Waiting...");
        const res = await RenameClassroom(classroomId, newCode);
        if (res.status === "success") {
            updateRoomCode(newCode);
            closeModal();
            toast.update(loadingToast, {
                type: "success",
                render: res.message,
                isLoading: false,
                autoClose: 3000,
            });
        } else {
            toast.update(loadingToast, {
                type: "error",
                render: res.message,
                isLoading: false,
                autoClose: 3000,
            });
        }
    };
    const [_, formAction, isPending] = useActionState(onAction, null);

    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (showModal) {
            setCode(originalCode); // Refresh input first
        }
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [showModal]);

    useEffect(() => {
        if (showModal && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(code.length, code.length);
        }
    }, [showModal]);

    return (
        <div
            className={clsx(
                "fixed inset-0 z-40 flex flex-col items-center justify-center px-3 blur-none transition-all",
                !showModal && "pointer-events-none bg-transparent",
                showModal && "bg-black/30",
            )}
            onClick={() => closeModal()}
        >
            <form
                action={formAction}
                className={clsx(
                    "bg-green-secondary text-text-primary border-green-quarternary w-full max-w-md rounded-xl border-b-4 px-6 pt-10 pb-7 shadow-md transition-all",
                    !showModal && "opacity-0",
                )}
                onClick={(e) => e.stopPropagation()}
                onSubmit={(e) => {
                    if (isPending) e.preventDefault();
                }}
            >
                <div className="flex items-center gap-2">
                    <span>
                        <DoorOpen />
                    </span>
                    <div className="relative grow">
                        <input
                            ref={inputRef}
                            spellCheck={false}
                            autoComplete="off"
                            type="text"
                            id="newRoomCode"
                            name="newCode"
                            className="peer w-full border-b-2 border-green-200 py-1 text-xl font-semibold tracking-wide uppercase outline-none placeholder:text-transparent focus:border-green-50"
                            disabled={!showModal}
                            required
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Classroom Code"
                        />
                        <label
                            htmlFor="newRoomCode"
                            className="pointer-events-none absolute -top-5 left-0 text-sm text-green-50 transition-all peer-placeholder-shown:top-1 peer-placeholder-shown:text-xl peer-placeholder-shown:text-green-200 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-green-50"
                        >
                            Classroom Code
                        </label>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className={clsx(
                            "bg-yellow-primary focus-visible:bg-yellow-secondary active:bg-yellow-secondary hover:bg-yellow-secondary mt-5 flex cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-2 font-semibold text-black shadow-md",
                        )}
                        onClick={() => closeModal()}
                        disabled={!showModal}
                    >
                        <X /> Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!showModal || isPending}
                        className={clsx(
                            "bg-yellow-primary focus-visible:bg-yellow-secondary active:bg-yellow-secondary hover:bg-yellow-secondary mt-5 flex grow cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-2 font-semibold text-black shadow-md",
                        )}
                    >
                        {isPending ? (
                            <>
                                <LoaderCircle className="animate-spin" />{" "}
                                Renaming...
                            </>
                        ) : (
                            <>
                                <Pencil /> Rename
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

function RemoveClassroomComponent({
    showModal,
    closeModal,
}: {
    showModal: boolean;
    closeModal: () => void;
}) {
    const { classroomId } = useClassroomInfo();
    const { buildingId } = useBuildingInfo();
    const [code, setCode] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (showModal) {
            setCode(""); // Refresh input first
            inputRef.current?.focus();
        }
    }, [showModal]);

    const onAction = async (_: unknown, formData: FormData): Promise<void> => {
        const loadingToast = toast.loading("Waiting...");
        const codeConfirmation =
            (
                formData.get("codeConfirmation") as string | null
            )?.toUpperCase() ?? "";
        const res = await RemoveClassroom(classroomId, codeConfirmation);
        if (res.status === "success") {
            closeModal();
            router.replace(`${adminRoomsPage}/${buildingId}`);
            toast.update(loadingToast, {
                type: "success",
                render: res.message,
                isLoading: false,
                autoClose: 3000,
            });
        } else {
            toast.update(loadingToast, {
                type: "error",
                render: res.message,
                isLoading: false,
                autoClose: 3000,
            });
        }
    };
    const [_, formAction, isPending] = useActionState(onAction, null);
    return (
        <div
            className={clsx(
                "fixed inset-0 z-40 flex flex-col items-center justify-center px-3 blur-none transition-all",
                !showModal && "pointer-events-none bg-transparent",
                showModal && "bg-black/30",
            )}
            onClick={() => closeModal()}
        >
            <form
                action={formAction}
                className={clsx(
                    "bg-green-secondary text-text-primary border-green-quarternary w-full max-w-md rounded-xl border-b-4 px-6 pt-10 pb-7 shadow-md transition-all",
                    !showModal && "opacity-0",
                )}
                onClick={(e) => e.stopPropagation()}
                onSubmit={(e) => {
                    if (isPending) e.preventDefault();
                }}
            >
                <div className="flex items-center gap-2">
                    <span>
                        <DoorOpen />
                    </span>
                    <div className="relative grow">
                        <input
                            ref={inputRef}
                            spellCheck={false}
                            autoComplete="off"
                            type="text"
                            id="roomCode"
                            name="codeConfirmation"
                            className="peer w-full border-b-2 border-green-200 py-1 text-xl font-semibold tracking-wide uppercase outline-none placeholder:text-transparent focus:border-green-50"
                            disabled={!showModal}
                            required
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Building Name"
                        />
                        <label
                            htmlFor="roomCode"
                            className="pointer-events-none absolute -top-5 left-0 w-full truncate text-sm text-green-50 transition-all peer-placeholder-shown:top-1 peer-placeholder-shown:text-xl peer-placeholder-shown:text-green-200 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-green-50"
                        >
                            Confirm classroom's code
                        </label>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className={clsx(
                            "bg-yellow-primary active:bg-yellow-secondary focus-visible:bg-yellow-secondary hover:bg-yellow-secondary mt-5 flex cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-2 font-semibold text-black shadow-md",
                        )}
                        onClick={() => closeModal()}
                        disabled={!showModal}
                    >
                        <X /> Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!showModal || isPending}
                        className={clsx(
                            "bg-yellow-primary focus-visible:bg-yellow-secondary active:bg-yellow-secondary hover:bg-yellow-secondary mt-5 flex grow cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-2 font-semibold text-black shadow-md",
                        )}
                    >
                        {isPending ? (
                            <>
                                <LoaderCircle className="animate-spin" />{" "}
                                Removing...
                            </>
                        ) : (
                            <>
                                <Trash2 /> Remove
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

type Modals = "none" | "rename" | "remove";
export function ClassroomSettings() {
    const [openedModal, setOpenedModal] = useState<Modals>("none");

    const closeModal = () => {
        setOpenedModal("none");
    };

    return (
        <>
            <RenameClassroomComponent
                showModal={openedModal === "rename"}
                closeModal={closeModal}
            />
            <RemoveClassroomComponent
                showModal={openedModal === "remove"}
                closeModal={closeModal}
            />
            <div className="flex gap-4">
                <button
                    className="hover:bg-yellow-secondary focus-visible:bg-yellow-secondary active:bg-yellow-secondary bg-yellow-primary flex min-w-0 grow cursor-pointer items-center justify-center gap-2 rounded-md px-5 py-2 font-semibold shadow-md transition-all sm:max-w-3xs"
                    onClick={() => setOpenedModal("rename")}
                    disabled={openedModal === "rename"}
                >
                    <Pencil /> Rename
                </button>
                <button
                    className="hover:bg-yellow-secondary focus-visible:bg-yellow-secondary active:bg-yellow-secondary bg-yellow-primary flex min-w-0 grow cursor-pointer items-center justify-center gap-2 rounded-md px-5 py-2 font-semibold shadow-md transition-all sm:max-w-3xs"
                    onClick={() => setOpenedModal("remove")}
                    disabled={openedModal === "remove"}
                >
                    <Trash2 /> Remove
                </button>
            </div>
        </>
    );
}

export function ScheduleCard({
    _id,
    building,
    room,
    instructorFullName,
    instructorId,
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
    room: string;
    instructorFullName: string;
    instructorId: string;
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
                        <Link
                            href={`${adminAccountsPage}/${instructorId}`}
                            className="truncate hover:underline focus:underline active:underline"
                            onClick={() => dialog.current?.close()}
                        >
                            {instructorFullName}
                        </Link>
                        <span>
                            <LinkIcon size={15} />
                        </span>
                    </p>
                    <p className="font-poppins mt-1 flex items-center gap-1 text-xl font-semibold">
                        <span>
                            <DoorOpen size={20} />
                        </span>
                        <span>{room}</span>
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
                className="text-text-primary focus-visible:bg-green-tertiary active:bg-green-tertiary hover:bg-green-tertiary border-yellow-primary bg-green-secondary mt-3 block w-full rounded-md border-l-4 px-5 py-3 text-start shadow-md"
                onClick={() => dialog.current?.showModal()}
            >
                <p className="font-roboto-mono text-2xl font-bold">
                    {`${startHour}:${startMinute < 10 ? "0" + startMinute : startMinute}${startMeridiem}`}{" "}
                    -{" "}
                    {`${endHour}:${endMinute < 10 ? "0" + endMinute : endMinute}${endMeridiem}`}
                </p>
                <p className="font-poppins font-semibold">
                    <span className="text-yellow-primary">
                        {instructorFullName}
                    </span>{" "}
                    - {subject}
                </p>
            </button>
        </>
    );
}
