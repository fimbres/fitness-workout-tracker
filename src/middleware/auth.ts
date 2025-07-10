import { Response, NextFunction } from "express"

import { verify } from "../utils/jwt";
import { AuthRequest } from "../types/custom-request";

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if(!token) {
        return res.status(402).send({
            response: "You must login before requesting this resource."
        });
    }

    const decoded = verify(token);

    if(!decoded) {
        return res.status(402).send({
            response: "You must login before requesting this resource."
        });
    }

    req.user = decoded;
    next();
}
