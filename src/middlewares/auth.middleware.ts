import { config } from "dotenv";
import { Request } from "express";
import jwt from "express-jwt";

config();

export const AuthMiddleware = jwt({
    algorithms: ['HS256'],
    secret: process.env.JWT_SECRET,
    credentialsRequired: true,
    getToken: (req: Request) => {

        if (
            req.headers.authorization &&
            req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
            // Authorization: Bearer xxxxxxxxxxxxxx
            // Handle token presented as a Bearer token in the Authorization header
            req.query.token = req.headers.authorization.split(" ")[1];
            return req.headers.authorization.split(" ")[1];
        } else if (req.query && req.query.token) {
            // Handle token presented as URI param
            return req.query.token;
        } else if (req.cookies && req.cookies.token) {
            // Handle token presented as a cookie parameter
            return req.cookies.token;
        }
        // If we return null, we couldn't find a token.
        // In this case, the JWT middleware will return a 401 (unauthorized) to the client for this request
        return null;
    }
});
