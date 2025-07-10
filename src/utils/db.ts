import mysql from 'mysql2/promise';
import { readFile } from 'fs/promises';
import { join } from 'path';

import { User, WorkoutPlan } from '../types/data';

const INIT_PATH = join(__dirname, '..', 'migrations/init.sql');
const SEED_PATH = join(__dirname, '..', 'migrations/seed.sql');

export class DB {
    private db: mysql.Pool;

    constructor() {
        this.db = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT || 3306),
            database: process.env.DB_USERNAME,
            multipleStatements: true,
        });
    } 

    async initDatabase() {
        try {
            const initSQL = await readFile(INIT_PATH, 'utf-8');

            await this.db.query(initSQL);
            console.log("Tables created!");

            const seedSQL = await readFile(SEED_PATH, 'utf-8');

            await this.db.query(seedSQL);
            console.log("Tables populated!");
        } catch (error: any) {
            console.error("Something went wrong initializing the tables!", error);
            throw new Error(error.message ?? "Unknown");
        }
    };

    async getUserById(id: string) {
        try {
            const [result] = await this.db.query(`SELECT * FROM Users WHERE id = ?;`, [
                id
            ]);
    
            return (result as unknown as User[])[0];
        } catch (error: any) {
            throw new Error(error.message ?? "Unknown error while fetching user.");
        }
    }

    async getUserByUsername(username: string) {
        try {
            const [result] = await this.db.query(`SELECT * FROM Users WHERE username = ?;`, [
                username
            ]);
            console.log(result)
            return (result as unknown as User[])[0];
        } catch (error: any) {
            throw new Error(error.message ?? "Unknown error while fetching user.");
        }
    }

    async createNewUser(username: string, password: string) {
        try {
            const [result] = await this.db.query(`INSERT INTO Users (username, password) VALUES (?, ?);`, [
                username,
                password
            ]);
            
            return (result as unknown as { insertId: string }).insertId;
        } catch (error: any) {
            throw new Error(error.message ?? "Unkown error while saving the new user.");
        }
    }

    async createNewPlan(user: string, exercises: string[], schedule_time: string) {
        try {
            const [result] = await this.db.query(`INSERT INTO WorkoutPlans (user, schedule_time, status) VALUES (?, ?, ?);`, [
                user,
                schedule_time,
                "pending"
            ]);
            const insertId = (result as unknown as { insertId: string }).insertId;
            
            if(!insertId) throw new Error("Unkown error while saving the new plan."); 
            
            const values = exercises.map(e => [insertId, e]);

            await this.db.query(`INSERT INTO WorkoutPlansExercises (workout_plan_id, exercise_id) VALUES ?`, [
                values
            ]);

            return insertId;
        } catch (error: any) {
            throw new Error(error.message ?? "Unknown error while saving the new plan.");
        }
    }

    async updatePlan(exercises: string[], planId: string) {
        try {
            await this.db.query(`DELETE FROM WorkoutPlansExercises WHERE workout_plan_id = ?`, [
                planId
            ]);

            if(exercises.length > 0) {
                const values = exercises.map(e => [planId, e]);

                await this.db.query(`INSERT INTO WorkoutPlansExercises (workout_plan_id, exercise_id) VALUES ?`, [
                    values
                ]);
            }
        } catch (error: any) {
            throw new Error(error.message ?? "Unknown error while saving the plan.");
        }
    }

    async addComment(user: string, planId: string, content: string) {
        try {
            await this.db.query(`INSERT INTO Comments (user, workout_plan, content) VALUES (?, ?, ?)`, [
                user,
                planId,
                content
            ]);
        } catch (error: any) {
            throw new Error(error.message ?? "Unknown error while saving the comment.");
        }
    }

    async deletePlan(planId: string) {
        try {
            await this.db.query(`DELETE FROM WorkoutPlans WHERE id = ?`, [
                planId
            ]);
        } catch (error: any) {
            throw new Error(error.message ?? "Unknown error while deleting the plan.");
        }
    }

    async schedulePlan(planId: string, scheduleTime: string) {
        try {
            await this.db.query(`UPDATE WorkoutPlans SET schedule_time = ? WHERE id = ?`, [
                scheduleTime,
                planId
            ]);
        } catch (error: any) {
            throw new Error(error.message ?? "Unknown error while scheduling the plan.");
        }
    }

    async listPlans(userId: string) {
        try {
            const [response] = await this.db.query(`SELECT * FROM WorkoutPlans WHERE user = ?`, [
                userId
            ]);

            return (response as WorkoutPlan[]).sort((a, b) => new Date(a.schedule_time).getTime() - new Date(b.schedule_time).getTime());
        } catch (error: any) {
            throw new Error(error.message ?? "Unknown error while fetching plans.");
        }
    }
}
