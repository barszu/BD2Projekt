import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import path from 'path'
import cors from 'cors'

import {User} from "./src/models/userSchema.js";
import { Product } from './src/models/productSchema.js';
import { findUser } from "./src/routes/userRouter.js"
import userRouter from "./src/routes/userRouter.js";
import productRouter from "./src/routes/productRouter.js";

const port = 4000
const dbUrl = 'mongodb+srv://kubiczek:FQNVlEF8WxeAvwKd@miniprojekt.nnkiwcg.mongodb.net'
const dataBaseName = 'shopTest2'






const app = express()

app.use(express.json()) //allows us to parse incoming json data
app.use(cors()) //allows us to make requests from the frontend

// db connection
mongoose.connect(`${dbUrl}/${dataBaseName}`)
    .then(() => console.log('DB connected'))
    .catch(err => console.log('DB connection ERR', err))

//api

app.use('/users', userRouter)
app.use('/products', productRouter)

app.get('/', async (req, res) => {
    res.send('Hello from server');
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