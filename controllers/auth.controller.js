import bcryptjs from 'bcryptjs'
import { response } from 'express'

import User from '../models/users.model.js';

import * as jwt from '../helpers/jwt.js';
import { googleVerify } from '../helpers/google-verify.js';

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({
                msg: 'Usuario y/o Password no son correctos'
            });
        }

        if(!user.status) {
            return res.status(400).json({
                msg: 'Usuario y/o Password no son correctos'
            });
        }

        if(!bcryptjs.compareSync(password, user.password)) {
            return res.status(400).json({
                msg: 'Usuario y/o Password no son correctos'
            });
        }

        const token = await jwt.signJwt( user._id );

        res.json({
            user,
            token,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Internal server error'
        })
    }
}

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;

    // console.log(id_token);

    try {
        const { name, picture: img , email } = await googleVerify(id_token);

        let user = await User.findOne({ email });

        if( !user ) {
            const data = {
                name,
                email,
                password: '12345678',
                img,
                google: true
            }

            user = new User(data);

            await user.save();
        }

        /* Si el usuario en DB */
        if( !user.status ) {
            return res.status(401).json({
                msg: 'Unauthorized - User not active'
            });
        }

        const token = await jwt.signJwt( user._id );

        res.json({
            user,
            token,
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Bad request - Account not verify'
        })
    }
}

export {
    googleSignIn,
    login,
}