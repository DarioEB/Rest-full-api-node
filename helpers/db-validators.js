import Category from '../models/categories.model.js';
import Product from '../models/products.model.js';
import Role from '../models/role.model.js';
import User from '../models/users.model.js';

const validateRole = async (role = '') => {
    const exRole = await Role.findOne({role}); 

    if(!exRole) 
        throw new Error(`El rol ${role} no es reconocido.`);
}

const validateUserByEmail = async (email) => {
    const exEmailUser = await User.findOne({email});

    if(exEmailUser)
        throw new Error(`El email: ${email} ya está registrado.`);
}

const validateUserById = async ( id ) => {
    const exUserId = await User.findById(id);

    if(!exUserId)
        throw new Error(`El id ${id} no existe.`)
}

const validateCategoryById = async (id) => {
    const exCategoryId = await Category.findById(id);

    if(!exCategoryId)
        throw new Error(`El id ${id} no existe.`)
}

const validateProductById = async (id) => {
    const exProductId = await Product.findById(id);

    if(!exProductId)
        throw new Error(`El id ${id} no existe.`)
}

// Validar colecciones permitidas
const allowedCollections = (collection = '', collections = []) => {

    if(!collections.includes(collection)) {
        throw new Error(`La colleción ${collection} no es permitida - ${collections}`);
    }

    return true;
}

export {
    allowedCollections,
    validateCategoryById,
    validateProductById,
    validateUserById,
    validateUserByEmail,
    validateRole,
}