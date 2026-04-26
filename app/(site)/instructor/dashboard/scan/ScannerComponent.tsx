"use client";

import { instructorScanPage } from "@/constants";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function QRScanner() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const handleScan = (codes: IDetectedBarcode[]) =>
        codes.forEach((code) => {
            if (!code.rawValue.includes(window.location.origin)) return;

            const url = new URL(code.rawValue);
            const roomId = url.searchParams.get("roomId");
            if (roomId) {
                router.replace(`${instructorScanPage}?roomId=${roomId}`);
            }
        });

    const handleError = (err: unknown) => {
        if (err instanceof Error && err.name === "NotAllowedError") {
            setError("Camera permission denied.");
            return;
        }
        setError("Unknown error.");
    };
    return (
        <>
            {error ? (
                <div className="bg-yellow-secondary font-poppins m-auto mt-5 max-w-md rounded-md p-3 shadow-md">
                    <p className="text-center font-semibold">
                        Camera Access Required
                    </p>
                    <p className="text-center text-sm text-black/90">
                        Camera permission was denied. Please enable camera
                        access in your browser or device settings to continue.
                    </p>
                </div>
            ) : (
                <>
                    <Scanner
                        classNames={{
                            container: clsx(
                                "rounded-xl shadow-md max-w-md m-auto bg-green-secondary",
                            ),
                        }}
                        onScan={handleScan}
                        onError={handleError}
                        formats={["qr_code"]}
                        allowMultiple
                        scanDelay={5000}
                    />
                    <div className="bg-yellow-secondary font-poppins m-auto mt-5 max-w-md rounded-md p-3 shadow-md">
                        <p className="text-center font-semibold">
                            Scan QR Code
                        </p>
                        <p className="text-center text-sm text-black/90">
                            Point your camera at the QR Code in your classroom
                        </p>
                    </div>
                </>
            )}
        </>
    );
}
