import { Router } from "express";

import { DB } from "../utils/db";
import { compare, encrypt } from "../utils/encryption";
import { createToken } from "../utils/jwt";

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
    try {
        const { password, username } = req.body;

        if(!password || !username) {
            res.status(402).send({
                response: "Password and username are required."
            });
        }

        const db = new DB();
        const user = await db.getUserByUsername(username);

        if(!user.password) {
            res.status(402).send({
                response: "The user doesn't exists."
            });
        }

        const isValid = await compare(password, user.password);

        if(isValid) {
            return res.status(402).send({
                response: "The password is invalid."
            });
        }
        
        const token = createToken(username, user.id);

        return res.status(200).send({
            response: {
                token
            }
        });
    } catch (error: any) {
        console.log(error)
        res.status(500).send({
            response: error.message ?? "Unkown Error At Login!"
        });
    }
});

authRouter.post('/signup', async (req, res) => {
    try {
        const { password, username } = req.body;
    
        if(!password || !username) {
            res.status(402).send({
                response: "Password and username are required."
            });
        }

        const db = new DB();
        const existingUser = await db.getUserByUsername(username);
        
        if(!!existingUser) {
            res.status(402).send({
                response: "The user already exists."
            });
        }

        const encryptedPassword = await encrypt(password);
        const userId = await db.createNewUser(username, encryptedPassword);
        const token = createToken(username, userId);

        res.status(200).send({
            response: {
                token
            }
        });
    } catch (error: any) {
        res.status(500).send({
            response: error.message ?? "Unkown Error At Signup!"
        });
    }
});
