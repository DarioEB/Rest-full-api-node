import cors from 'cors';
import express from 'express';
import colors from 'colors';
import fileUpload from 'express-fileupload';

import auth from '../routes/auth.route.js';
import users from '../routes/users.route.js';
import categories from '../routes/categories.route.js';
import products from '../routes/products.route.js';
import search from '../routes/search.route.js';
import uploads from '../routes/uploads.route.js';

import { dbConnection } from '../database/config.js';

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        // paths
        this.paths = {
            auth:       '/api/auth',
            categories: '/api/categories',
            products:   '/api/products',
            search:     '/api/search',
            users:      '/api/users',
            uploads:    '/api/uploads',
        }
        // Conectar a base de datos
        this.dbConnect();
        // Middlewares
        this.middlewares();
        // Rutas de mi aplicación
        this.routes();
    }

    async dbConnect() {
        await dbConnection();
    }

    middlewares() {
        /* cors */
        this.app.use( cors() );
        /* Parse y lectura del body */
        this.app.use( express.json() );
        /* Directorio publico */
        this.app.use( express.static('public'));
        /* Configuración del FileUpload o carga de archivos */
        this.app.use( fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true, /* Crear el directorio si no encuentra */
        }))
    }

    routes() {
        this.app.use(this.paths.auth,       auth);
        this.app.use(this.paths.categories, categories);
        this.app.use(this.paths.users,      users);
        this.app.use(this.paths.products,   products);
        this.app.use(this.paths.search,     search);
        this.app.use(this.paths.uploads,      uploads)
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`.blue);
        })
    }

}

export default Server;