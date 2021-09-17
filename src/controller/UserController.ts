import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";

export class UserController {

    private userRepository = getRepository(User);

    async index(request: Request, response: Response, next: NextFunction) {
        const users: User[] = await this.userRepository.find();
        response.json(users);
    }

    async create(request: Request, response: Response, next: NextFunction) {
        const { firstName, lastName, age } = request.body;

        let user: User = new User();

        user = {
            ...user,
            ...{ firstName, lastName, age } // updated fields
        };

        try {
            await this.userRepository.save(user);

            response.json(user);

        } catch (error) {
            response.json({ error });
        }
    }

    async read(request: Request, response: Response, next: NextFunction) {

        try {
            const user: User = await this.userRepository.findOneOrFail(request.params.id);
            response.json(user);
        } catch (error) {
            response.json({ error });
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {

        try {

            let user: User = await this.userRepository.findOneOrFail(req.params.id);

            try {
                const { firstName, lastName, age } = req.body;

                user = {
                    ...user,
                    ...{ firstName, lastName, age } // updated fields
                };

                await this.userRepository.save(user);

                res.status(200).json({ message: "UserEntity UPDATED successfully!!", user });
            } catch (error) {
                res.json({ error });
            }

        } catch (error) {
            res.json({ error });
        }
    }

    async delete(request: Request, response: Response, next: NextFunction) {

        try {
            let user: User = await this.userRepository.findOneOrFail(request.params.id);

            try {

                await this.userRepository.remove(user);
                response.status(200).json({ message: "UserEntity DELETED successfully!!" });

            } catch (error) {
                response.json({ error });
            }

        } catch (error) {
            response.json({ error });
        }
    }
}