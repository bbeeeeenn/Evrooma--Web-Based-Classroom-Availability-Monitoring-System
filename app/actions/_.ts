export type ServerActionResponse = {
    status: "success" | "error" | "initial";
    message: string;
};

export interface LoginFormActionResponse extends ServerActionResponse {
    formData: FormData;
    user: string | null;
}

export interface UserAuthSessionData {
    data?: { userId: string };
}

export interface AdminAuthSessionData {
    data?: { username: string; password: string };
}
