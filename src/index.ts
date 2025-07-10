import express from "express";
import dotenv from "dotenv";

import { authRouter } from "./routes/auth";
import { workoutPlanRouter } from "./routes/workout-plan";

import { DB } from "./utils/db";

dotenv.config(); 
const app = express();
const db = new DB();

app.use(express.json());
(async () => {
    await db.initDatabase();
})();

app.use('/auth', authRouter);
app.use('/workout-plan', workoutPlanRouter);

app.listen(3000, () => {
    console.log("Listening on port 3000...");
});
