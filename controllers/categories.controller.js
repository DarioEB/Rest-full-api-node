import { response } from 'express';
/* Models */
import Category from '../models/categories.model.js';


const getCategories = async (req, res = response) => {

    const { limit = 5, offset = 0 } = req.query;
    const queryStatus = { status: true };

    const [total, categories] = await Promise.all([
        Category.countDocuments(queryStatus),
        Category.find(queryStatus)
            .populate('user', 'name')
            .skip(Number(offset))
            .limit(Number(limit))
    ])

    res.json({
        total,
        categories,
    })
}

const getCategory = async (req, res = response) => {
    const { id } = req.params;

    const category = await Category.findById(id).populate('user', 'name');

    res.json(category)
}

/* Usuarios con cualquier tipo de rol */
const createCategory = async (req, res = response) => {

    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name });

    if (categoryDB) {
        return res.status(400).json({
            msg: `Bad request - La categoría ${name} ya existe`
        })
    }

    /* data a guardar */
    const data = {
        name,
        user: req.user._id, /* El req.user se obtiene de la validación del token */
    }

    const category = new Category(data);

    await category.save();

    return res.status(201).json({
        msg: 'Categoría creada correctamente',
        category,
    })
}

/* Solo usuarios con rol ADMIN_ROLE */
const updateCategory = async (req, res = response) => {
    const { id } = req.params;
    const { status, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    /** Actualizo el usuario con el 
     * id del usuario que los está actualizado 
     * */
    data.user = req.user._id;

    /** El { new: true} manda el objeto actualizao */
    const category = await Category.findByIdAndUpdate(id, data, {new: true}).populate('user', 'name');

    res.json({
        msg: 'Categoría actualizada correctamente',
        category,
    })
}

/* Solo usuarios con rol ADMIN_ROLE */
const deleteCategory = async (req, res = response) => {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, { status: false}, { new: true });

    res.json({
        msg: 'Categoría eliminada correctamente',
        category,
    });
}


export {
    createCategory,
    deleteCategory,
    getCategory,
    getCategories,
    updateCategory,
}
