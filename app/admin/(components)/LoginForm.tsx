"use client";

import { AdminAuthAction } from "@/app/actions/AdminAuth";
import clsx from "clsx";
import { Lock, User } from "lucide-react";
import { useActionState } from "react";

export default function AdminLoginForm({
    action,
}: {
    action: AdminAuthAction;
}) {
    const [formState, formAction, isPending] = useActionState(action, null);
    return (
        <form
            action={formAction}
            className="text-md font-poppins w-[80%] max-w-sm space-y-10 rounded-xl p-12 shadow-lg"
        >
            <div className="flex items-center gap-3">
                <label htmlFor="username">
                    <User />
                </label>
                <div className="relative w-full">
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Username"
                        required
                        defaultValue={
                            (formState?.formData.get("username") as string) ??
                            ""
                        }
                        className="peer block w-full border-b-2 border-gray-300 py-1 placeholder-transparent focus:border-gray-600 focus:outline-0"
                    />
                    <label
                        htmlFor="username"
                        className="pointer-events-none absolute -top-5 left-0 text-sm text-gray-400 transition-all duration-200 peer-placeholder-shown:top-0 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600"
                    >
                        Username
                    </label>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <label htmlFor="password">
                    <Lock />
                </label>
                <div className="relative w-full">
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        required
                        defaultValue={
                            (formState?.formData.get("password") as string) ??
                            ""
                        }
                        className="peer block w-full border-b-2 border-gray-300 py-1 placeholder-transparent focus:border-gray-600 focus:outline-0"
                    />
                    <label
                        htmlFor="password"
                        className="pointer-events-none absolute -top-5 left-0 text-sm text-gray-400 transition-all duration-200 peer-placeholder-shown:top-0 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600"
                    >
                        Password
                    </label>
                </div>
            </div>
            {!isPending && formState?.status === "error" && (
                <p className="mb-3 text-center text-sm text-red-600">
                    {formState?.message}
                </p>
            )}
            <button
                className={clsx(
                    "bg-black-200 text-black-100 w-full cursor-pointer rounded-md py-2 focus:outline-0",
                    isPending && "opacity-50",
                )}
                disabled={isPending}
            >
                Login
            </button>
        </form>
    );
}
