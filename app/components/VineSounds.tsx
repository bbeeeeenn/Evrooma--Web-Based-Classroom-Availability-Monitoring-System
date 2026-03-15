"use client";

import { useEffect, useRef } from "react";

const audios = ["/vine-boom.mp3", "/huh-cat-meme.mp3"];

export default function VineSounds() {
    const count = useRef(0);
    const onClick = () => {
        if (count.current > 3) return;
        const audio = new Audio(
            audios[Math.floor(Math.random() * audios.length)],
        );
        audio.play();
        count.current++;
        setTimeout(() => {
            count.current--;
        }, 1000);
    };

    useEffect(() => {
        window.addEventListener("click", onClick);

        return () => window.removeEventListener("click", onClick);
    }, []);
    return <></>;
}
