import { NextFunction, Request, Response } from "express";

export class IndexController {
    home(request: Request, response: Response, next: NextFunction) {
        response.sendFile("index.html");
    }
}