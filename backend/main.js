import {User} from "./models/userSchema.js";

const port = 4000
const dbUrl = 'mongodb+srv://kubiczek:FQNVlEF8WxeAvwKd@miniprojekt.nnkiwcg.mongodb.net/shopTest2'

import express from 'express'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import cors from 'cors'



import { Product } from './models/productSchema.js'



const app = express()

app.use(express.json()) //allows us to parse incoming json data
app.use(cors()) //allows us to make requests from the frontend

// db connection
mongoose.connect(dbUrl)
    .then(() => console.log('DB connected'))
    .catch(err => console.log('DB connection ERR', err))

//api

app.get('/', async (req, res) => {
    // res.send('Hello from server')
    const newUser = new User({
        login: 'Kuba11',
        email: 'kuba11@g.com',
        password: '123'
    })
    const savedUser = await newUser.save();
    console.log(savedUser)
    const fetchedUsers = await User.find({});
    res.json(fetchedUsers)
})

// Image Storage
const diskStorage = multer.diskStorage({
    destination: 'upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: diskStorage })


// Image Upload endpoint (only labeled as procuct
app.use('/images', express.static('upload/images'))

app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: true,
        path: `http://localhost:${port}/images/${req.file.filename}`,

    })
})

// add product route #TODO
app.post('/addproduct', async (req, res) => {
    const allProducts = await Product.find({})
    let id = 1;
    if (allProducts.length > 0) {
        let lastProduct = allProducts.slice(-1)[0];
        id = lastProduct.id + 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
        date: req.body.date,
        available: req.body.available
    })
    console.log('Product', product)
    try {
        await product.save()
        console.log('Product saved')
        res.json({
            success: true,
            message: 'Product saved',
            name: req.body.name
        })
    } catch (err) {
        res.status(500).send
    }
})

//remove product route #TODO
app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id })
    console.log('Product removed')
    res.json({
        success: true,
        message: 'Product removed',
        id: req.body.id,
        name: req.body.name
    })
})

//get all products route
app.get('/allproducts', async (req, res) => {
    const products = await Product.find({})
    console.log('All products', products)
    res.json(products)
})

// endpoint for registering of new users
app.post('/signup', async (req, res) => {
    const userData = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
    }
    const isUserExist = await User.findOne({ email: userData.email })
    if (isUserExist) {
        return res.status(400).json({
            success: false,
            message: 'User with that email already exists',
            errors: 'User already exists'
        })
    }
    // TODO
    let cart = {};
    for (let i = 0; i < 300; i++) {cart[i] = 0;}

    const user = new User({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        cartData: cart
    })

    await user.save() //add user to db

    const data = { //data for jwt (json web token)
        user: {id: user.id}
    }

    const token = jwt.sign(data, 'secret_ecom');
    res.json({
        success: true,
        token: token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    })


})

// endpoint for logging in
app.post('/login', async (req, res) => {
    const userDataReq = {
        email: req.body.email,
        password: req.body.password
    }
    const dbUser = await User.findOne({email: userDataReq.email})
    if (!dbUser){
        return res.status(400).json({
            success: false,
            message: 'User with that email does not exist',
            errors: 'User does not exist'
        })
    }

    const passCompare = dbUser.password === userDataReq.password

    if (passCompare){
        const data = {
            user: {id: dbUser.id}
        }
        const token = jwt.sign(data, 'secret_ecom')
        res.json({
            success: true,
            token: token,
            user: {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email
            }

        })
    }
    else {
        res.status(400).json({
            success: false,
            message: 'Invalid password',
            errors: 'Invalid password'
        })
    }

})

// middleware for finding user by token
const findUser = async (req, res, next) => { //TODO not tested!
    const token = req.header('auth-token')
    if (!token) {
        return res.status(401).json({
            success: false,
            errors: 'No token found, authorization denied',
            message: 'Authenticate using a valid token'
        })
    }
    try {
        const decoded = jwt.verify(token, 'secret_ecom')
        req.user = decoded.user
        next()
    } catch (err) {
        res.status(400).json({
            success: false,
            errors: "Token is not valid",
            message: 'Provided token is not valid'
        })
    }
}

// endpoint for updateing whole cart TODO change that, not tested
app.post('/updatecart', findUser, async (req, res) => {
    try {
        const userData = await User.findOne({_id: req.user.id})
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'User not found in DB'
            });
        }

        if (!req.body.cartItems) {
            return res.status(400).json({
                success: false,
                message: 'Bad request, cartItems missing'
            });
        }

        userData.cartData = req.body.cartItems
        await User.findOneAndUpdate({_id: userData._id}, {cartData: userData.cartData})
        res.json({
            success: true,
            message: 'Cart updated'
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server error probably DB error'
        });
    }

});



app.listen(port, (err) => {
    console.log(`Server is running on port ${port}`)
    if (err) {
        console.log('Express listen ERR', err)
    }
})