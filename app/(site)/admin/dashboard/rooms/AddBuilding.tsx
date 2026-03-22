"use client";
import { AddBuilding as addBuildingAction } from "@/app/actions/RoomsActions";
import { ServerActionResponse } from "@/app/actions/_";
import clsx from "clsx";
import { Building, LoaderCircle, Plus, X } from "lucide-react";
import { useActionState, useState } from "react";
import { toast } from "react-toastify";

export default function AddBuilding() {
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState("");

    const onAction = async (
        _: ServerActionResponse,
        formData: FormData,
    ): Promise<ServerActionResponse> => {
        const result = await addBuildingAction(_, formData);

        if (result.status === "success") {
            setName("");
            setShowModal(false);
            toast.success(result.message);
        } else if (result.status === "error") {
            toast.error(result.message);
        }

        return result;
    };

    const [state, formAction, isPending] = useActionState<
        ServerActionResponse,
        FormData
    >(onAction, {
        status: "initial",
        message: "",
    });

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
                    "fixed inset-0 flex flex-col items-center justify-center blur-none transition-all",
                    !showModal && "pointer-events-none bg-transparent",
                    showModal && "bg-white/20 backdrop-blur-xs",
                )}
                onClick={() => setShowModal(false)}
            >
                <form
                    action={formAction}
                    className={clsx(
                        "relative w-full max-w-md rounded-md bg-white px-6 py-10 shadow-md transition-all",
                        !showModal && "scale-x-0 opacity-0",
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h1 className="absolute inset-x-0 bottom-full m-auto flex w-fit -translate-y-1/2 items-center gap-1.5 text-xl font-bold tracking-wide">
                        <Building /> New Building
                    </h1>
                    <div className="relative">
                        <input
                            spellCheck={false}
                            autoComplete="off"
                            type="text"
                            id="newbuilding"
                            name="name"
                            className="peer w-full border-b-2 border-gray-300 py-1 text-xl font-semibold tracking-wide outline-none placeholder:text-transparent focus:border-gray-600"
                            disabled={!showModal}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Building Name"
                        />
                        <label
                            htmlFor="newbuilding"
                            className="pointer-events-none absolute -top-5 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-1 peer-placeholder-shown:text-xl peer-placeholder-shown:text-gray-300 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600"
                        >
                            Building Name
                        </label>
                    </div>
                    <button
                        type="submit"
                        disabled={!showModal || isPending || name.length === 0}
                        className={clsx(
                            "bg-black-400 text-black-100 mt-5 flex w-full cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-2",
                            (isPending || name.length === 0) && "opacity-50",
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
                    <button
                        type="button"
                        className="absolute inset-x-0 top-full m-auto w-fit translate-y-1/3 cursor-pointer rounded-full bg-white p-2 shadow-md"
                        onClick={() => setShowModal(false)}
                    >
                        <X />
                    </button>
                </form>
            </div>
        </>
    );
}
