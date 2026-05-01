import { Suspense } from "react";
import Loading from "../loading";
import { Done, EmailForm, Error } from "./ClientComponents";
import Image from "next/image";
import Link from "next/link";
import { homePage } from "@/constants";
import { BackButton } from "@/app/components/BackButton";
import { headers } from "next/headers";

async function ForgotPage() {
    return (
        <>
            <div className="bg-green-quarternary border-yellow-primary text-text-primary fixed inset-x-0 top-0 border-b-2 py-5 text-xl font-bold tracking-widest">
                <Link
                    href={homePage}
                    className="m-auto flex w-fit items-center gap-3"
                >
                    <Image
                        src={"/favicon_dark.svg"}
                        alt=""
                        height={30}
                        width={30}
                    />
                    <p>EVROOMA</p>
                </Link>
            </div>
            <main className="text-text-primary m-auto mt-25 max-w-2xl px-5">
                <BackButton
                    dest={homePage}
                    referer={(await headers()).get("referer")}
                />
                <EmailForm />
            </main>
        </>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <ForgotPage />
        </Suspense>
    );
}
