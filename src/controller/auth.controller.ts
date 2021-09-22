import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { UserEntity } from "../entity/user.entity";
import { NodemailerProvider } from "../providers/nodemailer";
import jwt from "jsonwebtoken";

export class AuthController {

    private userRepository = getRepository(UserEntity);

    constructor(private nodemailerProvider: NodemailerProvider) {
        this.nodemailerProvider = new NodemailerProvider();
    }

    async login(request: Request, response: Response, next: NextFunction) {
        const { email, password } = request.body;

        try {
            const user: UserEntity = await this.userRepository.findOneOrFail({ where: { email } });

            const match = user.checkPassword(password);

            if (!match) {
                response.status(404).json({ message: "Authentication error: password dont match" });
            } else {

                try {

                    const token = this.createToken({ user }, "1h", process.env.JWT_SECRET);

                    response
                        .status(200)
                        .header({ Authorization: "Bearer " + token })
                        .json({ token });
                } catch (error) {
                    response.status(500).json({ error });
                }
            }
        } catch (error) {

            response.json({ error });
        }

    }

    async signup(request: Request, response: Response, next: NextFunction) {

        const { email, password, username, avatar, role } = request.body;

        const result = await this.userRepository.findOne({ where: { email } });

        if (result != undefined || result != null) {

            response.status(404).json({ message: "User email already exists!" });

        } else {

            let user: UserEntity = new UserEntity();

            user.username = username;
            user.email = email;
            user.password = password;
            user.avatar = avatar;
            user.role = role;

            user.hashPassword();

            try {
                await this.userRepository.save(user);

                this.sendAccountVerificationEmail(request, response, user);

            } catch (error) {
                response.json({ message: "userRepository error on saving", error });
            }
        }
    }

    async verify(request: Request, response: Response, next: NextFunction) {
        const { signature } = request.params;

        if (!signature) response.status(500).json({ message: "Email verification token is missing" });

        try {

            let decodedSignature: any = jwt.verify(signature, process.env.MAIL_VERIFICATION_TOKEN);

            try {

                const user = await this.userRepository.update({ id: decodedSignature.user.id }, { emailVerified: true });
                response.json({ message: "Email verified!" });

            } catch (error) {
                response.status(500).json({ message: "Error on updating user ", error });
            }
        } catch (error) {
            response.status(500).json({ message: "error verifying email token ", error });
        }
    }

    async recover(request: Request, response: Response, next: NextFunction) {

        response.json({});
    }

    private createToken(payload: Object, expiresIn: string, secret: string): String {

        const options: jwt.SignOptions = { expiresIn: expiresIn, algorithm: "HS256" };

        return jwt.sign(payload, secret, options);
    }

    private async sendAccountVerificationEmail(request: Request, response: Response, user: UserEntity) {

        const token = this.createToken({ user }, "20m", process.env.MAIL_VERIFICATION_TOKEN);

        try {

            await this.nodemailerProvider.sendEmail({
                to: {
                    name: user.username,
                    email: user.email
                },
                from: {
                    name: process.env.NODEMAILER_FROM_NAME,
                    email: process.env.NODEMAILER_FROM_EMAIL
                },
                subject: "Account Activation",
                body:
                    `
                <h2> Please the link to activate your account</h2>
                <a href="http://${request.headers.host}/auth/verify/${token}">Verify Account</a>
                `
            });

            response.json({
                message: "We have sent to you an email to verify your account. Check your inbox",
                success: "User registered!"
            });

        } catch (error) {
            console.log("error on sending email: ", error);

            response.status(500).json({ message: "error on sending email", error });
        }

        // console.log(`http://${request.headers.host}/auth/verify/${token}`);

    }
}