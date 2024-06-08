import mongoose from "mongoose";
import express from "express";
import {Product} from "../models/productSchema.js";
import {ProductSalesHistory} from "../models/salesHistorySchema.js";

const router = express.Router()

/**
 * Endpoint for getting product and its sales history
 * @route GET /get/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * req.params.id - id of the product
 *
 * req.body.salesProjection - projection for sales history data
 * req.body.salesFilter - filter for sales history data
 * req.body.productProjection - projection for product data
 *
 * res.body = { //success = true
 *     success: true,
 *     message: 'Product and sales history found',
 *     product: { //product data },
 *     salesHistory: [ //array of sales history data ]
 * }
 *
 * res.body = { //success = false
 *     success: false,
 *     message: 'Failed to query from db, db not working or bad projection',
 *     errors: '...'
 * }
 */
router.get('/get/:id', async (req, res) => {
    const salesProjection = req.body.salesProjection || {}
    const salesFilter = req.body.salesFilter || {}
    const productProjection = req.body.productProjection || {}

    const id = req.params.id

    try {
        const dbProduct = await Product.findOne({_id: id}, productProjection)

        if (!dbProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in DB',
                errors: 'Product with that _id not found in DB'
            })
        }

        const dbSalesHistory = await ProductSalesHistory.find({productId: id , ...salesFilter}, salesProjection)
        return res.json({
            success: true,
            message: 'Product and sales history found',
            product: dbProduct,
            salesHistory: dbSalesHistory
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to query from db, db not working or bad projection',
            errors: err
        })
    }
})

/**
 * Endpoint for getting total earnings for a product
 * @route GET /totalEarned/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * req.params.id - id of the product
 *
 * res.body = { //success = true
 *     success: true,
 *     message: 'Total earned for product',
 *     totalEarned: totalEarned // total earnings for the product
 * }
 *
 * res.body = { //success = false
 *     success: false,
 *     message: 'Failed to query from db.',
 *     errors: '...'
 * }
 */
router.get('/totalEarned/:id', async (req, res) => {
    const id = req.params.id

    try {
        const dbSalesHistory = await ProductSalesHistory.find({productId: id})
        let totalEarned = 0
        dbSalesHistory.forEach(sale => {
            totalEarned += sale.price * sale.quantity
        })

        totalEarned = Number(totalEarned.toFixed(2))
        return res.json({
            success: true,
            message: 'Total earned for product',
            totalEarned: totalEarned
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to query from db.',
            errors: err
        })
    }
})






export default router