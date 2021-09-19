import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, RequestHandler, Response, Request } from 'express';


function validationMiddleware<T>(type: any, skipMissingProperties = false): RequestHandler {

    return async (req: Request, res: Response, next: NextFunction) => {

        const errors: ValidationError[] = await validate(plainToClass(type, req.body), { skipMissingProperties, validationError: { target: false, value: false } });

        const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');

        if (errors.length > 0) return res.status(401).json(message);

        next();

    }
}

export default validationMiddleware;