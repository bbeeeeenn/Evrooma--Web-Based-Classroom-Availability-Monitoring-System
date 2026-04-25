// "use client";
// import Image from "next/image";
// import QRCode from "qrcode";
// import { useEffect, useState } from "react";

// export default function TestPage() {
//     const [data, setData] = useState("");
//     useEffect(() => {
//         const canvas = document.createElement("canvas");
//         canvas.width = 300;
//         canvas.height = 360;

//         const ctx = canvas.getContext("2d")!;

//         // white background
//         ctx.fillStyle = "white";
//         ctx.fillRect(0, 0, canvas.width, canvas.height);

//         // draw QR code
//         QRCode.toCanvas(
//             canvas,
//             "https://example.com",
//             {
//                 width: 250,
//                 margin: 1,
//             },
//             (err) => {
//                 if (err) return;
//                 // draw text
//                 ctx.fillStyle = "black";
//                 ctx.font = "20px Arial";
//                 ctx.textAlign = "center";
//                 ctx.fillText("Scan Me", 150, 330);
//                 setData(canvas.toDataURL("image/png"));
//             },
//         );
//     }, []);

//     return (
//         <>
//             {data && (
//                 <Image
//                     src={data}
//                     alt=""
//                     height={360}
//                     width={300}
//                     className="h-auto w-full"
//                 />
//             )}
//         </>
//     );
// }

"use client";
import Image from "next/image";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

export default function TestPage() {
    const [data, setData] = useState("");

    useEffect(() => {
        async function generate() {
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

            await QRCode.toCanvas(qrCanvas, "https://example.com", {
                width: 500,
                margin: 1,
            });

            // draw QR onto final canvas
            ctx.drawImage(qrCanvas, 50, 40);

            // text
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.font = "25px Poppins";
            ctx.fillText("EVROOMA", 300, 590);
            ctx.font = "600 40px Poppins";
            ctx.fillText("HIRAYA - CL1", 300, 650);

            setData(finalCanvas.toDataURL("image/png"));
        }

        generate();
    }, []);

    return data ? (
        <Image
            src={data}
            alt="QR Code"
            width={600}
            height={600}
            className="fixed inset-0 m-auto h-auto w-full max-w-md"
        />
    ) : null;
}
