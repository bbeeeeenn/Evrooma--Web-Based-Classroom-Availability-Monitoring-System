import { GetInstructorAuthInfo } from "@/app/actions/InstructorAuthActions";
import { instructorLoginPage } from "@/constants";
import { BookText, Settings, Settings2 } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "../../loading";
import Link from "next/link";
import { Divider } from "@/app/components/Divider";

async function Profile() {
    const instructor = await GetInstructorAuthInfo();
    if (!instructor) redirect(instructorLoginPage);

    return (
        <div className="flex items-end justify-between gap-5">
            <div className="text-text-primary flex items-center gap-2">
                <BookText size={45} />
                <div>
                    <p className="text-text-secondary font-semibold">
                        Welcome,
                    </p>
                    <p className="text-2xl font-bold">{instructor.fullName}</p>
                </div>
            </div>
            <Link
                href={""}
                className="bg-yellow-primary focus-visible:bg-yellow-secondary active:bg-yellow-secondary hover:bg-yellow-secondary font-poppins flex items-center justify-center gap-2 rounded-md p-2 px-3 text-sm font-semibold text-black shadow-md"
            >
                <Settings2 size={20} />{" "}
                <span className="hidden sm:inline">Settings</span>
            </Link>
        </div>
    );
}

export default function InstructorPage() {
    return (
        <>
            <Suspense fallback={<Loading />}>
                <Profile />
            </Suspense>
            <Divider text="Today's Schedule" />
        </>
    );
}
