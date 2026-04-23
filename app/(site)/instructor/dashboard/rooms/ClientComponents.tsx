"use client";
import clsx from "clsx";
import { Building2, ChevronDown, DoorOpen, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FocusEvent, SubmitEvent, useState } from "react";

export type ClassroomFilter = {
    roomCode?: string;
    building?: { name: string; id: string };
};
export function FilterRooms({
    buildings,
}: {
    buildings: { name: string; id: string }[];
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [filter, setFilter] = useState<ClassroomFilter>({
        roomCode: searchParams.get("r") ?? undefined,
        building:
            buildings.find((b) => b.id === (searchParams.get("b") ?? "")) ??
            undefined,
    });
    const [showBuildings, setShowBuildings] = useState(false);

    const handleFormSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (filter.roomCode) params.set("r", filter.roomCode);
        else params.delete("r");
        const url = params.toString()
            ? `${pathname}?${params.toString()}`
            : pathname;
        router.replace(url);
    };
    const handleInputBlur = (e: FocusEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams);
        if (filter.roomCode) params.set("r", filter.roomCode);
        else params.delete("r");
        const url = params.toString()
            ? `${pathname}?${params.toString()}`
            : pathname;
        const currentUrl = window.location.pathname + window.location.search;
        if (currentUrl !== url) router.replace(url);
    };

    const handleBuildingChange = async (building: {
        name: string;
        id: string;
    }) => {
        const params = new URLSearchParams(searchParams);
        if (filter.building?.id !== building.id) params.set("b", building.id);
        else params.delete("b");
        if (filter.roomCode) params.set("r", filter.roomCode);
        else params.delete("r");
        const url = params.toString()
            ? `${pathname}?${params.toString()}`
            : pathname;
        router.replace(url);
        setShowBuildings(false);
        setFilter((prev) => ({
            ...prev,
            building: prev.building?.id === building.id ? undefined : building,
        }));
    };

    return (
        <div className="flex flex-wrap gap-3">
            <div className="bg-green-secondary text-text-primary flex h-fit min-w-50 grow-2 items-center gap-2 rounded-md p-3 shadow-md">
                <span className="opacity-90">
                    <DoorOpen />
                </span>
                <form onSubmit={handleFormSubmit} className="grow">
                    <input
                        type="text"
                        spellCheck={false}
                        value={filter.roomCode ?? ""}
                        onChange={(e) =>
                            setFilter((prev) => ({
                                ...prev,
                                roomCode: e.target.value,
                            }))
                        }
                        onBlur={handleInputBlur}
                        placeholder="Room"
                        className="peer text-text-primary w-full min-w-0 text-xl font-semibold tracking-wide uppercase placeholder:capitalize"
                    />
                </form>
                <span className="opacity-90">
                    <Search />
                </span>
            </div>
            <div className="text-text-primary/80 relative max-w-2xs min-w-40 grow font-semibold">
                <button
                    className={clsx(
                        "flex w-full cursor-pointer items-center gap-2 rounded-md p-3 text-xl shadow-md",
                        filter.building
                            ? "bg-yellow-primary focus-visible:bg-yellow-secondary active:bg-yellow-secondary hover:bg-yellow-secondary text-black"
                            : "bg-green-secondary focus-visible:bg-green-tertiary active:bg-green-tertiary hover:bg-green-tertiary",
                    )}
                    onClick={() => setShowBuildings((prev) => !prev)}
                >
                    <span>
                        <Building2 />
                    </span>
                    <p className="truncate text-start">
                        {filter.building?.name ?? "All"}
                    </p>
                    <span
                        className={clsx(
                            "ml-auto",
                            showBuildings && "rotate-180",
                        )}
                    >
                        <ChevronDown />
                    </span>
                </button>
                {showBuildings && (
                    <ul className="bg-green-primary absolute inset-x-0 top-full z-100 mt-2 space-y-2 rounded-md p-2 shadow-md">
                        {buildings.map((building) => (
                            <li key={building.id}>
                                <button
                                    className={clsx(
                                        "flex w-full items-center gap-1 truncate rounded-md px-3 py-2 text-start text-lg tracking-wide shadow-md",
                                        filter.building?.id === building.id
                                            ? "bg-yellow-primary focus-visible:bg-yellow-secondary active:bg-yellow-secondary hover:bg-yellow-secondary text-black"
                                            : "bg-green-secondary focus-visible:bg-green-tertiary active:bg-green-tertiary hover:bg-green-tertiary",
                                    )}
                                    onClick={() =>
                                        handleBuildingChange(building)
                                    }
                                >
                                    <span>
                                        <Building2 size={20} />
                                    </span>
                                    {building.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
