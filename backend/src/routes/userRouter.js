import express from 'express'
import {User} from "../models/userSchema.js";
import jwt from "jsonwebtoken";

const userEncodePass = "shop_user"
const router = express.Router();

//TODO autenticate the access wia req.header 'app-auth-token'

/**
 * User full data object: (db representation)
 * const userData = {
 *     login: 'login', //required, unique
 *     email: 'email', //required, unique
 *     password: 'password', //required
 *     customerData: {...},
 *     cartData: {...}, //default: {}
 *     orders: [{...}] //default: []
 * }
 *
 * User small representation object:
 * const user = {
 *     _id: user._id,
 *     login: user.login,
 *     email: user.email
 * }
 */

//code

/**
 * Endpoint for getting all users data
 * @route GET /all
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * data can be projected by passing filter object in body eq:
 * @example
 * body.filter = {
 *     "customerData":1,
 *     "login":1,
 *     "email":1,
 *     "password":1,
 *     "cartData":1,
 *     "orders":1
 * }
 */
router.get('/list', async (req, res) => {
    const filter = req.body.filter || {}

    try {
        const fetchedUsers = await User.find({}, filter);
        res.json(fetchedUsers);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to query from db:' + err.message,
            errors: err
        })
    }
})

// add new user internal function
/**
 * Internal function to add a new user
 * @param {Object} userData - User full data object: (db representation)
 *  non required fields will be set to default so can be skipped
 * @returns {Object} - Result of the operation
 */
async function addNewUser(userData){
    let isUserExist;
    try {
        isUserExist = await User.findOne({ email: userData.email } )
    }
    catch (err) {
        return {
            success: false,
            message: 'Failed to query from db to check if user exist'+ err.message,
            errors: err
        }
    }

    if (isUserExist) {
        return {
            success: false,
            message: 'User with that email already exists',
            errors: 'User already exists'
        }
    }
    try {
        const user = new User(userData)
        const savedUser = await user.save()
        return {
            success: true,
            message: 'User has been created',
            user: savedUser
        }
    }
    catch (err) {
        return {
            success: false,
            message: 'Failed to create or add user, bad data provided probably '+ err.message,
            errors: err
        }
    }

}

/**
 * Endpoint for adding a new User
 * @route POST /add
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * body.user - user full data object: (db representation)
 *  non required fields will be set to default so can be skipped
 *
 */
router.post('/add', async (req, res) => {
    //TODO autenticate req from app via req.header
    //TODO hash password !
    try {
        const userData = req.body.user //as in schema
        const result = await addNewUser(userData)
        if (result.success === true){
            res.json(result)
        }
        else {
            res.status(400).json(result)
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to add user' + err.message,
            errors: err
        })
    }

})

/**
 * Function to generate a JWT token for a user
 * @param { _id: string } user - The user object. Must contain a unique identifier _id
 * @returns {string} - The generated JWT token
 */
function getUserToken(user){
    const jwt_data = { //data for jwt (json web token)
        user: {userId: user._id}
    }
    return jwt.sign(jwt_data, userEncodePass)
}

/**
 * Function to get a user object by decoding a JWT token
 * @param {string} token - The JWT token to decode
 * @returns { _id: string } user  - The user object. Must contain a unique identifier _id
 */
function getUserByToken(token){
    const decoded = jwt.verify(token, userEncodePass)
    return decoded.user
}

/**
 * Endpoint for registering new users
 * @route POST /signup
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * body.user - user full data object: (db representation)
 *  non required fields will be set to default so can be skipped
 *
 * res.body = { //success = true
 *     success: true
 *     token: 'jwt_token'
 *     user: { //user small representation object }
 * }
 *
 * res.body = { //success = false
 *    success: false,
 *    message: 'User with that email already exists',
 *    errors: 'User already exists'
 * }
 */
router.post('/signup', async (req, res) => {
    //TODO autenticate req from app via req.header
    try {
        const userData = req.body.user //as in schema
        const addUserResult = await addNewUser(userData)
        if (addUserResult.success === false){
            res.status(400).json(addUserResult)
            return
        }
        const user = addUserResult.user

        const token = getUserToken(user)
        res.json({
            success: true,
            token: token,
            user: {
                _id: user._id,
                login: user.login,
                email: user.email
            }
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to sign up user' + err.message,
            errors: err
        })
    }

})

/**
 * Endpoint for logging in
 * @route POST /login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * body.user - user full data object: (db representation) ! only required => email, password, login
 *
 * res.body = { //success = true
 *    success: true
 *    token: 'jwt_token'
 *    user: { //user small representation object }
 *    }
 *
 * res.body = { //success = false
 *    success: false,
 *    message: 'User with that email does not exist',
 *    errors: 'User does not exist'
 *    }
 */
router.post('/login', async (req, res) => {
    try {
        const userData = req.body.user //as in schema
        const dbUser = await User.findOne({
            email: userData.email,
            login: userData.login
        }) //TODO albo po tylko loginie?

        if (!dbUser){
            return res.status(400).json({
                success: false,
                message: 'User with that email does not exist',
                errors: 'User does not exist'
            })
        }

        const passwordCompare = dbUser.password === userData.password
        // TODO hash password !

        if (passwordCompare){
            const token = getUserToken(dbUser)
            res.json({
                success: true,
                token: token,
                user: {
                    _id: dbUser._id,
                    login: dbUser.login,
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
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to log in user' + err.message,
            errors: err
        })
    }


})


/**
 * Middleware for finding user (userID) by token user like {_id: ObjectId , ...}
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 *
 * req.header('user-auth-token') - token for user
 *
 * fast, entry check if token is valid -> user can be found
 * writes user object to req.user
 *
 * when token is not valid -> returns 400 | 401
 * res will be {
 *     success: false,
 *     errors: '...',
 *     message: '...'
 * }
 *
 */
export const findUser = async (req, res, next) => { //TODO not tested!
    const token = req.header('user-auth-token')
    if (!token) {
        return res.status(401).json({
            success: false,
            errors: 'No token found, authorization denied',
            message: 'Authenticate using a valid token'
        })
    }

    try {
        req.user = getUserByToken(token)
        next()
    } catch (err) {
        res.status(400).json({
            success: false,
            errors: "Token is not valid",
            message: 'Provided token is not valid'
        })
    }
}




export default router //export router with all endpoints, can be renamed when imported