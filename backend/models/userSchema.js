import mongoose , {Schema} from "mongoose";
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
    phone: { type: String, validate: /^\+(?:[0-9] ?){6,14}[0-9]$/ },
    address: {
        type: AddressSchema
    }
});

const OrderSchema = new Schema({
    date: {
        type: Date
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['Paid', 'Pending', 'Failed']
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
    login: { type: String, required: true, unique: true , validate: /^[a-zA-Z0-9]{5,}$/ },
    email: { type: String, required: true, unique: true , validate: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} }, //domyślnie pusty obiekt
    orders: { type: [OrderSchema], default: [] } // domyślnie pusta lista
});

const User = mongoose.model('User', UserSchema);

export { User }