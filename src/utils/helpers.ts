import del from "del";

const cleanFolder = function (
    folderPath: string = "" + process.env.APP_UPLOADS_PATH
) {
    // delete files inside folder but not the folder itself
    del.sync([`${folderPath}/**`, `!${folderPath}`]);
};


export { cleanFolder }
