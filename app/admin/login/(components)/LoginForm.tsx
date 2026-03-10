"use client";

import { AdminAuthAction } from "@/app/actions/AdminAuth";
import clsx from "clsx";
import { Flashlight, FlashlightOff, Lock, User } from "lucide-react";
import { ChangeEvent, useActionState, useState } from "react";

export default function AdminLoginForm({
    action,
}: {
    action: AdminAuthAction;
}) {
    const [prevFormData, formAction, isPending] = useActionState(action, null);

    const [showPassword, setShowPassword] = useState(false);
    const onShowPassword = (e: ChangeEvent<HTMLInputElement>) => {
        setShowPassword(e.target.checked);
    };
    return (
        <form
            action={formAction}
            className="text-md font-poppins w-full max-w-md space-y-10 rounded-xl p-8 py-10 sm:shadow-lg"
        >
            <h1 className="text-black-400 mb-15 text-center text-2xl font-bold tracking-widest">
                Administrator
            </h1>
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
                        autoComplete="off"
                        defaultValue={
                            (prevFormData?.formData.get(
                                "username",
                            ) as string) ?? ""
                        }
                        className="peer block w-full border-b-2 border-gray-300 py-1 placeholder-transparent focus:border-gray-600 focus:outline-0"
                    />
                    <label
                        htmlFor="username"
                        className="pointer-events-none absolute -top-5 left-0 text-sm text-gray-600 transition-all duration-200 peer-placeholder-shown:top-0 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600"
                    >
                        Username
                    </label>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <label htmlFor="password">
                    <Lock />
                </label>
                <div className="relative flex w-full items-center gap-2 border-b-2 border-gray-300 focus-within:border-gray-600">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="Password"
                        required
                        defaultValue={
                            (prevFormData?.formData.get(
                                "password",
                            ) as string) ?? ""
                        }
                        autoComplete="off"
                        className="peer grow py-1 placeholder-transparent focus:outline-0"
                    />
                    <input
                        type="checkbox"
                        id="showpassword"
                        defaultChecked={showPassword}
                        className="hidden"
                        onChange={onShowPassword}
                    />
                    <label
                        htmlFor="password"
                        className="pointer-events-none absolute -top-5 left-0 text-sm text-gray-600 transition-all duration-200 peer-placeholder-shown:top-0 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600"
                    >
                        Password
                    </label>
                    <label
                        htmlFor="showpassword"
                        className="cursor-pointer pr-2"
                    >
                        {showPassword ? (
                            <Flashlight className="-rotate-90 text-gray-600 transition-all duration-200 peer-placeholder-shown:text-gray-400 peer-focus:text-gray-600" />
                        ) : (
                            <FlashlightOff className="-rotate-90 text-gray-600 transition-all duration-200 peer-placeholder-shown:text-gray-400 peer-focus:text-gray-600" />
                        )}
                    </label>
                </div>
            </div>
            {!isPending && prevFormData?.status === "error" && (
                <p className="mb-3 text-center text-sm text-red-600 select-text">
                    {prevFormData?.message}
                </p>
            )}
            <button
                className={clsx(
                    "bg-black-400 text-black-100 w-full cursor-pointer rounded-md py-2 focus:outline-0",
                    isPending && "opacity-50",
                )}
                disabled={isPending}
            >
                Login
            </button>
        </form>
    );
}
