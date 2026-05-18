import { BackButton } from "@/app/components/BackButton";
import { instructorRoomsPage } from "@/constants";
import { Suspense } from "react";
import Loading from "@/app/(site)/loading";
import { headers } from "next/headers";
import { ClassroomPage } from "@/app/components/ClassroomPageComponents";

export default async function Page({
    params,
}: {
    params: Promise<{ classroom: string }>;
}) {
    const referer = (await headers()).get("referer");
    return (
        <>
            <BackButton
                dest={instructorRoomsPage}
                text="Rooms"
                referer={referer}
            />
            <Suspense fallback={<Loading />}>
                <ClassroomPage params={params} />
            </Suspense>
        </>
    );
}
