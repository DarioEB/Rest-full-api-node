import { Router } from 'express';
import { check } from 'express-validator';

import { validateFields } from '../middlewares/valid-fields.js';

import {
    googleSignIn,
    login 
} from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validateFields
],login);

router.post('/google', [
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validateFields
], googleSignIn)

export default router;