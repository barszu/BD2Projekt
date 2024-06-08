import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import path from 'path'
import cors from 'cors'


import userRouter from "./src/routes/userRouter.js";
import productRouter from "./src/routes/productRouter.js";
import cartRouter from "./src/routes/cartRouter.js";
import salesHistoryRouter from "./src/routes/saleshistoryRouter.js";

const port = 4000
const dbUrl = 'mongodb+srv://kubiczek:FQNVlEF8WxeAvwKd@miniprojekt.nnkiwcg.mongodb.net'
const dataBaseName = 'shopTest2'

//TODO autenticate req from app via req.header




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
app.use('/cart' , cartRouter)
app.use('/salesHistory' , salesHistoryRouter)

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





app.listen(port, (err) => {
    console.log(`Server is running on port ${port}`)
    if (err) {
        console.log('Express listen ERR', err)
    }
})