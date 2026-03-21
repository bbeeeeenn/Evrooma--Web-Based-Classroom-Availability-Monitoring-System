"use client";
import clsx from "clsx";
import { Building, Castle, House, Plus, X } from "lucide-react";
import { useState } from "react";

export default function AddBuilding() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                className={clsx(
                    "my-4 flex cursor-pointer items-center gap-1 rounded-md bg-white p-2 font-semibold shadow-md",
                    "hover:bg-black-400 hover:text-black-100 transition-colors active:scale-105",
                )}
                onClick={() => setShowModal((prev) => !prev)}
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
                    action=""
                    className={clsx(
                        "relative w-full max-w-md rounded-md bg-white px-6 py-10 shadow-md transition-all",
                        !showModal && "scale-0 opacity-0",
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h1 className="absolute inset-x-0 bottom-full -translate-y-1/2 text-center text-xl font-bold">
                        New Building
                    </h1>
                    <div className="flex items-center gap-3">
                        <Castle size={35} />
                        <div className="relative grow">
                            <input
                                spellCheck={false}
                                type="text"
                                id="newbuilding"
                                className="peer w-full border-b-2 border-gray-300 py-1 text-xl font-semibold tracking-wide outline-none placeholder:text-transparent focus:border-gray-600"
                                disabled={!showModal}
                                placeholder="Building Name"
                            />
                            <label
                                htmlFor="newbuilding"
                                className="pointer-events-none absolute -top-5 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-1 peer-placeholder-shown:text-xl peer-placeholder-shown:text-gray-300 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600"
                            >
                                Building Name
                            </label>
                        </div>
                    </div>
                    <button
                        // type="submit"
                        type="button"
                        className="bg-black-400 text-black-100 mt-5 flex w-full cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-2"
                    >
                        <Plus /> Add
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
