import Image from "next/image";
import React, { useState } from "react";

export default function RickRoll({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}): React.ReactNode {
    const [show, setShow] = useState(false);
    return (
        <>
            <div onClick={() => setShow(true)} className={className}>
                {children}
            </div>
            {show && (
                <Image
                    alt=""
                    src={"/rickroll-rick.gif"}
                    unoptimized
                    loading="eager"
                    width={200}
                    height={200}
                    onClick={() => setShow(false)}
                    className="fixed inset-0 z-50 h-full w-full bg-black/70 object-contain"
                />
            )}
        </>
    );
}
