import { homePage } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "../loading";
import { redirect } from "next/navigation";
import ErrorFallback from "@/app/components/ErrorFallback";
import {
    PopulatedPlainResetTokenDocument,
    ResetToken,
} from "@/app/mongoDb/models/resettoken";
import { ChangePasswordForm, InvalidToken } from "./ClientComponents";
import { connection } from "next/server";
import { connectDB } from "@/app/mongoDb/mongodb";

async function ResetPassword({ token }: { token: string }) {
    await connection();
    let foundToken: PopulatedPlainResetTokenDocument;

    try {
        await connectDB();
        foundToken = await ResetToken.findOne({ token })
            .populate("user")
            .lean({ virtuals: true });
    } catch (e) {
        console.error(e);
        return <ErrorFallback error={e} />;
    }

    if (
        !foundToken ||
        foundToken.done ||
        new Date().getTime() - foundToken.createdAt.getTime() > 1000 * 60 * 15 // Is Expired
    ) {
        return <InvalidToken />;
    }

    return (
        <ChangePasswordForm
            key={foundToken.token}
            fullname={foundToken.user.fullName}
            role={foundToken.user.type}
            token={foundToken.token}
            email={foundToken.user.email}
        />
    );
}

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>;
}) {
    const { token } = await searchParams;
    if (!token) redirect(homePage);
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
                <Suspense fallback={<Loading />}>
                    <ResetPassword token={token} />
                </Suspense>
            </main>
        </>
    );
}
