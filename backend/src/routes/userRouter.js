import express from 'express'
import {User} from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

const userEncodePass = "shop_user"
const router = express.Router();

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
 * data can be projected by passing projection object in body eq:
 * @example
 * body.projection = {
 *     "customerData":1,
 *     "login":1,
 *     "email":1,
 *     "password":1,
 *     "cartData":1,
 *     "orders":1
 * }
 *
 * body.filter = {
 *     "login": "some_login",
 * }
 */
router.get('/list', async (req, res) => {
    const projection = req.body.projection || {}
    const filter = req.body.filter || {}

    try {
        const fetchedUsers = await User.find(filter, projection);
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
        isUserExist = await User.findOne({ email: userData.email } , {login: 1} )
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
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        // Replace the plain text password with the hashed password
        userData.password = await bcrypt.hash(userData.password, salt);


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
        user: {_id: user._id}
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
        } , {login: 1 , email: 1 , password: 1}) //TODO albo po tylko loginie?

        if (!dbUser){
            return res.status(400).json({
                success: false,
                message: 'User with that email does not exist',
                errors: 'User does not exist'
            })
        }

        // const passwordCompare = dbUser.password === userData.password
        const passwordCompare = await bcrypt.compare(userData.password, dbUser.password);

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
 * in addition, middleware checks if that user exist in db
 *
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
export const findUser = async (req, res, next) => {
    const reqUser = req.body.user
    if (reqUser && reqUser._id) {
        // by passing user auth
        if (! User.exists({_id : reqUser._id}) ){
            return res.status(404).json({
                success: false,
                message: "That user does not exist in db",
                errors: `User with provided _id: ${reqUser._id} does not exist in db`
            })
        }
        else {
            return next()
        }

    }



    const token = req.header('user-auth-token')
    if (!token) {
        return res.status(401).json({
            success: false,
            errors: 'No token found, authorization denied',
            message: 'Authenticate using a valid token'
        })
    }

    try {
        const user = getUserByToken(token)

        if (! User.exists({_id : user._id}) ){
            res.status(404).json({
                success: false,
                message: "That user does not exist in db",
                errors: `User with provided _id: ${user._id} does not exist in db`
            })
        }

        // req.user = getUserByToken(token)
        req.user = user
        next()
    } catch (err) {
        res.status(400).json({
            success: false,
            errors: err,
            message: 'Provided token is not valid'
        })
    }



}




export default router //export router with all endpoints, can be renamed when imported