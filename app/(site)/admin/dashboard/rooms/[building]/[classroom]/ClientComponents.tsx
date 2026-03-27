"use client";

import {
    RemoveClassroom,
    RenameClassroom,
} from "@/app/actions/ClassroomActions";
import { useBuildingInfo } from "@/app/contexts/BuildingProvider";
import {
    useClassroomInfo,
    useUpdateClassroomName,
} from "@/app/contexts/ClassroomProvider";
import { adminRoomsPage } from "@/constants";
import clsx from "clsx";
import { DoorOpen, LoaderCircle, Pencil, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export function ClassroomCodeHeader() {
    const { classroomCode } = useClassroomInfo();
    const { buildingName } = useBuildingInfo();
    return (
        <div className="flex items-end gap-2">
            <DoorOpen size={50} />
            <div>
                <p className="text-lg font-semibold">{buildingName}</p>
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
        const loadingToast = toast.loading("Waiting...");
        const newCode =
            (formData.get("newCode") as string | null)?.trim().toUpperCase() ??
            "";
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
                "fixed inset-0 z-40 flex flex-col items-center justify-center blur-none transition-all",
                !showModal && "pointer-events-none bg-transparent",
                showModal && "bg-black/30",
            )}
            onClick={() => closeModal()}
        >
            <form
                action={formAction}
                className={clsx(
                    "w-full max-w-md rounded-xl border-b-4 bg-white px-6 pt-10 pb-7 shadow-md transition-all",
                    !showModal && "opacity-0",
                )}
                onSubmit={(e) => {
                    if (code.length === 0) e.preventDefault();
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-2">
                    <DoorOpen />
                    <div className="relative grow">
                        <input
                            ref={inputRef}
                            spellCheck={false}
                            autoComplete="off"
                            type="text"
                            id="newRoomCode"
                            name="newCode"
                            className="peer w-full border-b-2 border-gray-700/50 py-1 text-xl font-semibold tracking-wide uppercase outline-none placeholder:text-transparent focus:border-gray-700"
                            disabled={!showModal}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Classroom Code"
                        />
                        <label
                            htmlFor="newRoomCode"
                            className="pointer-events-none absolute -top-5 left-0 text-sm text-gray-700 transition-all peer-placeholder-shown:top-1 peer-placeholder-shown:text-xl peer-placeholder-shown:text-gray-700/50 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-700"
                        >
                            Classroom Code
                        </label>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className={clsx(
                            "bg-black-400 text-black-100 mt-5 flex cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-2",
                        )}
                        onClick={() => closeModal()}
                        disabled={!showModal}
                    >
                        <X /> Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={
                            !showModal ||
                            isPending ||
                            code.length === 0 ||
                            code === originalCode
                        }
                        className={clsx(
                            "text-black-100 mt-5 flex grow items-center justify-center gap-1 rounded-md px-3 py-2",
                            isPending ||
                                code.length === 0 ||
                                code === originalCode
                                ? "bg-black-400/75"
                                : "cursor-pointer bg-blue-700",
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
                "fixed inset-0 z-40 flex flex-col items-center justify-center blur-none transition-all",
                !showModal && "pointer-events-none bg-transparent",
                showModal && "bg-black/30",
            )}
            onClick={() => closeModal()}
        >
            <form
                action={formAction}
                className={clsx(
                    "w-full max-w-md rounded-xl border-b-4 bg-white px-6 pt-10 pb-7 shadow-md transition-all",
                    !showModal && "opacity-0",
                )}
                onSubmit={(e) => {
                    if (code.length === 0) e.preventDefault();
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-2">
                    <DoorOpen />
                    <div className="relative grow">
                        <input
                            ref={inputRef}
                            spellCheck={false}
                            autoComplete="off"
                            type="text"
                            id="roomCode"
                            name="codeConfirmation"
                            className="peer w-full border-b-2 border-gray-700/50 py-1 text-xl font-semibold tracking-wide uppercase outline-none placeholder:text-transparent focus:border-gray-700"
                            disabled={!showModal}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Building Name"
                        />
                        <label
                            htmlFor="roomCode"
                            className="pointer-events-none absolute -top-5 left-0 w-full truncate text-sm text-gray-700 transition-all peer-placeholder-shown:top-1 peer-placeholder-shown:text-xl peer-placeholder-shown:text-gray-700/50 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-700"
                        >
                            Confirm classroom's code
                        </label>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className={clsx(
                            "bg-black-400 text-black-100 mt-5 flex cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-2",
                        )}
                        onClick={() => closeModal()}
                        disabled={!showModal}
                    >
                        <X /> Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!showModal || isPending || code.length === 0}
                        className={clsx(
                            "text-black-100 mt-5 flex grow items-center justify-center gap-1 rounded-md px-3 py-2",
                            isPending || code.length === 0
                                ? "bg-black-400/75"
                                : "cursor-pointer bg-red-700",
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
                    className="hover:bg-black-400 hover:text-black-100 flex min-w-0 grow cursor-pointer items-center justify-center gap-2 rounded-md bg-white px-5 py-2 font-semibold shadow-md transition-all sm:max-w-3xs"
                    onClick={() => setOpenedModal("rename")}
                    disabled={openedModal === "rename"}
                >
                    <Pencil /> Rename
                </button>
                <button
                    className="hover:bg-black-400 hover:text-black-100 flex min-w-0 grow cursor-pointer items-center justify-center gap-2 rounded-md bg-white px-5 py-2 font-semibold shadow-md transition-all sm:max-w-3xs"
                    onClick={() => setOpenedModal("remove")}
                    disabled={openedModal === "remove"}
                >
                    <Trash2 /> Remove
                </button>
            </div>
        </>
    );
}
