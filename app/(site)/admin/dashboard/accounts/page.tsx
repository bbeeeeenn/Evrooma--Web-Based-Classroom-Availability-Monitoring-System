import clsx from "clsx";
import { Plus } from "lucide-react";
import { BackButton } from "../SmallComponents";
import { adminDashboardPage } from "@/constants";

export default function AccountsPage() {
    return (
        <>
            <BackButton dest={adminDashboardPage} />
            <h1 className="flex items-center gap-2 text-4xl font-bold">
                Accounts
            </h1>
            <button
                className={clsx(
                    "my-4 flex cursor-pointer items-center gap-1 rounded-md bg-white p-2 font-semibold shadow-md",
                    "hover:bg-black-400 hover:text-black-100 transition-colors active:scale-105",
                )}
            >
                <Plus /> Add User
            </button>
        </>
    );
}
