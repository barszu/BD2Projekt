import express from 'express'
import { Mutex } from 'async-mutex';

import {findUser} from "./userRouter.js";
import {User} from "../models/userSchema.js";
import {Product} from "../models/productSchema.js";
import {ProductSalesHistory} from "../models/salesHistorySchema.js";

const router = express.Router()

router.get('/own' , findUser , async (req, res) => {
    try {
        const userData = await User.findOne({_id: req.user._id} , {_id: 1 , cartData: 1})
        res.json({
            success: true,
            cartData: userData.cartData,
            _id: userData._id
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user data from db',
            errors: err
        })
    }
})



//get user cart route
// endpoint for updateing whole cart TODO change that, not tested
router.post('/set', findUser, async (req, res) => {
    try {
        const userData = await User.findOne({_id: req.user._id})
        const newCart = req.body.cartItems

        if (!newCart) {
            return res.status(400).json({
                success: false,
                message: 'Bad request, cartItems missing',
                errors: "'cartItems' object not found in req.body"
            });
        }
        const dbUser = await User.findOne({_id: userData._id})
        dbUser.cartData = newCart
        await dbUser.save() // TODO check if it works?

        // await User.findOneAndUpdate({_id: userData._id}, {cartData: newCart} , )
        res.json({
            success: true,
            message: 'Cart updated',
            newCart: newCart,
            oldCart: userData.cartData

        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server error probably DB error',
            errors: err
        });
    }

});


router.post('/updateone' , findUser , async (req, res) => {
    const cartProductData =  req.body.cartProductData
    const userData = req.body.user
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

    try {
        const dbUser = await User.findOne({_id: userData._id} , {cartData: 1})
        // dbUser.cartData[cartProductData.productId] = dbUser.cartData[cartProductData.productId] === undefined ? 0 : dbUser.cartData[cartProductData.productId]


        const cartItem = dbUser.cartData.find(item => item.productId.toString() === cartProductData.productId);

        if (cartItem) {
            // Jeśli produkt jest już w koszyku, zaktualizuj ilość
            cartItem.quantity = cartProductData.quantity;
        } else {
            // Jeśli produktu nie ma w koszyku, dodaj go
            dbUser.cartData.push({
                productId: cartProductData.productId,
                quantity: cartProductData.quantity
            });
        }

        // sprawdzenie czy produkt mozna kupic w takiej ilosci, i czy jest dostepny
        const dbProduct = await Product.findOne({_id: cartProductData.productId} , {quantity: 1})

        if (! (dbProduct.quantity <= cartItem.quantity) && dbProduct.available ) {
            return res.status(400).json({
                success: false,
                message: 'Bad quantity value. Quantity of product in cart is bigger than available in DB. Or product is not available',
                errors: `dbProduct.quantity ${dbProduct.quantity} < ${dbUser.cartData[cartProductData.productId]} , dbProduct.available ${dbProduct.available}`
            })
        }


        dbUser.save()
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server error probably DB error or bad quantity value',
            errors: err
        });
    }

})

const verificationMutex = new Mutex();

async function verifyCart(cartData) {
    const fixedCart = []
    let cartError = false

    for (let item of cartData) {
        const dbProduct = await Product.findOne({_id: item.productId} , {quantity: 1})
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

router.post('/sellcart' , findUser , async (req , res) => {
    const reqUserData = req.body.user
    const release = await verificationMutex.acquire(); //przyblokowanie innych instancji
    try {
        const dbUser = User.findOne({_id: reqUserData._id})
        { // verification of cart block
            const {fixedCart , cartError} = await verifyCart(dbUser.cartData)

            if (cartError === true) {
                release();
                res.status(400).json({
                    success: false,
                    message: 'Cart verification failed',
                    errors: 'Cart verification failed',
                    newCart: fixedCart,
                    oldCart: dbUser.cartData
                });
                return
            }
        }


        // cart verification passed, selling... //TODO add payment
        let totalPrice = 0

        for (let item of dbUser.cartData) {
            const dbProduct = await Product.findOne({_id: item.productId} , {quantity: 1})
            dbProduct.quantity -= item.quantity
            totalPrice += item.quantity * dbProduct.price
            dbProduct.save()

            // create product history
            ProductSalesHistory.create({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
            }).save()
        }


        dbUser.orders.push({
            paymentStatus: 'Paid',
            products: dbUser.cartData,
            totalPrice: totalPrice,
        })

        dbUser.cartData = []
        dbUser.save()

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server error probably DB error',
            errors: err
        });
    } finally {
        release(); //uwolnienie blokady
    }
})



export default router
