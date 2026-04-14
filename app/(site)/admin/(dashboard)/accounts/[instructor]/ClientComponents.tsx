"use client";
import {
    useInstructorInfo,
    useUpdateInstructorInfo,
} from "@/app/contexts/InstructorProvider";
import { BookText, SquarePen, Trash2 } from "lucide-react";
import { Divider } from "@/app/components/Divider";

function Row({
    label,
    content,
    onClick,
}: {
    label: string;
    content: string;
    onClick?: () => void;
}) {
    return (
        <tr>
            <td>{label}:</td>
            <td className="text-white/80">
                <p className="flex items-center gap-2 underline">
                    <span className="break-all">{content}</span>
                    <button>
                        <SquarePen size={20} className="cursor-pointer" />
                    </button>
                </p>
            </td>
        </tr>
    );
}

export function InstructorInfoComponent() {
    const { instructorId, email, fname, lname } = useInstructorInfo();
    const updateInstructorInfo = useUpdateInstructorInfo();

    return (
        <>
            <h1 className="flex items-center gap-2 text-4xl font-bold text-white/90">
                <BookText size={40} /> {`${fname} ${lname}`}
            </h1>
            <Divider text="Account" />
            <table className="font-poppins w-full border-separate border-spacing-2 font-semibold text-white/90 select-text">
                <tbody>
                    <Row label="First Name" content={fname} />
                    <Row label="Last Name" content={lname} />
                    <Row label="Email" content={email} />
                    <Row label="Password" content={"•".repeat(15)} />
                </tbody>
            </table>
            <button className="font-poppins hover:bg-green-tertiary bg-yellow-primary mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 font-semibold shadow-md transition-colors hover:text-white">
                <Trash2 size={20} /> Delete Account
            </button>
        </>
    );
}
