"use client";
import { DeleteUser } from "@/app/actions/UserActions";
import { Divider } from "@/app/components/Divider";
import { useUserInfo } from "@/app/contexts/UserInfoProvider";
import { getPHDateTime } from "@/app/lib/clientUtils";
import { adminStudentsPage, Months } from "@/constants";
import clsx from "clsx";
import {
    GraduationCap,
    LoaderCircle,
    Trash2,
    TriangleAlert,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

function DeleteAccount() {
    const router = useRouter();
    const dialog = useRef<HTMLDialogElement>(null);
    const { userId, email: userEmail } = useUserInfo();

    const onFormAction = async (
        _: {
            modalOpened: boolean;
            email: string;
        },
        formData: FormData,
    ): Promise<{
        modalOpened: boolean;
        email: string;
    }> => {
        const loadingToast = toast.loading("Waiting...");
        const email =
            (formData.get("email") as string)?.trim().toLowerCase() || "";
        if (!email) {
            toast.update(loadingToast, {
                isLoading: false,
                type: "error",
                autoClose: 3000,
                render: "Please enter the email to confirm.",
            });
            return { email, modalOpened: true };
        }

        if (email !== userEmail) {
            toast.update(loadingToast, {
                isLoading: false,
                type: "error",
                autoClose: 3000,
                render: "Email doesn't match.",
            });
            return { email, modalOpened: true };
        }

        const response = await DeleteUser(userId);
        toast.update(loadingToast, {
            isLoading: false,
            type: response.status as "success" | "error",
            autoClose: 3000,
            render: response.message,
        });
        if (response.status === "success") router.replace(adminStudentsPage);

        return { email: "", modalOpened: response.status === "error" };
    };

    const [state, formAction, isPending] = useActionState(onFormAction, {
        modalOpened: false,
        email: "",
    });

    useEffect(() => {
        if (state.modalOpened) {
            dialog.current?.showModal();
        } else {
            dialog.current?.close();
        }
    });

    return (
        <>
            <dialog
                ref={dialog}
                className="bg-green-secondary text-text-primary border-green-quarternary m-auto w-[calc(100%-1.5rem)] max-w-md overflow-hidden rounded-md border-b-4 px-6 pt-5 pb-7 select-none backdrop:bg-black/30"
                onClick={(e) => {
                    if (!dialog.current) return;
                    const { top, bottom, left, right } =
                        dialog.current.getBoundingClientRect();
                    if (
                        e.clientX < left ||
                        e.clientX > right ||
                        e.clientY < top ||
                        e.clientY > bottom
                    )
                        dialog.current.close();
                }}
            >
                <p className="mb-4 flex items-center justify-center gap-2 text-2xl font-semibold">
                    <span>
                        <TriangleAlert size={25} />
                    </span>
                    Delete User
                </p>
                <form action={formAction}>
                    <label
                        htmlFor="email"
                        className="font-poppins mb-2 block text-sm"
                    >
                        To confirm, type{" "}
                        <span className="bg-white/10">{userEmail}</span> in the
                        box below
                    </label>
                    <input
                        spellCheck={false}
                        autoComplete="off"
                        type="text"
                        id="email"
                        name="email"
                        defaultValue={state.email}
                        className="peer w-full rounded-md border-2 border-white/25 bg-white/10 px-2 py-1 text-xl font-semibold tracking-wide outline-none"
                        required
                        placeholder="Confirm Email"
                    />
                    <div className="flex gap-2 font-semibold">
                        <button
                            type="button"
                            className={clsx(
                                "bg-yellow-primary hover:bg-yellow-secondary active:bg-yellow-secondary focus-visible:bg-yellow-secondary mt-5 flex cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-2 text-black",
                            )}
                            onClick={() => dialog.current?.close()}
                        >
                            <X /> Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className={clsx(
                                "bg-yellow-primary hover:bg-yellow-secondary active:bg-yellow-secondary focus-visible:bg-yellow-secondary mt-5 flex grow items-center justify-center gap-1 rounded-md px-3 py-2 text-black",
                                !isPending && "cursor-pointer",
                            )}
                        >
                            {isPending ? (
                                <>
                                    <LoaderCircle className="animate-spin" />{" "}
                                    Waiting...
                                </>
                            ) : (
                                <>
                                    <Trash2 /> Delete
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </dialog>
            <button
                className="font-poppins hover:bg-yellow-secondary bg-yellow-primary flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-md transition-colors sm:text-base"
                onClick={() => dialog.current?.showModal()}
            >
                <Trash2 size={20} /> Delete Account
            </button>
        </>
    );
}

export function StudentInfoComponent() {
    const { email, fname, lname, createdAt } = useUserInfo();

    const dateCreated = getPHDateTime(createdAt ?? new Date());

    return (
        <>
            <div className="flex w-full items-center gap-2 text-white/90">
                <div className="rounded-md border border-white/15 bg-white/10 p-2">
                    <GraduationCap size={30} />
                </div>
                <div>
                    <p className="text-2xl font-bold wrap-anywhere">{`${fname} ${lname}`}</p>
                    <p className="text-sm font-semibold wrap-anywhere">
                        {email}
                    </p>
                </div>
            </div>

            <Divider text="Account" />
            {createdAt && (
                <p className="font-dm-sans text-text-primary mb-6">
                    <span className="text-text-primary/70">Date created:</span>{" "}
                    {Months[dateCreated.month]} {dateCreated.day},{" "}
                    {dateCreated.year}
                </p>
            )}
            <DeleteAccount />
        </>
    );
}
