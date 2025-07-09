import mysql from 'mysql2/promise';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { User } from '../types/data';

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
}
