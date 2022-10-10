import { Schema, model } from 'mongoose';

const roleSchema = Schema({
    role: {
        type: String,
        required: [
            true,
            'El Rol es obligatorio'
        ]
    }
})

const Role = model('Role', roleSchema);

export default Role;