import path from 'path';
import { fileURLToPath } from 'url';
import { v4 } from 'uuid';

const __dirname = path.dirname( fileURLToPath(import.meta.url) );

const uploadFile = ( files, allowedExt = ['png', 'jpg', 'jpeg', 'gif'], folder) => {

    return new Promise((resolve, reject) => {
        const { file } = files;

        const nameSplit = file.name.split('.');
        const ext = nameSplit[nameSplit.length - 1];

        /* Validar extensión */
        if (!allowedExt.includes(ext)) {
            return reject(`La extensión ${ext} no es permitida - ${allowedExt}`);
        }

        const tempName = v4() + '.' + ext;
        const uploadPath = path.join(__dirname, '../uploads/', folder, tempName);

        file.mv(uploadPath, (error) => {
            if (error) {
                reject(error);
            }

            resolve( tempName );
        });
    })
}

export {
    uploadFile
}