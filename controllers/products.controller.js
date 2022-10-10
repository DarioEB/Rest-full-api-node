import { response } from 'express';
/* Models */
import Product from '../models/products.model.js';


const getProducts = async (req, res = response) => {

    const { limit = 5, offset = 0 } = req.query;
    const queryStatus = { status: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(queryStatus),
        Product.find(queryStatus)
            .populate('user', 'name')
            .populate('category', 'name')
            .skip(Number(offset))
            .limit(Number(limit))
    ])

    res.json({
        total,
        products,
    })
}

const getProduct = async (req, res = response) => {
    const { id } = req.params;

    const product = await Product.findById(id)
        .populate('user', 'name')
        .populate('category', 'name')

    res.json(product)
}

/* Usuarios con cualquier tipo de rol */
const createProduct = async (req, res = response) => {

    const { price, category, description } = req.body;

    const name = req.body.name.toUpperCase();

    const productDB = await Product.findOne({ name });

    if (productDB) {
        return res.status(400).json({
            msg: `Bad request - El producto ${name} ya existe`
        })
    }

    /* data a guardar */
    const data = {
        name,
        user: req.user._id, /* El req.user se obtiene de la validación del token */
        price,
        category,
        description,
    }

    const product = new Product(data);

    await product.save();

    return res.status(201).json({
        msg: 'Producto creado correctamente',
        product,
    })
}

/* Solo usuarios con rol ADMIN_ROLE */
const updateProduct = async (req, res = response) => {
    const { id } = req.params;
    const { status, user, ...productData } = req.body;

    if(productData.name) {
        productData.name = productData.name.toUpperCase();
    }
    /** Actualizo el usuario con el
     * id del usuario que los está actualizado
     * */
    productData.user = req.user._id;

    /** El { new: true} manda el objeto actualizao */
    const product = await Product.findByIdAndUpdate(id, productData, { new: true })

    res.json({
        msg: 'Producto actualizado correctamente',
        product,
    })
}

/* Solo usuarios con rol ADMIN_ROLE */
const deleteProduct = async (req, res = response) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { status: false }, { new: true });

    res.json({
        msg: 'Producto eliminado correctamente',
        product,
    });
}


export {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct,
}
