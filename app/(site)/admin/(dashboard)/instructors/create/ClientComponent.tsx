"use client";
import { CreateInstructor } from "@/app/actions/UserActions";
import { adminInstructorsPage, adminCreateInstructorPage } from "@/constants";
import clsx from "clsx";
import { CirclePlus, LoaderCircle, Mail, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "react-toastify";

type Data = {
    fname: string;
    lname: string;
    email: string;
};

export function CreateInstructorForm(): React.ReactNode {
    const router = useRouter();
    const pathname = usePathname();

    const onAction = async (_: unknown, formData: FormData): Promise<Data> => {
        const firstName =
            (formData.get("fname") as string | null)?.trim() ?? "";
        const lastName = (formData.get("lname") as string | null)?.trim() ?? "";
        const email = (formData.get("email") as string | null)?.trim() ?? "";

        const loadingToast = toast.loading("Waiting...");
        const response = await CreateInstructor({
            firstName,
            lastName,
            email,
        });
        if (response.status === "success") {
            toast.update(loadingToast, {
                isLoading: false,
                type: "success",
                render: response.message,
                autoClose: 3000,
            });
            router.replace(`${adminInstructorsPage}/${response.userId ?? ""}`);
        } else {
            toast.update(loadingToast, {
                isLoading: false,
                type: "error",
                render: response.message,
                autoClose: 6000,
            });
            return {
                fname: firstName,
                lname: lastName,
                email,
            };
        }
        return {
            fname: "",
            lname: "",
            email: "",
        };
    };

    const [data, formAction, isPending] = useActionState(onAction, {
        email: "",
        fname: "",
        lname: "",
    });

    return (
        <form
            action={formAction}
            className={clsx(
                "font-poppins bg-green-secondary m-auto mt-10 max-w-sm rounded-lg px-2 text-white sm:max-w-lg sm:px-16 sm:py-10 sm:shadow-md",
                pathname === adminCreateInstructorPage && "accountform",
            )}
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
                    defaultValue={data.fname}
                    className="peer w-full border-b-2 border-white/50 text-xl outline-transparent placeholder:text-transparent focus:border-white"
                />
                <label
                    htmlFor="fname"
                    className={clsx(
                        "pointer-events-none absolute -top-5 left-0 w-full truncate text-sm text-white transition-all",
                        "peer-placeholder-shown:top-0 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/50",
                        "peer-focus:-top-5 peer-focus:text-sm peer-focus:text-white",
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
                    defaultValue={data.lname}
                    className="peer w-full border-b-2 border-white/50 text-xl outline-transparent placeholder:text-transparent focus:border-white"
                />
                <label
                    htmlFor="lname"
                    className={clsx(
                        "pointer-events-none absolute -top-5 left-0 w-full truncate text-sm text-white transition-all",
                        "peer-placeholder-shown:top-0 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/50",
                        "peer-focus:-top-5 peer-focus:text-sm peer-focus:text-white",
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
                    defaultValue={data.email}
                    className="peer w-full border-b-2 border-white/50 text-xl outline-transparent placeholder:text-transparent focus:border-white"
                />
                <label
                    htmlFor="email"
                    className={clsx(
                        "pointer-events-none absolute -top-5 left-0 w-full truncate text-sm text-white opacity-0 transition-all",
                        "peer-placeholder-shown:top-0 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/50 peer-placeholder-shown:opacity-100",
                        "peer-focus:-top-5 peer-focus:text-sm peer-focus:text-white peer-focus:opacity-0",
                    )}
                >
                    example@gmail.com
                </label>
                <label
                    htmlFor="email"
                    className={clsx(
                        "pointer-events-none absolute -top-5 left-0 w-full truncate text-sm text-white opacity-100 transition-all",
                        "peer-placeholder-shown:top-0 peer-placeholder-shown:text-xl peer-placeholder-shown:text-white/50 peer-placeholder-shown:opacity-0",
                        "peer-focus:-top-5 peer-focus:text-sm peer-focus:text-white peer-focus:opacity-100",
                    )}
                >
                    Email
                </label>
            </div>
            <button
                type="submit"
                disabled={isPending}
                className={clsx(
                    "bg-yellow-primary mt-10 flex w-full items-center justify-center gap-2 rounded-md px-10 py-2 text-xl font-semibold text-black shadow-md",
                    isPending ? "opacity-70" : "cursor-pointer",
                )}
            >
                {isPending ? (
                    <>
                        <LoaderCircle className="animate-spin" /> Creating
                    </>
                ) : (
                    <>
                        <CirclePlus /> Create
                    </>
                )}
            </button>
        </form>
    );
}
