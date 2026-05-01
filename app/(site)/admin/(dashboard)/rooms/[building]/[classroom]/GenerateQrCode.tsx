"use client";
import { useBuildingInfo } from "@/app/contexts/BuildingProvider";
import { useClassroomInfo } from "@/app/contexts/ClassroomProvider";
import { scanLandingPage } from "@/constants";
import { Download, QrCode } from "lucide-react";
import { MouseEvent, useEffect, useRef, useState } from "react";
import QRGenerator from "qrcode";
import Image from "next/image";

const width = 600;
const height = 775;

function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
): void {
    const words: string[] = text.split(" ");
    let line: string = "";

    for (let i = 0; i < words.length; i++) {
        const testLine: string = line + words[i] + " ";
        const metrics: TextMetrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, x, y);
            line = words[i] + " ";
            y += lineHeight;
        } else {
            line = testLine;
        }
    }

    ctx.fillText(line, x, y);
}

export default function GenerateQrCode() {
    const building = useBuildingInfo();
    const classroom = useClassroomInfo();
    const [data, setData] = useState<string | null>(null);
    useEffect(() => {
        (async () => {
            const finalCanvas = document.createElement("canvas");
            finalCanvas.width = width;
            finalCanvas.height = height;

            const ctx = finalCanvas.getContext("2d");
            if (!ctx) return;

            // background
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, width, height);

            // temp QR canvas
            const qrCanvas = document.createElement("canvas");

            await QRGenerator.toCanvas(
                qrCanvas,
                `${window.location.origin}${scanLandingPage}?roomId=${encodeURIComponent(classroom.classroomId)}`,
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
            wrapText(
                ctx,
                `${building.buildingName} - ${classroom.classroomCode}`,
                300,
                660,
                500, // max width
                55, // line height
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
        if (x < left || x > right || y < top || y > bottom) {
            dialog.current.close();
            document.body.classList.remove("overflow-hidden");
        }
    };
    return (
        <>
            {data && (
                <dialog
                    ref={dialog}
                    onClick={handleDialogClick}
                    className="m-auto w-[calc(100vw-40px)] max-w-sm bg-transparent select-none backdrop:bg-black/30"
                >
                    <Image
                        src={data}
                        alt=""
                        width={width}
                        height={height}
                        draggable={false}
                        className="w-full rounded-md"
                    />
                    <a
                        href={data}
                        download={`EVROOMA-${building.buildingName}-${classroom.classroomCode}.png`}
                        className="bg-yellow-primary hover:bg-yellow-secondary focus-visible:bg-yellow-secondary active:bg-yellow-secondary mt-4 flex w-full items-center justify-center gap-2 rounded-md py-3 text-xl font-semibold"
                    >
                        <span>
                            <Download />
                        </span>
                        Download
                    </a>
                </dialog>
            )}
            <button
                className="bg-yellow-primary my-10 flex w-full max-w-xs items-center justify-center gap-2 rounded-md py-2 font-semibold text-black shadow-md"
                onClick={() => {
                    if (!dialog.current) return;
                    dialog.current.showModal();
                    document.body.classList.add("overflow-hidden");
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
