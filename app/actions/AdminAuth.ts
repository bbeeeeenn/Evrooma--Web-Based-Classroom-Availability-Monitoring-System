import { ServerActionResponse } from "./_";

interface AdminAuthResponse extends ServerActionResponse {
    formData: FormData;
}

export type AdminAuthAction = (
    _: unknown,
    formData: FormData,
) => Promise<AdminAuthResponse>;

export async function AdminAuth(
    _: unknown,
    formData: FormData,
): Promise<AdminAuthResponse> {
    "use server";
    console.log(formData);
    await new Promise((res) => setTimeout(res, 1000));
    const username = formData.get("username") as string;
    // const password = formData.get("password") as string;

    return {
        status: "error",
        message: `Hi ${username}, this is an error message`,
        formData,
    };
}
