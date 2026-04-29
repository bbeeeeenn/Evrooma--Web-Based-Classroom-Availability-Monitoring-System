export default function Layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="has-[.accountform]:bg-green-secondary m-auto max-w-5xl px-5 pt-3 pb-20 sm:has-[.accountform]:bg-transparent">
            {children}
        </main>
    );
}
