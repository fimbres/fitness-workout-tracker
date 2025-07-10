import jwt from "jsonwebtoken";

export const createToken = (username: string, userId: string) => {
    const payload = {
        userId,
        username,
    }

    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '24h'
    });
};

export const verify = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET!);
}
