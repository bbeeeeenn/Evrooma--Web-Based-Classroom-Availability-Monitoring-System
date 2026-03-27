"use client";
import clsx from "clsx";
import { BookText, CirclePlus, Lock, Mail, User } from "lucide-react";
import { useActionState, useState } from "react";

/**
 * Creates a form component for registering a new instructor.
 *
 * The form collects the following information:
 * - First Name
 * - Last Name
 * - Email
 * - Password
 * - Password confirmation
 *
 * Features:
 * - Animated floating labels that transition when input is focused or populated
 * - Styled with Tailwind CSS and Poppins font
 * - Uses icon indicators for each section (BookText, User, Mail, Lock)
 * - Input fields have bottom border focus states
 *
 * @returns {React.ReactNode} A form element for creating new instructor accounts
 */

type Data = {
    fname: string;
    lname: string;
    email: string;
    password: string;
    password2: string;
};

const defaultData: Data = {
    fname: "",
    lname: "",
    email: "",
    password: "",
    password2: "",
};

export function CreateInstructorForm(): React.ReactNode {
    // TODO: matulog 9pm
    const [data, setData] = useState<Data>({ ...defaultData });

    const onAction = async (_: unknown, formData: FormData): Promise<void> => {
        const fname = (formData.get("fname") as string | null)?.trim() ?? "";
        const lname = (formData.get("lname") as string | null)?.trim() ?? "";
        const email = (formData.get("email") as string | null)?.trim() ?? "";
        const password =
            (formData.get("password") as string | null)?.trim() ?? "";
        const password2 =
            (formData.get("password2") as string | null)?.trim() ?? "";
    };

    const [_, formAction, isPending] = useActionState(onAction, null);
    return (
        <form
            action={formAction}
            className="cif font-poppins m-auto mt-10 max-w-sm rounded-lg bg-white px-2 sm:max-w-lg sm:p-10 sm:shadow-md"
        >
            <p className="flex items-center gap-2 text-lg font-semibold">
                <User size={20} /> Name
            </p>
            <div className="relative mt-7">
                <input
                    required
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    id="fname"
                    name="fname"
                    placeholder="First Name"
                    value={data.fname}
                    onChange={(e) =>
                        setData((prev) => ({ ...prev, fname: e.target.value }))
                    }
                    className="peer w-full border-b-2 border-gray-300 text-xl outline-transparent placeholder:text-transparent focus:border-gray-600"
                />
                <label
                    htmlFor="fname"
                    className={clsx(
                        "pointer-events-none absolute -top-5 left-0 w-full truncate text-sm text-gray-600 transition-all",
                        "peer-placeholder-shown:top-0 peer-placeholder-shown:text-xl peer-placeholder-shown:text-gray-300",
                        "peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600",
                    )}
                >
                    First Name
                </label>
            </div>
            <div className="font-poppins relative mt-10">
                <input
                    required
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    id="lname"
                    name="lname"
                    placeholder="Last Name"
                    value={data.lname}
                    onChange={(e) =>
                        setData((prev) => ({ ...prev, lname: e.target.value }))
                    }
                    className="peer w-full border-b-2 border-gray-300 text-xl outline-transparent placeholder:text-transparent focus:border-gray-600"
                />
                <label
                    htmlFor="lname"
                    className={clsx(
                        "pointer-events-none absolute -top-5 left-0 w-full truncate text-sm text-gray-600 transition-all",
                        "peer-placeholder-shown:top-0 peer-placeholder-shown:text-xl peer-placeholder-shown:text-gray-300",
                        "peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600",
                    )}
                >
                    Last Name
                </label>
            </div>
            <p className="mt-10 flex items-center gap-2 text-lg font-semibold">
                <Mail size={20} /> Email
            </p>
            <div className="relative mt-7">
                <input
                    required
                    type="email"
                    autoComplete="off"
                    spellCheck={false}
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={data.email}
                    onChange={(e) =>
                        setData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="peer w-full border-b-2 border-gray-300 text-xl outline-transparent placeholder:text-transparent focus:border-gray-600"
                />
                <label
                    htmlFor="email"
                    className={clsx(
                        "pointer-events-none absolute -top-5 left-0 w-full truncate text-sm text-gray-600 opacity-0 transition-all",
                        "peer-placeholder-shown:top-0 peer-placeholder-shown:text-xl peer-placeholder-shown:text-gray-300 peer-placeholder-shown:opacity-100",
                        "peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600 peer-focus:opacity-0",
                    )}
                >
                    example@gmail.com
                </label>
                <label
                    htmlFor="email"
                    className={clsx(
                        "pointer-events-none absolute -top-5 left-0 w-full truncate text-sm text-gray-600 opacity-100 transition-all",
                        "peer-placeholder-shown:top-0 peer-placeholder-shown:text-xl peer-placeholder-shown:text-gray-300 peer-placeholder-shown:opacity-0",
                        "peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600 peer-focus:opacity-100",
                    )}
                >
                    Email
                </label>
            </div>
            <p className="mt-10 flex items-center gap-2 text-lg font-semibold">
                <Lock size={20} /> Password
            </p>
            <div className="relative mt-7">
                <input
                    required
                    type="password"
                    autoComplete="off"
                    spellCheck={false}
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={data.password}
                    onChange={(e) =>
                        setData((prev) => ({
                            ...prev,
                            password: e.target.value,
                        }))
                    }
                    className="peer w-full border-b-2 border-gray-300 text-xl outline-transparent placeholder:text-transparent focus:border-gray-600"
                />
                <label
                    htmlFor="password"
                    className={clsx(
                        "pointer-events-none absolute -top-5 left-0 w-full truncate text-sm text-gray-600 transition-all",
                        "peer-placeholder-shown:top-0 peer-placeholder-shown:text-xl peer-placeholder-shown:text-gray-300",
                        "peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600",
                    )}
                >
                    Password
                </label>
            </div>{" "}
            <div className="relative mt-10">
                <input
                    required
                    type="password"
                    autoComplete="off"
                    spellCheck={false}
                    id="password2"
                    name="password2"
                    placeholder="Password"
                    value={data.password2}
                    onChange={(e) =>
                        setData((prev) => ({
                            ...prev,
                            password2: e.target.value,
                        }))
                    }
                    className="peer w-full border-b-2 border-gray-300 text-xl outline-transparent placeholder:text-transparent focus:border-gray-600"
                />
                <label
                    htmlFor="password2"
                    className={clsx(
                        "pointer-events-none absolute -top-5 left-0 w-full truncate text-sm text-gray-600 transition-all",
                        "peer-placeholder-shown:top-0 peer-placeholder-shown:text-xl peer-placeholder-shown:text-gray-300",
                        "peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600",
                    )}
                >
                    Confirm Password
                </label>
            </div>
            <button
                type="submit"
                className={clsx(
                    "text-black-100 bg-black-400 mt-10 flex w-full items-center justify-center gap-2 rounded-md px-10 py-2 text-xl font-semibold",
                    "cursor-pointer",
                )}
            >
                <CirclePlus color="#f2f2f2" /> Create
            </button>
        </form>
    );
}
