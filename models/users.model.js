import { Schema, model } from 'mongoose';

const userSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        requried: [true, 'El email es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatorio']
    },
    img: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    }
});

userSchema.methods.toJSON = function() { /* Modifica los campos que devuelve en la petición */
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

const User = model('User', userSchema);

export default User;

