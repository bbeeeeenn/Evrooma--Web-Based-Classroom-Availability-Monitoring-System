"use client";
import { SendToken } from "@/app/actions/ResetPasswordActions";
import { CircleAlert, Mail } from "lucide-react";
import { SubmitEvent, useState } from "react";

export function EmailForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"success" | "error" | null>(null);
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isPending) return;
        setIsPending(true);
        const res = await SendToken(email);
        setStatus(res.status as "error" | "success");
        setIsPending(false);
    };

    if (status === null) {
        return (
            <div className="bg-green-secondary rounded-md p-5 pb-7 shadow-md sm:p-10">
                <p className="font-roboto text-center text-2xl font-semibold tracking-wide">
                    Account Recovery
                </p>
                <form onSubmit={handleSubmit} className="mt-7">
                    <label htmlFor="email" className="font-poppins">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        placeholder="example@email.com"
                        className="block w-full rounded-md border border-white/25 bg-white/10 p-2 text-xl font-medium"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-yellow-primary mt-10 w-full rounded-md p-3 font-semibold text-black shadow-md"
                    >
                        Next
                    </button>
                </form>
            </div>
        );
    }

    if (status === "error") {
        return <Error />;
    }

    return <Done />;
}

export function Done() {
    return (
        <div className="rounded-md bg-green-500 px-5 py-8 shadow-md">
            <h1 className="m-auto mb-3 flex w-fit items-center gap-2 text-2xl font-semibold">
                <span>
                    <Mail size={25} />
                </span>
                Check Your Email
            </h1>
            <p className="text-center">
                If an account is associated with this email address, we have
                sent a password reset link with further instructions to help you
                securely reset your password.
            </p>
        </div>
    );
}

export function Error() {
    return (
        <div className="rounded-md bg-red-700 px-5 py-8 shadow-md">
            <h1 className="m-auto mb-3 flex w-fit items-center gap-2 text-2xl font-semibold">
                <span>
                    <CircleAlert size={25} />
                </span>
                Unexpected Error
            </h1>
            <p className="text-center">
                Something went wrong on our end. Please try again later, or
                contact the administrators if the problem persists.
            </p>
        </div>
    );
}
