"use client";

import { RemoveBuilding, RenameBuilding } from "@/app/actions/BuildingsActions";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
    useBuildingInfo,
    useUpdateBuildingName,
} from "@/app/contexts/BuildingProvider";
import clsx from "clsx";
import {
    Building,
    BuildingIcon,
    DoorClosed,
    LoaderCircle,
    Pencil,
    Plus,
    Trash2,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { adminRoomsPage } from "@/constants";
import { AddClassroom } from "@/app/actions/ClassroomActions";

export function Divider({ text }: { text: string }) {
    return (
        <div className="relative my-10 flex items-center justify-center font-bold sm:justify-start">
            <div className="bg-black-400 absolute inset-0 m-auto h-0.5 rounded-full"></div>
            <p className="text-black-400 bg-black-100 text-md absolute w-fit px-2 text-center tracking-wide sm:ml-10 sm:text-lg">
                {text}
            </p>
        </div>
    );
}

export function BuildingNameHeader() {
    const { buildingName } = useBuildingInfo();
    return (
        <h1 className="flex items-center gap-2 text-4xl font-bold underline">
            <BuildingIcon size={30} />
            {buildingName}
        </h1>
    );
}

type Modals = "none" | "rename" | "remove";

function RenameBuildingComponent({
    showModal,
    closeModal,
}: {
    showModal: boolean;
    closeModal: () => void;
}) {
    const { buildingId, buildingName: originalName } = useBuildingInfo();
    const [name, setName] = useState(originalName);
    const updateBuildingName = useUpdateBuildingName();
    const onAction = async (_: unknown, formData: FormData): Promise<void> => {
        const loadingToast = toast.loading("Waiting...");
        const newName =
            (formData.get("newName") as string | null)?.trim() ?? "";
        const res = await RenameBuilding(buildingId, newName);
        if (res.status === "success") {
            updateBuildingName(newName);
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
            inputRef.current?.focus();
            setName(originalName); // Refresh input
        }
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [showModal]);

    return (
        <div
            className={clsx(
                "fixed inset-0 z-40 flex flex-col items-center justify-center blur-none transition-all",
                !showModal && "pointer-events-none bg-transparent",
                showModal && "bg-black/20 backdrop-blur-xs",
            )}
            onClick={() => closeModal()}
        >
            <form
                action={formAction}
                className={clsx(
                    "relative w-full max-w-md rounded-xl border-b-4 bg-white px-6 pt-10 pb-7 shadow-md transition-all",
                    !showModal && "scale-x-0 opacity-0",
                )}
                onSubmit={(e) => {
                    if (name.length === 0) e.preventDefault();
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className="absolute inset-x-0 bottom-full m-auto flex w-fit -translate-y-1/2 items-center gap-1.5 text-xl font-bold tracking-wide">
                    <Pencil /> Rename Building
                </h1>
                <div className="flex items-center gap-2">
                    <Building />
                    <div className="relative grow">
                        <input
                            ref={inputRef}
                            spellCheck={false}
                            autoComplete="off"
                            type="text"
                            id="newbuilding"
                            name="newName"
                            className="peer w-full border-b-2 border-gray-700/50 py-1 text-xl font-semibold tracking-wide outline-none placeholder:text-transparent focus:border-gray-700"
                            disabled={!showModal}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Building Name"
                        />
                        <label
                            htmlFor="newbuilding"
                            className="pointer-events-none absolute -top-5 left-0 text-sm text-gray-700 transition-all peer-placeholder-shown:top-1 peer-placeholder-shown:text-xl peer-placeholder-shown:text-gray-700/50 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-700"
                        >
                            Building Name
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
                            name.length === 0 ||
                            name === originalName
                        }
                        className={clsx(
                            "text-black-100 mt-5 flex grow items-center justify-center gap-1 rounded-md px-3 py-2",
                            isPending ||
                                name.length === 0 ||
                                name === originalName
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

function RemoveBuildingComponent({
    showModal,
    closeModal,
}: {
    showModal: boolean;
    closeModal: () => void;
}) {
    const { buildingId } = useBuildingInfo();
    const [name, setName] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (showModal) {
            inputRef.current?.focus();
            setName(""); // Refresh input
        }
    }, [showModal]);

    const onAction = async (_: unknown, formData: FormData): Promise<void> => {
        const loadingToast = toast.loading("Waiting...");
        const nameConfirmation =
            (formData.get("nameConfirmation") as string | null) ?? "";
        const res = await RemoveBuilding(buildingId, nameConfirmation);
        if (res.status === "success") {
            closeModal();
            router.replace(adminRoomsPage);
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
                showModal && "bg-black/20 backdrop-blur-xs",
            )}
            onClick={() => closeModal()}
        >
            <form
                action={formAction}
                className={clsx(
                    "relative w-full max-w-md rounded-xl border-b-4 bg-white px-6 pt-10 pb-7 shadow-md transition-all",
                    !showModal && "scale-x-0 opacity-0",
                )}
                onSubmit={(e) => {
                    if (name.length === 0) e.preventDefault();
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className="absolute inset-x-0 bottom-full m-auto flex w-fit -translate-y-1/2 items-center gap-1.5 text-xl font-bold tracking-wide">
                    <Trash2 /> Remove Building
                </h1>
                <div className="flex items-center gap-2">
                    <Building />
                    <div className="relative grow">
                        <input
                            ref={inputRef}
                            spellCheck={false}
                            autoComplete="off"
                            type="text"
                            id="buildingName"
                            name="nameConfirmation"
                            className="peer w-full border-b-2 border-gray-700/50 py-1 text-xl font-semibold tracking-wide outline-none placeholder:text-transparent focus:border-gray-700"
                            disabled={!showModal}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Building Name"
                        />
                        <label
                            htmlFor="buildingName"
                            className="pointer-events-none absolute -top-5 left-0 w-full truncate text-sm text-gray-700 transition-all peer-placeholder-shown:top-1 peer-placeholder-shown:text-xl peer-placeholder-shown:text-gray-700/50 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-700"
                        >
                            Confirm building's name
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
                        disabled={!showModal || isPending || name.length === 0}
                        className={clsx(
                            "text-black-100 mt-5 flex grow items-center justify-center gap-1 rounded-md px-3 py-2",
                            isPending || name.length === 0
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

export function BuildingSettings() {
    const [openedModal, setOpenedModal] = useState<Modals>("none");

    const closeModal = () => {
        setOpenedModal("none");
    };

    return (
        <>
            <RenameBuildingComponent
                showModal={openedModal === "rename"}
                closeModal={closeModal}
            />
            <RemoveBuildingComponent
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

export function AddClassroomComponent() {
    const { buildingId } = useBuildingInfo();
    const [code, setCode] = useState("");
    const [showModal, setShowModal] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const onAction = async (_: unknown, formData: FormData): Promise<void> => {
        const loadingToast = toast.loading("Waiting...");
        const classroomCode =
            (formData.get("code") as string | null)?.trim() ?? "";
        const { status, message } = await AddClassroom(
            buildingId,
            classroomCode,
        );
        if (status === "success") {
            setShowModal(false);
            setCode(""); // Refresh input
            toast.update(loadingToast, {
                render: message,
                type: "success",
                autoClose: 3000,
                isLoading: false,
            });
        } else {
            toast.update(loadingToast, {
                render: message,
                type: "error",
                autoClose: 3000,
                isLoading: false,
            });
        }
    };

    const [_, formAction, isPending] = useActionState(onAction, null);

    useEffect(() => {
        if (showModal) {
            inputRef.current?.focus();
            setCode("");
        }
    }, [showModal]);

    return (
        <>
            <button
                className="hover:bg-black-400 hover:text-black-100 mb-5 flex cursor-pointer items-center gap-1 rounded-md bg-white px-4 py-2.5 font-semibold shadow-md transition-all"
                onClick={() => setShowModal(true)}
                disabled={showModal}
            >
                <Plus />
                Add Classroom
            </button>
            <div
                className={clsx(
                    "fixed inset-0 z-40 flex flex-col items-center justify-center blur-none transition-all",
                    !showModal && "pointer-events-none bg-transparent",
                    showModal && "bg-black/20 backdrop-blur-xs",
                )}
                onClick={() => setShowModal(false)}
            >
                <form
                    action={formAction}
                    onSubmit={(e) => {
                        if (code.length === 0) e.preventDefault();
                    }}
                    className={clsx(
                        "relative w-full max-w-md rounded-xl border-b-4 bg-white px-6 pt-10 pb-7 shadow-md transition-all",
                        !showModal && "scale-x-0 opacity-0",
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h1 className="absolute inset-x-0 bottom-full m-auto flex w-fit -translate-y-1/2 items-center gap-1.5 text-xl font-bold tracking-wide">
                        <DoorClosed /> New Classroom
                    </h1>
                    <div className="flex items-center gap-2">
                        <DoorClosed />
                        <div className="relative grow">
                            <input
                                ref={inputRef}
                                spellCheck={false}
                                autoComplete="off"
                                type="text"
                                id="newClassroom"
                                name="code"
                                className="peer w-full border-b-2 border-gray-700/50 py-1 text-xl font-semibold tracking-wide outline-none placeholder:text-transparent focus:border-gray-700"
                                disabled={!showModal}
                                value={code}
                                onChange={(e) =>
                                    setCode(e.target.value.toUpperCase())
                                }
                                placeholder="Classroom Code"
                            />
                            <label
                                htmlFor="newClassroom"
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
                            onClick={() => setShowModal(false)}
                            disabled={!showModal}
                        >
                            <X /> Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={
                                !showModal || isPending || code.length === 0
                            }
                            className={clsx(
                                "bg-black-400 text-black-100 mt-5 flex grow items-center justify-center gap-1 rounded-md px-3 py-2",
                                isPending || code.length === 0
                                    ? "opacity-75"
                                    : "cursor-pointer",
                            )}
                        >
                            {isPending ? (
                                <>
                                    <LoaderCircle className="animate-spin" />{" "}
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Plus /> Add
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
