"use client";
import { useBuildingInfo } from "@/app/contexts/BuildingProvider";
import { useClassroomInfo } from "@/app/contexts/ClassroomProvider";
import { scanLandingPage } from "@/constants";
import { QrCode } from "lucide-react";
import { MouseEvent, useEffect, useRef, useState } from "react";
import QRGenerator from "qrcode";
import Image from "next/image";

export default function GenerateQrCode() {
    const building = useBuildingInfo();
    const classroom = useClassroomInfo();
    const [data, setData] = useState<string | null>(null);
    useEffect(() => {
        (async () => {
            const finalCanvas = document.createElement("canvas");
            finalCanvas.width = 600;
            finalCanvas.height = 720;

            const ctx = finalCanvas.getContext("2d");
            if (!ctx) return;

            // background
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, 600, 720);

            // temp QR canvas
            const qrCanvas = document.createElement("canvas");

            await QRGenerator.toCanvas(
                qrCanvas,
                `${window.location.host}${scanLandingPage}/${classroom.classroomId}`,
                {
                    width: 500,
                    margin: 1,
                },
            );

            // draw QR onto final canvas
            ctx.drawImage(qrCanvas, 50, 50);

            // text
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.font = "25px Poppins";
            ctx.fillText("EVROOMA", 300, 600);
            ctx.font = "600 40px Poppins";
            ctx.fillText(
                `${building.buildingName} - ${classroom.classroomCode}`,
                300,
                660,
            );

            setData(finalCanvas.toDataURL("image/png"));
        })();
    }, []);

    const dialog = useRef<HTMLDialogElement>(null);
    const handleDialogClick = (e: MouseEvent<HTMLDialogElement>) => {
        if (!dialog.current) return;
        const { left, right, top, bottom } =
            dialog.current.getBoundingClientRect();
        const { clientX: x, clientY: y } = e;
        if (x < left || x > right || y < top || y > bottom)
            dialog.current.close();
    };
    return (
        <>
            {data && (
                <dialog
                    ref={dialog}
                    onClick={handleDialogClick}
                    className="m-auto w-full max-w-md bg-transparent px-5 backdrop:bg-black/30"
                >
                    <Image
                        src={data}
                        alt=""
                        width={600}
                        height={720}
                        draggable={false}
                        className="w-full rounded-md"
                    />
                    <a
                        href={data}
                        download={`EVROOMA-${building.buildingName}-${classroom.classroomCode}.png`}
                        className="bg-yellow-primary hover:bg-yellow-secondary focus-visible:bg-yellow-secondary active:bg-yellow-secondary mt-4 block w-full rounded-md py-3 text-center text-xl font-semibold"
                    >
                        Download
                    </a>
                </dialog>
            )}
            <button
                className="bg-yellow-primary my-10 flex w-full max-w-xs items-center justify-center gap-2 rounded-md py-2 font-semibold text-black shadow-md"
                onClick={() => {
                    if (!dialog.current) return;
                    if (dialog.current.open) dialog.current.close();
                    else dialog.current.showModal();
                }}
            >
                <span>
                    <QrCode />
                </span>
                <p>Generate QR Code</p>
            </button>
        </>
    );
}
