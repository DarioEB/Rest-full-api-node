import { Schema, model } from 'mongoose';

const categorySchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

categorySchema.methods.toJSON = function() { /* Modifica los campos que devuelve en la petición */
    const { __v, status, ...category } = this.toObject();
    return category;
}

const Category = model('Category', categorySchema);

export default Category;