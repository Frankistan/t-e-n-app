import nodemailer, { Transporter } from "nodemailer";
import SMTPConnection from "nodemailer/lib/smtp-connection";
import { IMessage, ISendEmail } from "../interfaces/nodemailer.interfaces";

export class NodemailerProvider implements ISendEmail {

    private readonly transporter: Transporter;

    constructor() {

        const SMTPConnectionOptions: SMTPConnection.Options = {
            host: process.env.MAIL_HOST,
            port: +process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        };

        this.transporter = nodemailer.createTransport(SMTPConnectionOptions);
    }

    async sendEmail(message: IMessage): Promise<void> {

        await this.transporter.sendMail({
            from: {
                name: message.from.name,
                address: message.from.email
            },
            to: {
                name: message.to.name,
                address: message.to.email
            },
            subject: message.subject,
            html: message.body
        });

    }
}
