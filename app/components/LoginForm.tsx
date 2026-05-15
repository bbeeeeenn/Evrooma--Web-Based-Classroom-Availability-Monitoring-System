"use client";

import { LoginFormActionResponse } from "@/app/actions/_";
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { AdminAuth } from "../actions/AdminAuthActions";
import { InstructorAuth } from "../actions/InstructorAuthActions";
import {
    adminRoomsPage,
    forgotPasswordPage,
    homePage,
    instructorHomePage,
    studentHomePage,
    studentRegisterPage,
} from "@/constants";
import clsx from "clsx";
import {
    BookText,
    Check,
    Eye,
    EyeClosed,
    GraduationCap,
    LoaderCircle,
    Lock,
    ShieldUser,
    Square,
    SquareArrowRightEnter,
    SquarePen,
    Undo2,
    User,
} from "lucide-react";
import { StudentAuth } from "../actions/StudentAuthActions";

export default function LoginForm({
    formType,
    redirectPath,
}: {
    formType: "admin" | "instructor" | "student";
    redirectPath?: string;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState<boolean | null>(null);

    useEffect(() => {
        setRememberMe(
            window.localStorage.getItem(formType + "RememberMe") === "on",
        );
    }, [formType]);

    const onAction = async (
        _: unknown,
        formData: FormData,
    ): Promise<LoginFormActionResponse> => {
        const res =
            formType === "admin"
                ? await AdminAuth(formData)
                : formType === "instructor"
                  ? await InstructorAuth(formData)
                  : await StudentAuth(formData);
        if (res.status === "success") {
            console.log("redirecting to dashboard");
            const target = redirectPath?.startsWith("/")
                ? redirectPath
                : formType === "admin"
                  ? adminRoomsPage
                  : formType === "instructor"
                    ? instructorHomePage
                    : studentHomePage;
            window.location.replace(target);
            setShowPassword(false);
        }
        return res;
    };

    const [state, formAction, isPending] = useActionState(onAction, {
        formData: new FormData(),
        status: "initial",
        message: "",
        user: null,
    });

    const onShowPassword = () => setShowPassword((prev) => !prev);

    const onRemember = () => {
        setRememberMe((prev) => {
            window.localStorage.setItem(
                formType + "RememberMe",
                prev ? "off" : "on",
            );
            return !prev;
        });
    };

    return (
        <>
            <h1 className="font-poppins mb-7 flex items-center gap-2 text-center text-2xl font-semibold tracking-wider text-white">
                {formType === "instructor" ? (
                    <>
                        <BookText size={30} /> Instructor
                    </>
                ) : formType === "admin" ? (
                    <>
                        <ShieldUser size={30} /> Administrator
                    </>
                ) : (
                    <>
                        <GraduationCap size={30} /> Student
                    </>
                )}
            </h1>
            <form
                action={formAction}
                className={clsx(
                    "text-md font-poppins relative w-full max-w-md space-y-10 rounded-xl px-[7vw] pt-14 pb-12 text-white sm:px-12 sm:shadow-lg",
                    "bg-green-secondary",
                )}
            >
                <div className="flex items-center gap-3">
                    <label htmlFor="username">
                        {formType === "admin" ? <ShieldUser /> : <User />}
                    </label>
                    <div className="relative w-full">
                        <input
                            type="text"
                            name={formType === "admin" ? "username" : "email"}
                            id="username"
                            placeholder="Username"
                            required
                            defaultValue={
                                (state.formData.get("email") ||
                                    state.formData.get("username")) as string
                            }
                            spellCheck={false}
                            className="peer block w-full border-b-2 border-white/50 py-1 placeholder-transparent focus:border-white focus:outline-0"
                        />
                        <label
                            htmlFor="username"
                            className="pointer-events-none absolute -top-5 left-0 text-sm text-white/90 transition-all duration-200 peer-placeholder-shown:top-0 peer-placeholder-shown:text-lg peer-placeholder-shown:text-white/50 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-white/90"
                        >
                            {formType === "admin" ? "Username" : "Email"}
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
                                state.formData.get("password") as string
                            }
                            className="peer min-w-0 grow border-b-2 border-white/50 py-1 placeholder-transparent outline-0 focus:border-white/90"
                        />

                        <label
                            htmlFor="password"
                            className="pointer-events-none absolute -top-5 left-0 text-sm text-white/90 transition-all duration-200 peer-placeholder-shown:top-0 peer-placeholder-shown:text-lg peer-placeholder-shown:text-white/50 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-white/90"
                        >
                            Password
                        </label>
                        <button
                            className="flex cursor-pointer items-center justify-center p-0.5 text-white"
                            onClick={onShowPassword}
                            type="button"
                        >
                            {showPassword ? (
                                <Eye className="transition-all duration-200" />
                            ) : (
                                <EyeClosed className="transition-all duration-200" />
                            )}
                        </button>
                    </div>
                </div>
                {rememberMe !== null && (
                    <label
                        htmlFor="rememberme"
                        className="font-inter text-md flex w-fit cursor-pointer items-center gap-2 font-medium tracking-wide text-white hover:underline"
                    >
                        <input
                            type="checkbox"
                            id="rememberme"
                            name="rememberme"
                            checked={rememberMe}
                            onChange={onRemember}
                            hidden
                            className="accent-black-400 size-4 cursor-pointer"
                        />
                        <Square className="flex items-center justify-center">
                            {rememberMe && (
                                <Check
                                    size={18}
                                    x={3}
                                    y={3}
                                    strokeWidth={2.5}
                                />
                            )}
                        </Square>
                        Remember me
                    </label>
                )}
                {state.status === "error" && (
                    <p className="mb-3 text-center text-sm text-red-600 select-text">
                        {state.message}
                    </p>
                )}
                <button
                    className={clsx(
                        "bg-yellow-primary font-inter mb-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md py-2 font-bold text-black/80 focus:outline-0",
                        isPending && "opacity-50",
                    )}
                    disabled={isPending}
                    type="submit"
                >
                    {isPending ? (
                        <LoaderCircle className="animate-spin" />
                    ) : (
                        <>
                            <SquareArrowRightEnter /> Login
                        </>
                    )}
                </button>
                {formType !== "admin" && (
                    <Link
                        href={forgotPasswordPage}
                        className="m-auto block w-fit cursor-pointer text-center text-sm underline"
                    >
                        Forgot Username or Password?
                    </Link>
                )}
                {formType === "student" && (
                    <>
                        <div className="relative my-10 flex items-center justify-center font-semibold">
                            <div className="absolute inset-0 m-auto h-px rounded-full bg-green-100"></div>
                            <p className="bg-green-secondary text-md absolute w-fit px-2 text-center tracking-wide text-green-100 sm:text-lg">
                                or
                            </p>
                        </div>
                        <Link
                            href={studentRegisterPage}
                            className={clsx(
                                "bg-yellow-primary font-inter mb-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md py-2 font-bold text-black/80 focus:outline-0",
                            )}
                        >
                            <span>
                                <SquarePen />
                            </span>
                            Sign Up
                        </Link>
                    </>
                )}
            </form>
            {!isPending && (
                <Link
                    href={homePage}
                    type="button"
                    className="bg-yellow-primary mt-5 size-fit cursor-pointer rounded-full p-2 text-black shadow-md hover:scale-105 focus-visible:scale-105"
                >
                    <Undo2 />
                </Link>
            )}
        </>
    );
}
