import { Router } from "express";
import { JwtPayload } from "jsonwebtoken";

import { DB } from "../utils/db";
import { authMiddleware } from "../middleware/auth";
import { AuthRequest } from "../types/custom-request";

export const workoutPlanRouter = Router();

workoutPlanRouter.use(authMiddleware);

workoutPlanRouter.post('/', async (req: AuthRequest, res) => {
    try {
        const { user } = req as JwtPayload;
        const { exercises, schedule_time } = req.body;
    
        if(!user) {
            return res.status(402).send({
                response: "Unauthenticated request."
            });
        }
    
        if(!exercises.length || !schedule_time) {
            return res.status(402).send({
                response: "Missing arguments on request."
            });
        }
    
        const db = new DB();
        const id = await db.createNewPlan(user.userId, exercises, schedule_time);

        return res.status(200).send({
            response: id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            response: "Something went wrong"
        });
    }
});

workoutPlanRouter.put('/:planId', async (req: AuthRequest, res) => {
    try {
        const { user } = req as JwtPayload;
        const { planId } = req.params;
        const { new_comment, exercises } = req.body;
    
        if(!user) {
            return res.status(402).send({
                response: "Unauthenticated request."
            });
        }
    
        if(exercises.length === undefined) {
            return res.status(402).send({
                response: "Missing arguments on request."
            });
        }

        const db = new DB();
        await db.updatePlan(exercises, planId);

        if(new_comment) {
            await db.addComment(user.userId, planId, new_comment);
        }

        res.status(200).send({
            response: planId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            response: "Something went wrong"
        });
    }
});

workoutPlanRouter.delete('/:planId', async (req: AuthRequest, res) => {
    try {
        const { user } = req as JwtPayload;
        const { planId } = req.params;
    
        if(!user) {
            return res.status(402).send({
                response: "Unauthenticated request."
            });
        }
    
        if(!planId) {
            return res.status(402).send({
                response: "Missing arguments on request."
            });
        }

        const db = new DB();
        await db.deletePlan(planId);

        res.status(200).send({
            response: planId
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            response: "Something went wrong"
        });
    }
});

workoutPlanRouter.put('/schedule/:planId', async (req: AuthRequest, res) => {
    try {
        const { user } = req as JwtPayload;
        const { planId } = req.params;
        const { schedule_time } = req.body;
    
        if(!user) {
            return res.status(402).send({
                response: "Unauthenticated request."
            });
        }
    
        if(!schedule_time) {
            return res.status(402).send({
                response: "Missing arguments on request."
            });
        }

        const db = new DB();
        await db.schedulePlan(planId, schedule_time);

        res.status(200).send({
            response: planId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            response: "Something went wrong"
        });
    }
});

workoutPlanRouter.get('/', async (req: AuthRequest, res) => {
    try {
        const { user } = req as JwtPayload;
    
        if(!user) {
            return res.status(402).send({
                response: "Unauthenticated request."
            });
        }

        const db = new DB();
        const data = await db.listPlans(user.userId);

        res.status(200).send({
            response: data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            response: "Something went wrong"
        });
    }
});
