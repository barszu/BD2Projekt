import mongoose , {Schema} from "mongoose";
import {Email, Login, Phone, PaymentStatus } from "../Types/types.js";
import {ObjectId} from "../Types/shorts.js";

const regularStringLength = 50
const regularMessageStringLength = `cannot be longer than ${regularStringLength} characters`

const AddressSchema = new Schema({
    country: {
        type: String,
        maxlength: [regularStringLength, `country ${regularMessageStringLength}`]
    },
    postalCode: {
        type: String,
        maxlength: [regularStringLength, `postalCode ${regularMessageStringLength}`]
    },
    region: {
        type: String,
        maxlength: [regularStringLength, `region ${regularMessageStringLength}`]
    },
    city: {
        type: String,
        maxlength: [regularStringLength, `region ${regularMessageStringLength}`]
    },
    street: {
        type: String,
        maxlength: [regularStringLength, `region ${regularMessageStringLength}`]
    },
    buildingNumber: {
        type: String,
        maxlength: [regularStringLength, `region ${regularMessageStringLength}`]
    },
    apartmentNumber: {
        type: String,
        maxlength: [regularStringLength, `region ${regularMessageStringLength}`]
    } //nullable
});

const CustomerDataSchema = new Schema({
    firstName: {
        type: String,
        maxlength: [regularStringLength, `firstName ${regularMessageStringLength}`]
    },
    lastName: {
        type: String,
        maxlength: [regularStringLength, `lastName ${regularMessageStringLength}`]
    },
    phone: {
        type: Phone
    },
    address: {
        type: AddressSchema
    }
});

const OrderSchema = new Schema({
    date: {
        type: Date
    },
    paymentStatus: {
        type: PaymentStatus
    },
    products: [
        {
            productId: { type: ObjectId, ref: 'Products' },
            quantity: { type: Number }
        }
    ],
    totalPrice: { type: Number }
});

// main schema
const UserSchema = new Schema({
    customerData: { type: CustomerDataSchema },
    login: { type: Login, unique: true, required: true },
    email: { type: Email, unique: true, required: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} }, //domyślnie pusty obiekt
    orders: { type: [OrderSchema], default: [] } // domyślnie pusta lista
});

const User = mongoose.model('User', UserSchema);

export { User }