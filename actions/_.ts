export interface ServerActionResponse {
    status: "success" | "error" | "initial";
    message: string;
}

export interface FormActionResponse extends ServerActionResponse {
    formData: FormData;
}
