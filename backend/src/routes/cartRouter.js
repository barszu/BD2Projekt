import express from 'express'
import { Mutex } from 'async-mutex';

import {findUser} from "./userRouter.js";
import {User} from "../models/userSchema.js";
import {Product} from "../models/productSchema.js";
import {ProductSalesHistory} from "../models/salesHistorySchema.js";
import mongoose from "mongoose";

const router = express.Router()

/**
 * Endpoint for getting the current user's cart data
 * @route GET /own
 * @param {Object} req - Express request object. The request object should have a 'user' property with the user's id.
 * @param {Object} res - Express response object
 *
 * The endpoint will return the cart data of the current user.
 * If an error occurs while querying the database, a 500 status code is returned along with the error message.
 */
router.get('/own' , findUser , async (req, res) => {
    try {
        const userData = await User.findOne({_id: req.user._id} , {_id: 1 , cartData: 1})
        res.json({
            success: true,
            cartData: userData.cartData, //TODO albo cale informacje o produktach?
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user data from db',
            errors: err
        })
    }
})

/**
 * Endpoint for updating a single product in the user's cart
 * @route POST /updateone
 * @param {Object} req - Express request object. The request object should have a 'user' property with the user's id and a 'body' property with 'cartProductData' object.
 * @param {Object} res - Express response object
 *
 * The 'cartProductData' object should have 'productId' and 'quantity' properties.
 * If 'quantity' is 0, the product will be removed from the cart.
 * If the product is already in the cart, its quantity will be updated.
 * If the product is not in the cart, it will be added.
 *
 * The endpoint will return the updated cart data of the current user.
 * If an error occurs while querying the database, a 500 status code is returned along with the error message.
 */
router.post('/updateone' , findUser , async (req, res) => {
    const cartProductData =  req.body.cartProductData
    const userData = req.user
    if (! cartProductData) {
        return res.status(400).json({
            success: false,
            message: 'No cartProductData provided',
            errors: 'No cartProductData provided via body'
        })
    }
    if ( (! cartProductData.hasOwnProperty('productId') ) || (!cartProductData.hasOwnProperty('quantity')) ) {
        return res.status(400).json({
            success: false,
            message: 'Mising parameter in cartProductData',
            errors: "Parameter 'productId' or 'quantity' not found in cartProductData (body object)"
        })
    }
    if (cartProductData.quantity < 0) {
        return res.status(400).json({
            success: false,
            message: 'Bad quantity value',
            errors: "Quantity of product in cart is less than 0"
        })
    }

    try {
        const dbUser = await User.findOne({_id: userData._id} , {cartData: 1})
        const oldCart =  JSON.parse(JSON.stringify(dbUser.cartData)  )  // 200 iq deep copy

        if (cartProductData.quantity === 0) {
            // Jeśli produkt ma być usunięty z koszyka

            dbUser.cartData = dbUser.cartData.filter(item => item.productId.toString() !== cartProductData.productId);


        } else {
            //normalna modyfikacja koszyka

            // znajdz produkt w koszyku
            let cartItem = dbUser.cartData.find(item => item.productId.toString() === cartProductData.productId);

            if (cartItem) {
                // Jeśli produkt jest już w koszyku, zaktualizuj ilość
                cartItem.quantity = cartProductData.quantity;
            } else {
                // Jeśli produktu nie ma w koszyku, dodaj go
                cartItem = {
                    productId: cartProductData.productId,
                    quantity: cartProductData.quantity
                }
                dbUser.cartData.push(cartItem);
            }

            // sprawdzenie czy produkt mozna kupic w takiej ilosci, i czy jest dostepny
            const dbProduct = await Product.findOne({_id: cartProductData.productId} , {quantity: 1, available: 1})

            if ( (! (cartItem.quantity <= dbProduct.quantity )) || (! dbProduct.available) ) {
                return res.status(400).json({
                    success: false,
                    message: 'Bad quantity value. Quantity of product in cart is bigger than available in DB. Or product is not available',
                    errors: `dbProduct.quantity ${dbProduct.quantity} < ${cartItem.quantity} , dbProduct.available ${dbProduct.available}`
                })
            }
        }
        // finally
        dbUser.save()
        return res.json({
            success: true,
            message: 'Cart updated',
            newCart: dbUser.cartData,
            oldCart: oldCart

        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server error probably DB error or bad quantity value',
            errors: err
        });
    }

})


/**
 * Verifies the cart data by checking the availability and quantity of each product in the cart.
 * If a product is not available, it is removed from the cart.
 * If the quantity of a product in the cart is more than the available quantity in the database, the quantity is adjusted to the available quantity.
 *
 * @async
 * @function verifyCart
 * @param {Array} cartData - An array of cart items. Each item is an object with 'productId' and 'quantity' properties.
 * @returns {Object} An object with 'fixedCart' and 'cartError' properties. 'fixedCart' is an array of cart items after verification and 'cartError' is a boolean indicating if there was an error during verification.
 * @throws Error Will throw an error if a database error occurs.
 */
async function verifyCart(cartData) {
    const fixedCart = []
    let cartError = false

    for (let item of cartData) {
        const dbProduct = await Product.findOne({_id: item.productId} )
        if (dbProduct.available === false) {
            // remove from cart
            cartError = true
            continue
        }

        if (dbProduct.quantity < item.quantity) {
            // fix quantity
            cartError = true
            item.quantity = dbProduct.quantity
            fixedCart.push(item)
        }
        else {
            // normal
            fixedCart.push(item)
        }
    }
    return {
        fixedCart: fixedCart,
        cartError: cartError
    }

}



/**
 * Endpoint for selling the products in the user's cart
 * @route POST /sell
 * @param {Object} req - Express request object. The request object should have a 'user' property with the user's id.
 * @param {Object} res - Express response object
 *
 * The endpoint will verify the cart data, update the database, and return the total price of the sold products.
 * If the cart verification fails, a 400 status code is returned along with the error message.
 * If an error occurs while updating the database, a 500 status code is returned along with the error message.
 */

// Mutex to prevent race conditions when verifying the cart
const verificationMutex = new Mutex();
router.post('/sell' , findUser , async (req , res) => {
    const reqUserData = req.user
    const release = await verificationMutex.acquire(); //przyblokowanie innych instancji

    const session = await mongoose.startSession()
    session.startTransaction();

    try {
        const dbUser = await User.findOne({_id: reqUserData._id})
        { // verification of cart block
            const {fixedCart , cartError} = await verifyCart(dbUser.cartData)

            if (cartError === true) {
                release();
                return res.status(400).json({
                    success: false,
                    message: 'Cart verification failed',
                    errors: 'Cart verification failed',
                    newCart: fixedCart,
                    oldCart: dbUser.cartData
                });
            }
        }

        // cart verification passed, selling... //TODO add payment
        let totalPrice = 0



        async function updateDbItems() {
            for (let item of dbUser.cartData) {
                const dbProduct = await Product.findOne({_id: item.productId})
                dbProduct.quantity -= item.quantity
                totalPrice += item.quantity * dbProduct.price
                dbProduct.save({ session })

                // create product history
                new ProductSalesHistory({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: dbProduct.price
                }).save({ session })
            }
        }

        await updateDbItems()



        dbUser.orders.push({
            paymentStatus: 'Paid',
            products: dbUser.cartData,
            totalPrice: totalPrice,
        })

        dbUser.cartData = []
        await dbUser.save({ session })

        await session.commitTransaction();
        await session.endSession();

        res.json({
            success: true,
            message: 'Products sold',
            totalPrice: totalPrice
        })

    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        res.status(500).json({
            success: false,
            message: 'Server error probably DB error',
            errors: err
        });
    } finally {
        release(); // mutex release
    }
})



export default router
