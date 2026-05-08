export default function EmptyFallback({ text }: { text: string }) {
    return (
        <div className="text-text-secondary bg-green-secondary/20 mt-10 rounded-md p-10 text-center text-xl font-semibold shadow-md">
            {text}
        </div>
    );
}
