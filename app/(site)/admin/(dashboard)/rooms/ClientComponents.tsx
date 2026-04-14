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
                    "bg-yellow-primary focus-visible:bg-yellow-secondary active:bg-yellow-secondary hover:bg-yellow-secondary mb-5 flex cursor-pointer items-center gap-1 rounded-md p-2 font-semibold text-black shadow-md",
                    "hover:bg-green-secondary transition-colors active:scale-105",
                )}
                onClick={() => setShowModal(true)}
            >
                <Plus /> Add Building
            </button>
            <div
                className={clsx(
                    "fixed inset-0 z-40 flex flex-col items-center justify-center px-3 blur-none transition-all",
                    !showModal && "pointer-events-none bg-transparent",
                    showModal && "bg-black/30",
                )}
                onClick={() => setShowModal(false)}
            >
                <form
                    action={formAction}
                    className={clsx(
                        "bg-green-secondary border-green-quarternary w-full max-w-md rounded-xl border-b-4 px-6 pt-10 pb-7 text-white shadow-md transition-all",
                        !showModal && "opacity-0",
                    )}
                    onClick={(e) => e.stopPropagation()}
                    onSubmit={(e) => {
                        if (isPending) e.preventDefault();
                    }}
                >
                    <div className="flex items-center gap-2">
                        <span>
                            <Building2 />
                        </span>
                        <div className="relative grow">
                            <input
                                ref={inputRef}
                                spellCheck={false}
                                autoComplete="off"
                                type="text"
                                id="newbuilding"
                                name="name"
                                required
                                className="peer w-full border-b-2 border-green-200 py-1 text-xl font-semibold tracking-wide outline-none placeholder:text-transparent focus:border-green-50"
                                disabled={!showModal}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Building Name"
                            />
                            <label
                                htmlFor="newbuilding"
                                className="pointer-events-none absolute -top-5 left-0 text-sm text-green-50 transition-all peer-placeholder-shown:top-1 peer-placeholder-shown:text-xl peer-placeholder-shown:text-green-200 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-green-50"
                            >
                                Building Name
                            </label>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className={clsx(
                                "bg-yellow-primary hover:bg-yellow-secondary active:bg-yellow-secondary focus-visible:bg-yellow-secondary mt-5 flex cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-2 text-black",
                            )}
                            onClick={() => setShowModal(false)}
                            disabled={!showModal}
                        >
                            <X /> Cancel
                        </button>
                        <button
                            type="submit"
                            className={clsx(
                                "bg-yellow-primary hover:bg-yellow-secondary active:bg-yellow-secondary focus-visible:bg-yellow-secondary mt-5 flex grow cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-2 text-black",
                            )}
                            disabled={!showModal || isPending}
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
