import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { UserEntity } from "../entity/user.entity";


export class UploadController {

    private userRepository = getRepository(UserEntity);

    async single(request: Request, response: Response, next: NextFunction) {

        const { id } = request.params;

        try {
            const file = request.file;

            if (!file) {
                response.status(400).json({
                    "status": "failed",
                    "code": "400",
                    "message": "Please upload file"
                });
            } else {

                try {

                    let user: UserEntity = await this.userRepository.findOneOrFail(id);

                    user.avatar = request.file.filename;

                    try {
                        await this.userRepository.save(user);

                        var page = "<!doctype html><html><head></head><body>" +
                            "<p>Se subió el archivo correctamente y añadido al usuario registrado:</p>" +
                            "<pre>" + JSON.stringify(user) + "</pre>" +
                            '<p><br><img src="../' + user.avatar + '"  /></p></body></html>';

                        response.status(200).send(page);
                    } catch (error) {

                        response.json({ error });

                    }

                } catch (error) {
                    response.status(400).json({ error });
                }

            }

        } catch (error) {

            response.status(200).json({
                "status": "failed",
                "code": "500",
                "message": error.message
            });
        }

    }

    async multiple(request: Request, response: Response, next: NextFunction) { }


    show(request: Request, response: Response, next: NextFunction) {
        var imagePath = "http://localhost:3000/1629326007132-GRINDR.jpg";

        var page = "<!doctype html><html><head></head><body>" +
            "<p>Se subió el archivo correctamente</p>" +
            '<br><img src="' + imagePath + '"  /></body></html>';
        response.send(page);
    }

}