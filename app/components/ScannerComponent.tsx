"use client";

import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export function QRScanner({ scanUrl }: { scanUrl: string }) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const processingRef = useRef(false);

    const handleScan = (codes: IDetectedBarcode[]) => {
        if (processingRef.current) return;

        const code = codes.find((c) =>
            c.rawValue?.includes(window.location.origin),
        );
        if (!code) return;

        const url = new URL(code.rawValue);
        const roomId = url.searchParams.get("roomid");
        if (roomId) {
            processingRef.current = true;
            router.replace(`${scanUrl}?roomid=${roomId}`);
        }
    };

    const handleError = (err: unknown) => {
        if (err instanceof Error && err.name === "NotAllowedError") {
            setError("Camera permission denied.");
            return;
        }
        setError("Unknown error.");
    };

    if (error)
        return (
            <div className="bg-yellow-secondary font-poppins m-auto mt-5 max-w-md rounded-md p-3 shadow-md">
                <p className="text-center font-semibold">
                    Camera Access Required
                </p>
                <p className="text-center text-sm text-black/90">
                    Camera permission was denied. Please enable camera access in
                    your browser or device settings to continue.
                </p>
            </div>
        );

    return (
        <>
            <Scanner
                classNames={{
                    container: clsx(
                        "rounded-xl shadow-md max-w-md mt-3.5 m-auto bg-green-secondary",
                    ),
                }}
                onScan={handleScan}
                onError={handleError}
                formats={["qr_code"]}
                allowMultiple={false}
                scanDelay={5000}
            />
            <div className="bg-yellow-secondary font-poppins m-auto mt-5 max-w-md rounded-md p-3 shadow-md">
                <p className="text-center font-semibold">Scan QR Code</p>
                <p className="text-center text-sm text-black/90">
                    Point your camera at the QR Code in your classroom
                </p>
            </div>
        </>
    );
}
