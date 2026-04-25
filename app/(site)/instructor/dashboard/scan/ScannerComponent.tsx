"use client";

import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import clsx from "clsx";
import { useState } from "react";

export function QRScanner() {
    const [error, setError] = useState<string | null>(null);
    const handleScan = (codes: IDetectedBarcode[]) => {};
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
                                "rounded-xl shadow-md max-w-md m-auto",
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
