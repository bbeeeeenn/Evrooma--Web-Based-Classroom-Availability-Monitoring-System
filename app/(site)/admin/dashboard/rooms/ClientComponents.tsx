"use client";
import { AddBuilding as addBuildingAction } from "@/app/actions/BuildingsActions";
import clsx from "clsx";
import { Building2, LoaderCircle, Plus, X } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function AddBuilding() {
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const onAction = async (_: unknown, formData: FormData): Promise<void> => {
        const result = await addBuildingAction(_, formData);

        if (result.status === "success") {
            setName("");
            setShowModal(false);
            toast.success(result.message);
        } else if (result.status === "error") {
            toast.error(result.message);
        }
    };

    const [_, formAction, isPending] = useActionState(onAction, null);

    useEffect(() => {
        if (showModal) {
            inputRef.current?.focus();
            setName(""); // Refresh input
        }
        const func = (e: KeyboardEvent) => {
            if (showModal && e.key === "Escape") setShowModal(false);
        };
        window.addEventListener("keydown", func);
        return () => window.removeEventListener("keydown", func);
    }, [showModal]);

    return (
        <>
            <button
                className={clsx(
                    "my-4 flex cursor-pointer items-center gap-1 rounded-md bg-white p-2 font-semibold shadow-md",
                    "hover:bg-black-400 hover:text-black-100 transition-colors active:scale-105",
                )}
                onClick={() => setShowModal(true)}
            >
                <Plus /> Add Building
            </button>
            <div
                className={clsx(
                    "fixed inset-0 z-40 flex flex-col items-center justify-center blur-none transition-all",
                    !showModal && "pointer-events-none bg-transparent",
                    showModal && "bg-black/30",
                )}
                onClick={() => setShowModal(false)}
            >
                <form
                    action={formAction}
                    onSubmit={(e) => {
                        if (name.length === 0) e.preventDefault();
                    }}
                    className={clsx(
                        "w-full max-w-md rounded-xl bg-white px-6 pt-10 pb-7 shadow-md transition-all",
                        !showModal && "opacity-0",
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center gap-2">
                        <Building2 />
                        <div className="relative grow">
                            <input
                                ref={inputRef}
                                spellCheck={false}
                                autoComplete="off"
                                type="text"
                                id="newbuilding"
                                name="name"
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
                            onClick={() => setShowModal(false)}
                            disabled={!showModal}
                        >
                            <X /> Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={
                                !showModal || isPending || name.length === 0
                            }
                            className={clsx(
                                "bg-black-400 text-black-100 mt-5 flex grow items-center justify-center gap-1 rounded-md px-3 py-2",
                                isPending || name.length === 0
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
