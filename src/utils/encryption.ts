import bcrypt from "bcryptjs";

export const encrypt = async (text: string) => {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(text, salt);

    return hash;
}

export const compare = async (text: string, encryptedText: string) => {
    return await bcrypt.compare(text, encryptedText);
}
