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
    validateProductById,
} from '../helpers/db-validators.js';

/* Controllers */
import {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct
} from '../controllers/products.controller.js';

const router = Router();

/*
*   {{url}}/api/products
*/
router.get('/', getProducts)

router.get('/:id',[
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( validateProductById ),
    validateFields,
], getProduct)

router.post('/',[
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'La categoría es obligatoria').not().isEmpty(),
    check('category', 'No es una categoría válida').isMongoId(),
    check('category').custom( validateCategoryById ),
    validateFields,
], createProduct)

router.put('/:id',[
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(validateProductById),
    validateFields,
], updateProduct)

router.delete('/:id',[
    validateJWT,
    validateAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( validateProductById ),
    validateFields
], deleteProduct)


export default router;