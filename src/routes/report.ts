import { Router } from "express";
import { JwtPayload } from "jsonwebtoken";

import { DB } from "../utils/db";
import { authMiddleware } from "../middleware/auth";
import { AuthRequest } from "../types/custom-request";

export const reportRouter = Router();

reportRouter.use(authMiddleware);

reportRouter.get('/', async (req: AuthRequest, res) => {
    try {
        const { user } = req as JwtPayload;
    
        if(!user) {
            return res.status(402).send({
                response: "Unauthenticated request."
            });
        }
    
        const db = new DB();
        const data = await db.getReport(user.userId);
        const finishedCount = data.reduce((a, v) => v.status === 'done' ? a + 1 : a, 0);
    
        return res.status(200).send({
            response: {
                progress: `${data.length === 0 ? 0 : Math.floor((finishedCount / data.length) * 100)}%`,
                finished: finishedCount,
                pending: data.length - finishedCount,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            response: "Something went wrong"
        });
    }
});
