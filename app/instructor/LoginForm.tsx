"use client";

import { InstructorAuthAction } from "@/actions/InstructorAuth";
import clsx from "clsx";
import {
    BookText,
    Flashlight,
    FlashlightOff,
    Lock,
    SquareArrowRightEnter,
    User,
} from "lucide-react";
import { ChangeEvent, useActionState, useState } from "react";

export default function InstructorLoginForm({
    action,
}: {
    action: InstructorAuthAction;
}) {
    const [prevFormData, formAction, isPending] = useActionState(action, null);

    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(true);
    const onShowPassword = () => {
        setShowPassword((prev) => !prev);
    };
    const onRemember = (e: ChangeEvent<HTMLInputElement>) => {
        setRemember(e.target.checked);
    };
    return (
        <>
            <h1 className="text-black-400 font-poppins mb-7 flex items-center gap-2 text-center text-2xl font-bold tracking-widest">
                <BookText />
                Instructor
            </h1>
            <form
                action={formAction}
                className="text-md font-poppins w-full max-w-md space-y-10 rounded-xl bg-white px-[7vw] pt-14 pb-12 sm:px-12 sm:shadow-lg"
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
                            autoComplete="off"
                            defaultValue={
                                (prevFormData?.formData.get(
                                    "username",
                                ) as string) ?? ""
                            }
                            spellCheck={false}
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
                    <div className="relative flex min-w-0 grow items-center gap-2">
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
                            className="peer min-w-0 grow border-b-2 border-gray-300 py-1 placeholder-transparent focus-within:border-gray-600 focus:outline-0"
                        />

                        <label
                            htmlFor="password"
                            className="pointer-events-none absolute -top-5 left-0 text-sm text-gray-600 transition-all duration-200 peer-placeholder-shown:top-0 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600"
                        >
                            Password
                        </label>
                        <button
                            className="flex cursor-pointer items-center justify-center p-0.5"
                            onClick={onShowPassword}
                            type="button"
                        >
                            {showPassword ? (
                                <Flashlight className="-rotate-90 text-gray-600 transition-all duration-200 peer-placeholder-shown:text-gray-400 peer-focus:text-gray-600" />
                            ) : (
                                <FlashlightOff className="-rotate-90 text-gray-600 transition-all duration-200 peer-placeholder-shown:text-gray-400 peer-focus:text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>
                <label
                    htmlFor="rememberme"
                    className="font-inter text-md flex w-fit cursor-pointer items-center gap-2 font-bold text-gray-600 hover:underline"
                >
                    <input
                        type="checkbox"
                        id="rememberme"
                        name="remember"
                        defaultChecked={remember}
                        onChange={onRemember}
                        className="accent-black-400 size-4 cursor-pointer"
                    />
                    Remember me?
                </label>
                {!isPending && prevFormData?.status === "error" && (
                    <p className="mb-3 text-center text-sm text-red-600 select-text">
                        {prevFormData?.message}
                    </p>
                )}
                <button
                    className={clsx(
                        "bg-black-400 text-black-100 mb-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md py-2 focus:outline-0",
                        isPending && "opacity-50",
                    )}
                    disabled={isPending}
                    type="submit"
                >
                    <SquareArrowRightEnter /> Login
                </button>
                <p className="m-auto w-fit cursor-pointer text-center text-sm underline">
                    Forgot User ID or Password?
                </p>
            </form>
        </>
    );
}
