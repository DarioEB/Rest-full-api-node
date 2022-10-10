import { response } from 'express';
import bcryptjs from 'bcryptjs';
import User from '../models/users.model.js';

const getUsers = async (req, res = response) => {

    const { limit = 10, offset = 0 } = req.query; /* Paginación */

    const queryStatus = { status: true };

    const [ registers, users ] = await Promise.all([
        User.countDocuments(queryStatus),
        User.find(queryStatus)
            .limit(isNaN(limit) ? 10 : Number(limit))
            .skip(isNaN(offset) ? 10 : Number(offset))
    ]);

    res.json({
        registers,
        users,
    })
}

const createUser = async (req, res = response) => { 

    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    const salt = bcryptjs.genSaltSync(10); /* Encriptar password */
    user.password = bcryptjs.hashSync( password, salt );

    await user.save();

    return res.status(201).json(user)
}

const updateUser = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, email, ...user } = req.body;

    /* TODO: validar contra base de datos */
    if(password) {
        const salt = bcryptjs.genSaltSync(20); /* Encriptar password */
        user.password = bcryptjs.hashSync( password, salt );
    }

    const userUpdated = await User.findByIdAndUpdate(id, user, { new: true });

    res.json({user: userUpdated})
}

const deleteUser = async (req, res = response) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { status: false });

    res.json({
        user
    })
}



export {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
}