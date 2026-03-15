import Image from "next/image";

export default function Loading() {
    return (
        <div className="bg-black-100 dark:bg-black-400 dark:text-black-100 font-inter fixed inset-0 m-auto flex flex-col items-center justify-center gap-3 text-3xl font-semibold tracking-widest">
            <Image
                src="/favicon_light.svg"
                width={150}
                height={100}
                alt="logo"
                className="animate-bounce dark:hidden"
            />
            <Image
                src="/favicon_dark.svg"
                width={150}
                height={100}
                alt="logo"
                className="hidden animate-bounce dark:block"
            />
            EVROOMA
        </div>
    );
}
