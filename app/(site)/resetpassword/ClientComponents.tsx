"use client";

import { ResetPassword } from "@/app/actions/ResetPasswordActions";
import { instructorHomePage, studentHomePage } from "@/constants";
import clsx from "clsx";
import {
    BookText,
    ChevronRight,
    CircleAlert,
    GraduationCap,
    LoaderCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { toast } from "react-toastify";

export function InvalidToken() {
    return (
        <div className="rounded-md bg-red-700 px-5 py-8 shadow-md">
            <h1 className="m-auto mb-3 flex w-fit items-center gap-2 text-2xl font-semibold">
                <span>
                    <CircleAlert size={25} />
                </span>
                Invalid Token
            </h1>
            <p className="text-center">
                The password reset link is invalid, used, or has expired. Please
                request a new password reset to continue.
            </p>
        </div>
    );
}

export function ChangePasswordForm({
    fullname,
    role,
    email,
    token,
}: {
    fullname: string;
    role: "instructor" | "student";
    email: string;
    token: string;
}) {
    const router = useRouter();
    const [password, setPassword] = useState({ new: "", confirm: "" });
    const [notMatch, setNotMatch] = useState(false);

    const onAction = async () => {
        if (password.new !== password.confirm) {
            setNotMatch(true);
            toast.error("Passwords doesn't match!");
            return;
        }
        const res = await ResetPassword(token, password.new);
        if (res.status === "error") {
            toast.error(res.message);
            return;
        }

        toast.success(res.message);
        router.replace(
            role === "instructor" ? instructorHomePage : studentHomePage,
        );
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, formAction, isPending] = useActionState(onAction, null);

    return (
        <div className="bg-green-secondary rounded-md p-5 pb-7 shadow-md sm:p-10">
            <p className="font-roboto flex items-center justify-center gap-2 text-2xl font-semibold tracking-wide">
                <span>
                    {role === "student" ? <GraduationCap /> : <BookText />}
                </span>
                {fullname}
            </p>
            <form action={formAction} className="mt-7">
                <input type="hidden" name="email" value={email} />
                <label htmlFor="password" className="font-poppins">
                    New Password
                </label>
                <input
                    type="password"
                    name="password"
                    value={password.new}
                    id="password"
                    required
                    placeholder="New Password"
                    className={clsx(
                        "mb-4 block w-full rounded-md border bg-white/10 p-2 text-xl font-medium",
                        notMatch ? "border-red-700" : "border-white/25",
                    )}
                    onChange={(e) => {
                        setNotMatch(false);
                        setPassword((prev) => ({
                            ...prev,
                            new: e.target.value,
                        }));
                    }}
                />
                <label htmlFor="confirmPassword" className="font-poppins">
                    Confirm Password
                </label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={password.confirm}
                    id="confirmPassword"
                    required
                    placeholder="Confirm Password"
                    className={clsx(
                        "mb-4 block w-full rounded-md border bg-white/10 p-2 text-xl font-medium",
                        notMatch ? "border-red-700" : "border-white/25",
                    )}
                    onChange={(e) => {
                        setNotMatch(false);
                        setPassword((prev) => ({
                            ...prev,
                            confirm: e.target.value,
                        }));
                    }}
                />
                <button
                    type="submit"
                    inert={isPending}
                    className={clsx(
                        "bg-yellow-primary mt-10 flex w-full items-center justify-center gap-2 rounded-md p-3 font-semibold text-black shadow-md",
                        isPending && "pointer-events-none opacity-75",
                    )}
                >
                    {isPending ? (
                        <>
                            <span>
                                <LoaderCircle className="animate-spin" />
                            </span>
                            Please Wait
                        </>
                    ) : (
                        <>
                            Confirm
                            <span>
                                <ChevronRight />
                            </span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
