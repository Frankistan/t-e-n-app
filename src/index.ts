import "reflect-metadata";
import express, { Application, Request, Response, NextFunction } from "express";
import { Connection, createConnection, getConnectionOptions } from "typeorm";
import { Routes } from "./routes";
import { UserEntity } from "./entity/user.entity";
import { config } from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { Server } from "http";
import { PostEntity } from "./entity/post.entity";
import validationMiddleware from "./middlewares/validation.middleware";
import { AuthMiddleware } from "./middlewares/auth.middleware";

config();

class App {

    private app: Application;

    constructor(private port?: number | string) {

        this.app = express();

        this.config();

        this.connect();

        this.preMiddlawares();
        this.routes();
        this.postMiddlewares();

    }

    private config(): void {
        this.app.set("port", this.port || process.env.PORT || 3000);
    }

    private async connect() {

        let connectionOptions: any = await getConnectionOptions();

        // AÑADIR AQUI TODAS LAS CLASES DE TIPO ENTITY DEL DIRECTORIO ./src/entity/*.ts
        connectionOptions.entities = [UserEntity, PostEntity];

        try {
            const connection: Connection = await createConnection(connectionOptions);

            // this.inserDummyData(connection);

        } catch (error) {
            console.log(error);
        }
    }

    private preMiddlawares() {
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.json());
        this.app.use(morgan("dev"));

        // IMPORTANTE PARA LEER LAS IMAGENES SUBIDAS
        this.app.use(express.static(process.env.APP_UPLOADS_PATH));

        this.app.use(
            cors({
                origin: "*",
                optionsSuccessStatus: 200
            })
        );

        this.app.use(
            AuthMiddleware.unless({
                path: [
                    "/",
                    "/auth/login",
                    "/auth/signup",
                    "/upload/multiple",
                    "/upload/show",
                    { url: /^\/auth\/verify\/.*/, methods: ['GET'] }, //route with params

                ]
            })
        );

        this.app.use("/auth/login", validationMiddleware(UserEntity, true));
        this.app.use("/auth/signup", validationMiddleware(UserEntity, true));
    }

    private routes() {

        Routes.forEach(route => {
            (this.app as any)[route.method](route.route, (req: Request, res: Response, next: NextFunction) => {
                const result = (new (route.controller as any))[route.action](req, res, next);
                if (result instanceof Promise) {
                    result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

                } else if (result !== null && result !== undefined) {
                    res.json(result);
                }
            });
        });
    }

    private postMiddlewares() {

    }

    private async inserDummyData(connection: any) {

        // insert new users for test
        let user: UserEntity = new UserEntity();

        user.username = "Fran";
        user.email = "fran@gmail.com";
        user.password = "123456";
        user.avatar = "https://phantom-marca.unidadeditorial.es/0215aae8d4e66ead5eafa06462632d64/crop/48x0/670x350/resize/660/f/webp/assets/multimedia/imagenes/2021/02/23/16140832349541.jpg";

        user.hashPassword();

        await connection.manager.save(connection.manager.create(UserEntity, user));

        // await connection.manager.save(connection.manager.create(UserEntity, {
        //     email: "Phantom",
        //     username: "Assassin",
        //     password: 654321,
        //     avatar: "https://lh3.googleusercontent.com/9FHOk79iiGEisBJxkU9smRi8CUKagEkt_yl7T7z9mEBHypSg5sblsGkv1YOxj-4vCpVbYUeo7dC6q2rxiHn9fNlcBxXGabLd7RpsNC6MHrwCRw=e365-w567"
        // }));
    }

    run(): Server {
        return this.app.listen(this.app.get("port"), () => {

            console.info(
                `Express server has started on port ${this.app.get("port")} in ${process.env.NODE_ENV} mode.`
            );

            console.info(
                `Open http://localhost:${this.app.get("port")}/users to see results`
            );

        });
    }
}

const app = new App();
app.run();

