"use client";
import {
    ChangeMyFirstName,
    ChangeMyLastName,
    ChangeMyPassword,
} from "@/app/actions/UserSettingsAction";
import clsx from "clsx";
import {
    ChevronRight,
    Eye,
    EyeClosed,
    LoaderCircle,
    Lock,
    Pencil,
} from "lucide-react";
import { useActionState, useState } from "react";
import { toast } from "react-toastify";

export function ChangeName({
    oldName,
    type,
    userType,
}: {
    oldName: string;
    type: "fname" | "lname";
    userType: "instructor" | "student";
}) {
    const [originalName, setOriginalName] = useState(oldName);
    const [name, setName] = useState(oldName);
    const changed = originalName !== name.trim();

    const onAction = async () => {
        const loadingToast = toast.loading("Waiting...");
        const res =
            type === "fname"
                ? await ChangeMyFirstName(userType, name)
                : await ChangeMyLastName(userType, name);
        toast.update(loadingToast, {
            isLoading: false,
            type: res.status as "success" | "error",
            autoClose: 3000,
            render: res.message,
        });
        if (res.status === "success" && res.new) {
            setName(res.new);
            setOriginalName(res.new);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, formAction, isPending] = useActionState(onAction, null);

    return (
        <form
            action={formAction}
            onSubmit={(e) => {
                if (isPending || !changed) e.preventDefault();
            }}
            className="text-text-primary mt-5 flex max-w-xl flex-wrap items-center gap-3 text-xl font-medium"
        >
            <label htmlFor={type}>
                {type === "fname" ? "First Name" : "Last Name"}
            </label>
            <input
                type="text"
                name={type}
                spellCheck={false}
                autoComplete="off"
                id={type}
                className="bg-green-secondary border-green-tertiary min-w-0 grow rounded-md border-2 px-2 py-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            {changed && (
                <button
                    type="submit"
                    className={clsx(
                        "bg-yellow-primary ml-auto flex items-center gap-1 rounded-md px-3 py-1.5 text-[16px] font-semibold text-black shadow-md",
                        "hover:bg-yellow-secondary focus-visible:bg-yellow-secondary active:bg-yellow-secondary",
                        isPending && "pointer-events-none opacity-75",
                    )}
                >
                    <span>
                        <Pencil size={20} />
                    </span>{" "}
                    Save
                </button>
            )}
        </form>
    );
}

function Password({
    name,
    label,
    defaultValue,
    error,
}: {
    name: string;
    label: string;
    defaultValue: string;
    error: string;
}) {
    const [show, setShow] = useState(false);
    return (
        <div className="my-4">
            <label htmlFor={name} className="flex items-center gap-2">
                <span>
                    <Lock />
                </span>
                {label}
            </label>
            <div
                className={clsx(
                    "bg-green-secondary mt-2 flex w-full items-center rounded-md border-2 pr-2",
                    error ? "border-red-800" : "border-green-tertiary",
                )}
            >
                <input
                    type={show ? "text" : "password"}
                    name={name}
                    id={name}
                    className="font-inter min-w-0 grow px-2 py-1 font-medium tracking-wider"
                    defaultValue={defaultValue}
                />
                <div
                    onClick={() => setShow((prev) => !prev)}
                    className="cursor-pointer"
                >
                    {show ? <Eye /> : <EyeClosed />}
                </div>
            </div>
            {error && (
                <p className="font-poppins text-sm font-normal text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}

export function ChangePassword({
    userType,
}: {
    userType: "instructor" | "student";
}) {
    const onAction = async (
        _: {
            oldPassword: string;
            errOld: string;
            newPassword: string;
            errNew: string;
            confirmPassword: string;
            errConfirm: string;
        },
        formData: FormData,
    ): Promise<{
        oldPassword: string;
        errOld: string;
        newPassword: string;
        errNew: string;
        confirmPassword: string;
        errConfirm: string;
    }> => {
        const errors = { errOld: "", errNew: "", errConfirm: "" };
        const oldPassword = (formData.get("old") as string).trim();
        const newPassword = (formData.get("new") as string).trim();
        const confirmPassword = (formData.get("confirm") as string).trim();

        if (!oldPassword || !newPassword || !confirmPassword) {
            errors.errOld = !oldPassword
                ? "Please enter your old password"
                : "";
            errors.errNew = !newPassword ? "Please enter a new password" : "";
            errors.errConfirm = !confirmPassword
                ? "Please re-enter your new password"
                : "";
        }

        if (newPassword !== confirmPassword) {
            errors.errNew = errors.errNew
                ? errors.errNew
                : "New password doesn't match";
            errors.errConfirm = errors.errConfirm
                ? errors.errConfirm
                : "New password doesn't match";
        }

        if (errors.errConfirm || errors.errNew || errors.errOld)
            return { ...errors, oldPassword, newPassword, confirmPassword };

        const loadingToast = toast.loading("Changing password...");
        const res = await ChangeMyPassword(userType, oldPassword, newPassword);

        toast.update(loadingToast, {
            isLoading: false,
            autoClose: 3000,
            type: res.status === "error" ? "error" : "success",
            render: res.message,
        });

        if (res.status === "error") {
            if (res.message === "Incorrect password.")
                errors.errOld = "Incorrect password.";
            return {
                ...errors,
                oldPassword,
                newPassword,
                confirmPassword,
            };
        }

        return {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            errOld: "",
            errNew: "",
            errConfirm: "",
        };
    };

    const [
        {
            oldPassword,
            newPassword,
            confirmPassword,
            errOld,
            errNew,
            errConfirm,
        },
        formAction,
        isPending,
    ] = useActionState(onAction, {
        oldPassword: "",
        errOld: "",
        newPassword: "",
        errNew: "",
        confirmPassword: "",
        errConfirm: "",
    });

    return (
        <form
            action={formAction}
            onSubmit={(e) => {
                if (isPending) e.preventDefault();
            }}
            className="text-text-primary max-w-md text-xl font-semibold"
        >
            <Password
                defaultValue={oldPassword}
                label="Current Password"
                name="old"
                error={errOld}
            />
            <Password
                defaultValue={newPassword}
                label="New Password"
                name="new"
                error={errNew}
            />
            <Password
                defaultValue={confirmPassword}
                label="Confirm Password"
                name="confirm"
                error={errConfirm}
            />
            <button
                type="submit"
                className={clsx(
                    "bg-yellow-primary mt-6 flex w-full items-center justify-center gap-1.5 rounded-md px-2 py-2 text-black shadow-md",
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
                        Change Password
                        <span>
                            <ChevronRight />
                        </span>
                    </>
                )}
            </button>
        </form>
    );
}
