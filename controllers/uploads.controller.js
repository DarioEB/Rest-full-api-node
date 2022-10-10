import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { response } from 'express'

import { v2 } from 'cloudinary'

import User from '../models/users.model.js';
import Product from '../models/products.model.js';

import { uploadFile as uploadFileHelper } from '../helpers/upload-file.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const uploadFile = async (req, res = response) => {
    try {
        const pathFile = await uploadFileHelper(req.files, undefined, 'images');

        res.json({
            path: pathFile,
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: error
        })
    }
}

/* Actualizar imagen de colección */
const updateUploadFile = async (req, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' })
    }

    // Limpiar imagenes previas 
    if (model.img) {
        const oldPathFile = path.join(__dirname, '../uploads/', collection, model.img);
        if (fs.existsSync(oldPathFile)) {
            fs.unlinkSync(oldPathFile);
        }
    }

    const pathFile = await uploadFileHelper(req.files, undefined, collection);
    model.img = pathFile;

    await model.save();

    res.json(model);
}

const getFile = async (req, res = response) => {

    const { id, collection } = req.params;

    let model;


    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: 'No existe la imagen'
                })
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: 'No existe la imagen'
                })
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' })
    }

    // Limpiar imagenes previas 
    if (model.img) {
        const pathFile = path.join(__dirname, '../uploads/', collection, model.img);
        if (fs.existsSync(pathFile)) {
            res.sendFile(pathFile);
        }
    }

    const noImagePath = path.join(__dirname, '../assets/no-image.jpg');
    return res.status(200).sendFile(noImagePath);
}

const updateUploadFileCloudinary = async (req, res = response ) => {

    const { id, collection } = req.params;

    let model;

    switch( collection)  {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
    }

    v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    if( model.img ) {
        const fSplit = model.img.split('/');
        const filename = fSplit[ fSplit.length - 1];
        const [ publicId ] = filename.split('.');
        await v2.uploader.destroy( publicId );
    }

    try {
        const { tempFilePath } = req.files.file;
        const { secure_url: secureUrl } = await v2.uploader.upload( tempFilePath );
        model.img = secureUrl;
        await model.save();
        res.json( model );
    } catch (error) {
        console.log(error);
    }
}

export {
    getFile,
    updateUploadFile,
    updateUploadFileCloudinary,
    uploadFile,
}