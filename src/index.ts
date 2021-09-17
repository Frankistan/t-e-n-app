import "reflect-metadata";
import express, { Application, Request, Response, NextFunction } from "express";
import { Connection, createConnection, getConnectionOptions } from "typeorm";
import { Routes } from "./routes";
import { User } from "./entity/User";
import { config } from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { Server } from "http";

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
        connectionOptions.entities = [User];

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
        await connection.manager.save(connection.manager.create(User, {
            firstName: "Timber",
            lastName: "Saw",
            age: 27
        }));

        await connection.manager.save(connection.manager.create(User, {
            firstName: "Phantom",
            lastName: "Assassin",
            age: 24
        }));
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

