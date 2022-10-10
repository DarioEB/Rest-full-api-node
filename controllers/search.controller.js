import { response } from 'express';
import { isValidObjectId } from 'mongoose';
// models
import User from '../models/users.model.js';
import Category from '../models/categories.model.js';
import Product from '../models/products.model.js';

const allowedCollections = [
    'users',
    'categories',
    'products',
];

const searchUsers = async (term = '', res = response) => {

    // const isMongoId = ObjectId.isValid(term);
    const isMongoId = isValidObjectId(term);

    if (isMongoId) {
        const user = await User.findById(term);
        return res.json({
            results: (user) ? [user] : []
        });
    }

    const regex = new RegExp(term, 'i');

    const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }],
    });

    res.json({
        results: users
    })
}

const searchCategories = async (term = '', res = response) => {

    // const isMongoId = ObjectId.isValid(term);
    const isMongoId = isValidObjectId(term);

    if (isMongoId) {
        const category = await Category.findById(term);
        return res.json({
            results: (category) ? [category] : []
        });
    }

    const regex = new RegExp(term, 'i');

    const categories = await Category.find({ name: regex, status: true });

    res.json({
        results: categories
    })
}

const searchProducts = async (term = '', res = response) => {

    // const isMongoId = ObjectId.isValid(term);
    const isMongoId = isValidObjectId(term);

    if (isMongoId) {
        const product = await Product.findById(term)
                                .populate('user', 'name')
                                .populate('category', 'name')
        return res.json({
            results: (product) ? [product] : []
        });
    }

    const regex = new RegExp(term, 'i');

    const products = await Product.find({
            $or: [{ name: regex }, { description: regex }],
            $and: [{ status: true }],
        })
        .populate('user', 'name')
        .populate('category', 'name')

    res.json({
        results: products
    })
}

const search = async (req, res = response) => {

    const { collection, term } = req.params;

    console.log(req.params)

    if (!allowedCollections.includes(collection)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${allowedCollections}`
        });
    }

    switch (collection) {
        case 'users':
            searchUsers(term, res);
            break;

        case 'categories':
            searchCategories(term, res);
            break;

        case 'products':
            searchProducts(term, res);
            break;

        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta búsqueda'
            })
    }
}

export {
    search,
}