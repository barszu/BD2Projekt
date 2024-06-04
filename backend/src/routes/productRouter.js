import express from "express";
import {Product} from "../models/productSchema.js";

//TODO autenticate the access wia req.header 'app-auth-token'
import validateBodyJsonSchema from "../middleware/structureValidatorMiddleware.js";



const router = express.Router()


/**
 * Endpoint for getting all products data
 * @route GET /all
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * data can be projected by passing projection object in body eq:
 * @example
 * body.projection = {
 *     "name":1,
 *     "quantity":1,
 *     "price":1,
 *     "productDetails":1,
 * }
 */
router.get('/list', async (req, res) => {
    const projection = req.body.projection || {}
    const filter = req.body.filter || {}
    try {
        const products = await Product.find(filter, projection)
        res.json(products)
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to query from db:' + err.message,
            errors: err
        })
    }
})

/**
 * Endpoint for getting all available products
 * @route GET /available
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * The request body can optionally contain a projection object to specify the fields to be returned in the response.
 * @example
 * req.body.projection = {
 *     "name":1,
 *     "quantity":1,
 *     "price":1,
 *     "productDetails":1,
 * }
 *
 * The endpoint will return only those products where the 'available' field is set to true.
 * If an error occurs while querying the database, a 500 status code is returned along with the error message.
 */
router.get('/available', async (req, res) => {
    const projection = req.body.projection || {}
    try {
        const products = await Product.find({available: true}, projection)
        res.json(products)
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to query from db:' + err.message,
            errors: err
        })
    }
})

/**
 * Endpoint for adding a new product
 * @route POST /add
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * The request body should contain a newProduct object with the following structure:
 * @example
 * req.body.newProduct = {
 *     "name": "Product Name",
 *     "quantity": 10,
 *     "price": 100,
 *     "productDetails": "Product details",
 * }
 *
 * If a product with the same name already exists in the database, a 409 status code is returned.
 * If the product is successfully saved, a success message is returned along with the product name.
 * If an error occurs while saving the product, a 500 status code is returned along with the error message.
 */
router.post('/add', validateBodyJsonSchema("newProduct" , Product ) ,async (req, res) => {
    const reqProduct = req.body.newProduct
    try {
        const isAlreadyInDB = await Product.findOne({name: reqProduct.name})
        if (isAlreadyInDB) {
            res.status(409).json({
                success: false,
                message: 'Product already in DB with that name',
                errors: `When trying to add ${reqProduct} found already ${isAlreadyInDB} in DB`
            })
            return
        }

        const product = new Product(reqProduct)
        await product.save()
        res.json({
            success: true,
            message: 'Product saved',
            name: req.body.name
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to save to db',
            errors: err
        })
    }


})

/**
 * Endpoint for getting a specific product by its id
 * @route GET /get/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * The request parameter should contain the id of the product to be retrieved.
 * @example
 * GET /get/60d5ec9af682fbd39cc1ecd5
 *
 * The request body can optionally contain a projection object to specify the fields to be returned in the response.
 * @example
 * req.body.projection = {
 *     "name":1,
 *     "quantity":1,
 *     "price":1,
 *     "productDetails":1,
 * }
 *
 * If the product is found, it is returned in the response.
 * If the product is not found, a 404 status code is returned.
 * If an error occurs while querying the database, a 500 status code is returned along with the error message.
 */
router.get('/get/:id', async (req, res) => {
    const projection = req.body.projection || {}
    const id = req.params.id
    let product
    try {
        product = await Product.findOne({_id: id}, projection)
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to query from db, db not working or bad projection',
            errors: err
        })
        return
    }

    if (product === null) {
        res.status(404).json({
            success: false,
            message: 'Product not found in DB',
            errors: 'Product with that _id not found in DB'
        })
    }
    else {
        res.json(product)
    }

})

export default router