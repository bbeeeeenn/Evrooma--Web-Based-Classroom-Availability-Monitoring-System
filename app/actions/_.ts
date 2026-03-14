export interface ServerActionResponse {
    status: "success" | "error" | "initial";
    message: string;
}

export interface LoginFormActionResponse extends ServerActionResponse {
    formData: FormData;
    user: string | null;
}
