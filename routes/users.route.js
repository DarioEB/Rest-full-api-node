/* Dependencies */
import { Router } from 'express';
import { check } from 'express-validator';

/* Helpers y middlewares */
import {
    validateFields,
    validateJWT,
    allowedRole,
    validateAdminRole
} from '../middlewares/index.js';

import {
    validateRole,
    validateUserByEmail,
    validateUserById,
} from '../helpers/db-validators.js';

/* Controllers */
import {
    getUsers,
    createUser,
    deleteUser,
    updateUser,
} from '../controllers/users.controller.js';

const router = Router();

router.get('/', getUsers);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom(validateUserByEmail),
    check('password', 'El password debe tener al menos 8 caracteres').isLength({ min: 8 }),
    check('role', 'El rol es obligatorio').not().isEmail(),
    check('role').custom(validateRole),
    validateFields,
], createUser);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(validateUserById),
    check('role').custom(validateRole),
    validateFields,
], updateUser);

router.delete('/:id', [
    validateJWT,
    // validateAdminRole,
    allowedRole('ADMIN_ROLE', 'SALE_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(validateUserById),
    validateFields,
], deleteUser);

export default router;