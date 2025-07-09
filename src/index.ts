import express from "express";
import dotenv from "dotenv";

import { authRouter } from "./routes/auth";

import { DB } from "./utils/db";

dotenv.config(); 
const app = express();
const db = new DB();

app.use(express.json());
(async () => {
    await db.initDatabase();
})();

app.use('/auth', authRouter);

app.listen(3000, () => {
    console.log("Listening on port 3000...");
});
