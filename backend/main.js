const port = 4000
const dbUrl = 'mongodb+srv://kubiczek:FQNVlEF8WxeAvwKd@miniprojekt.nnkiwcg.mongodb.net/shopTest'

// const express = require('express')
import express from 'express'
// const mongoose = require('mongoose')
import mongoose from 'mongoose'
// const jwt = require('jsonwebtoken')
import jwt from 'jsonwebtoken'
// const multer = require('multer')
import multer from 'multer'
// const path = require('path')
import path from 'path'
// const cors = require('cors')
import cors from 'cors'



import { Product } from './model/productSchema.js'



const app = express()

app.use(express.json()) //allows us to parse incoming json data
app.use(cors()) //allows us to make requests from the frontend

// db connection
mongoose.connect(dbUrl)
    .then(() => console.log('DB connected'))
    .catch(err => console.log('DB connection ERR', err))

//api

app.get('/', (req, res) => {
    res.send('Hello from server')
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



app.listen(port, (err) => {
    console.log(`Server is running on port ${port}`)
    if (err) {
        console.log('Express listen ERR', err)
    }
})