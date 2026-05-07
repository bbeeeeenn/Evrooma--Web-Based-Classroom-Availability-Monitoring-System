"use client";
import { DeleteUser } from "@/app/actions/UserActions";
import { Divider } from "@/app/components/Divider";
import { useUserInfo } from "@/app/contexts/UserInfoProvider";
import { adminStudentsPage } from "@/constants";
import clsx from "clsx";
import {
    GraduationCap,
    LoaderCircle,
    Mail,
    Plus,
    Trash2,
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
                className="bg-green-secondary text-text-primary border-green-quarternary m-auto w-[calc(100%-1.5rem)] max-w-md overflow-hidden rounded-md border-b-4 px-6 pt-10 pb-7 select-none backdrop:bg-black/30"
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
                <form action={formAction}>
                    <div className="flex items-center gap-2">
                        <span>
                            <Mail />
                        </span>
                        <div className="relative grow">
                            <input
                                spellCheck={false}
                                autoComplete="off"
                                type="email"
                                id="email"
                                name="email"
                                defaultValue={state.email}
                                className="peer w-full border-b-2 border-green-200 py-1 text-xl font-semibold tracking-wide lowercase outline-none placeholder:text-transparent focus:border-green-50"
                                required
                                placeholder="Confirm Email"
                            />
                            <label
                                htmlFor="email"
                                className="pointer-events-none absolute -top-5 left-0 text-sm text-green-50 transition-all peer-placeholder-shown:top-1 peer-placeholder-shown:text-xl peer-placeholder-shown:text-green-200 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-green-50"
                            >
                                Confirm Email
                            </label>
                        </div>
                    </div>
                    <div className="flex gap-2">
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
                                    <Plus /> Delete
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </dialog>
            <button
                className="font-poppins hover:bg-yellow-secondary bg-yellow-primary mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-md transition-colors sm:text-base"
                onClick={() => dialog.current?.showModal()}
            >
                <Trash2 size={20} /> Delete Account
            </button>
        </>
    );
}

export function StudentInfoComponent() {
    const { email, fname, lname } = useUserInfo();

    return (
        <>
            <div className="flex w-full items-center gap-2 text-white/90">
                <div>
                    <GraduationCap size={40} />
                </div>
                <div>
                    <p className="text-2xl font-bold wrap-anywhere">{`${fname} ${lname}`}</p>
                    <p className="text-sm font-semibold wrap-anywhere">
                        {email}
                    </p>
                </div>
            </div>

            <Divider text="Account" />
            <DeleteAccount />
        </>
    );
}
