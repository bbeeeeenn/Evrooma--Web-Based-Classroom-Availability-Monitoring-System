"use client";
import React, { useContext, useState } from "react";

type UserContextData = {
    userId: string;
    email: string;
    fname: string;
    lname: string;
    createdAt: Date | null;
};

const UserContext = React.createContext<UserContextData>({
    userId: "",
    email: "",
    fname: "",
    lname: "",
    createdAt: null,
});
const UpdateUserContext = React.createContext<(data: UserContextData) => void>(
    () => {},
);

export function UserInfoProvider({
    children,
    data,
}: {
    children: React.ReactNode;
    data: UserContextData;
}) {
    const [user, setUser] = useState<UserContextData>({
        ...data,
    });

    const updateUser = (data: UserContextData) => {
        setUser(data);
    };

    return (
        <UserContext.Provider value={user}>
            <UpdateUserContext.Provider value={updateUser}>
                {children}
            </UpdateUserContext.Provider>
        </UserContext.Provider>
    );
}

export function useUserInfo() {
    return useContext(UserContext);
}

export function useUpdateUserInfo() {
    return useContext(UpdateUserContext);
}
