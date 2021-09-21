import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { UserEntity } from "../entity/user.entity";

export class UserController {

    private userRepository = getRepository(UserEntity);

    async index(request: Request, response: Response, next: NextFunction) {
        const users: UserEntity[] = await this.userRepository.find();
        response.json(users);
    }

    async create(request: Request, response: Response, next: NextFunction) {
        const { username, email, password, role, avatar } = request.body;

        let user: UserEntity = new UserEntity();

        user.username = username;
        user.email = email;
        user.password = password;
        user.role = role;
        user.avatar = avatar;
        user.hashPassword();

        try {
            await this.userRepository.save(user);

            response.json(user);

        } catch (error) {
            response.json({ error });
        }
    }

    async read(request: Request, response: Response, next: NextFunction) {

        try {
            const user: UserEntity = await this.userRepository.findOneOrFail(request.params.id);
            response.json(user);
        } catch (error) {
            response.json({ error });
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {
        try {

            let user: UserEntity = await this.userRepository.findOneOrFail(request.params.id);

            try {
                const { username, email, password, role, avatar } = request.body;

                user.avatar = avatar;
                user.role = role;
                user.username = username;
                user.updatedAt = new Date();

                await this.userRepository.save(user);

                response.status(200).json({ message: "UserEntity UPDATED successfully!!", user });
            } catch (error) {
                response.json({ error });
            }

        } catch (error) {
            response.json({ error });
        }
    }

    async delete(request: Request, response: Response, next: NextFunction) {

        try {
            let user: UserEntity = await this.userRepository.findOneOrFail(request.params.id);

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