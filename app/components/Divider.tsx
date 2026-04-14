export function Divider({ text }: { text?: string }) {
    return (
        <div className="relative my-10 flex items-center justify-center font-semibold sm:justify-start">
            <div className="absolute inset-0 m-auto h-px rounded-full bg-green-100"></div>
            {text && (
                <p className="bg-green-primary text-md absolute w-fit px-2 text-center tracking-wide text-green-100 sm:ml-10 sm:text-lg">
                    {text}
                </p>
            )}
        </div>
    );
}
