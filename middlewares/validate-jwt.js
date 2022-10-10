import { response, request } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/users.model.js';

const validateJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');
    // req.header('Bearer Token'); 
    if (!token) {
        return res.status(401).json({
            msg: 'Unauthorized - No token in request'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                msg: 'Unauthorized - User undefined'
            });
        }

        if (!user.status) {
            return res.status(401).json({
                msg: 'Unauthorized - Inactive User'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Unauthorized - Invalid token'
        })
    }
}

export {
    validateJWT
}