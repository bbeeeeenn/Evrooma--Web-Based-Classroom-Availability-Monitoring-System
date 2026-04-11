import Image from "next/image";

export default function Loading({
    text = "EVROOMA",
}: Readonly<{ text?: string }>) {
    return (
        <div className="bg-green-secondary font-inter text-text-primary fixed inset-0 z-50 m-auto flex flex-col items-center justify-center gap-3 text-3xl tracking-widest">
            <Image
                draggable={false}
                src="/favicon_dark.svg"
                width={150}
                height={150}
                alt="logo"
                loading="eager"
                className="animate-bounce"
            />
            <p className="w-full truncate px-5 text-center font-bold">{text}</p>
        </div>
    );
}

// export default function Loading({
//     text = "EVROOMA",
// }: Readonly<{ text?: string }>) {
//     return (
//         <div className="bg-black-100 dark:bg-black-400 dark:text-black-100 font-inter fixed inset-0 z-50 m-auto flex flex-col items-center justify-center gap-3 text-3xl font-semibold tracking-widest">
//             <Image
//                 draggable={false}
//                 src="/favicon_light.svg"
//                 width={150}
//                 height={150}
//                 alt="logo"
//                 className="animate-bounce dark:hidden"
//             />
//             <Image
//                 draggable={false}
//                 src="/favicon_dark.svg"
//                 width={150}
//                 height={150}
//                 alt="logo"
//                 className="hidden animate-bounce dark:block"
//             />
//             <p className="w-full truncate px-5 text-center">{text}</p>
//         </div>
//     );
// }
