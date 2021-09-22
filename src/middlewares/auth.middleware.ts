import { config } from "dotenv";
import { Request } from "express";
import jwt from "express-jwt";

config();

// fuente: 
// https://www.youtube.com/watch?v=uSh5YRpqHog
// https://www.youtube.com/watch?v=qVUr4YC6ZXA
// https://javascript.plainenglish.io/creating-a-rest-api-with-jwt-authentication-and-role-based-authorization-using-typescript-fbfa3cab22a4


export const AuthMiddleware = jwt({
    algorithms: ['HS256'],
    secret: process.env.JWT_SECRET,
    credentialsRequired: true,
    userProperty: 'payload',
    getToken: (req: Request) => {

        let token = req.headers.authorization?.split(" ")[1] || req.query?.token || req.cookies?.token;

        if (token) return token;
        // If we return null, we couldn't find a token.
        // In this case, the JWT middleware will return a 401 (unauthorized) to the client for this request
        return null;
    }
});