import { Router } from 'express';
import { check } from 'express-validator';

import { validateFields } from '../middlewares/valid-fields.js';
import { validateFile } from '../middlewares/validate-file.js';
import { allowedCollections } from '../helpers/db-validators.js';

import {
    getFile,
    updateUploadFile,
    updateUploadFileCloudinary,
    uploadFile
} from '../controllers/uploads.controller.js';

const router = Router();

router.post('/', validateFile, uploadFile);

router.put('/:collection/:id', [
    validateFile,
    check('id', 'El id no es válido').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validateFields,
// ], updateUploadFile);
], updateUploadFileCloudinary);

router.get('/:collection/:id', [
    check('id', 'El id no es válido').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validateFields,
], getFile);



export default router;