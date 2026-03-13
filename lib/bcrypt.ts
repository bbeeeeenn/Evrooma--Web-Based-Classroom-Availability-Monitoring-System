import bcrypt from "bcrypt";

export const encrypt = async (data: string): Promise<string> =>
    bcrypt.hash(data, 10);

export const compare = async (
    data: string,
    encryptedData: string,
): Promise<boolean> => bcrypt.compare(data, encryptedData);
