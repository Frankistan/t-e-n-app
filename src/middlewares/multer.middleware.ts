import multer from "multer";
import fsx from "fs-extra-promise";
import { Request } from "express";

const Storage = multer.diskStorage({
    destination: function (
        req: Express.Request,
        file: Express.Multer.File,
        callback
    ) {
        let path = process.env.APP_UPLOADS_PATH;

        async (path: string) => {

            try {

                await fsx.ensureDir(path);
                console.log("success!");

            } catch (error) {
                console.error(error);

            }
        };
        callback(null, path);
    },
    filename: function (
        req: Express.Request,
        file: Express.Multer.File,
        callback
    ) {
        callback(null, Date.now() + "-" + file.originalname);
    }
});

const imageFilter = (req: Request, file: Express.Multer.File, cb: any) => {
    if (!file.originalname.match(/\.(JPG|jpg|jpeg|PNG|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var MulterMiddleware = multer({
    storage: Storage,
    fileFilter: imageFilter,
});

export default MulterMiddleware;
