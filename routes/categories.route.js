import { Router } from 'express';
import { check } from 'express-validator';

/* Middlewares y helpers */
import { 
    validateJWT, 
    validateFields,
    validateAdminRole,
} from '../middlewares/index.js'

import {
    validateCategoryById,
} from '../helpers/db-validators.js';

/* Controllers */
import {
    createCategory,
    deleteCategory,
    getCategory,
    getCategories,
    updateCategory
} from '../controllers/categories.controller.js';

const router = Router();

/*
*   {{url}}/api/categories
*/
router.get('/', getCategories)

router.get('/:id',[
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( validateCategoryById ),
    validateFields,
],getCategory)

router.post('/',[
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFields,
],createCategory)

router.put('/:id',[
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( validateCategoryById ),
    validateFields,
],updateCategory)

router.delete('/:id',[
    validateJWT,
    validateAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( validateCategoryById ),
    validateFields
],deleteCategory)


export default router;