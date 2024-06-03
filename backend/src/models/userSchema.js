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

const CartItemSchema = new Schema({
    productId: {
        type: ObjectId,
        ref: 'Products',
        required: true
    },
    quantity: {
        type: Number ,
        min: 1 ,
        validate : {
            validator : Number.isInteger,
            message: props => `${props.value} is not an integer value`
        },
        required: true
    }
})

const CartSchema = new Schema({
    type: [CartItemSchema],
    default: [] //domyślnie pusta lista obiektow
});


const OrderSchema = new Schema({
    date: {
        type: Date,
        default: Date.now(),
        required: true
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['Paid', 'Pending', 'Failed']
    },
    products: {
        type: CartSchema,
        required: true
    },
    totalPrice: {
        type: Number,
        validate: [
            {
                validator: function (price){
                    return price > 0 ;
                },
                message: props => `${props.value} is less than 0! TotalPrice should be positive`
            },
            {
                validator: function(price) {
                    return Number(price.toFixed(2)) === price;
                },
                message: props => `${props.value} has more than 2 decimal places! TotalPrice should have at most 2 decimal places`
            }
        ]


    }
});

// main schema
const UserSchema = new Schema({
    customerData: { type: CustomerDataSchema }, //TODO zrób to jako required
    login: { type: String, required: true, unique: true , validate: /^[a-zA-Z0-9]{5,}$/ },
    email: { type: String, required: true, unique: true , validate: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
    password: { type: String, required: true },
    cartData: {type: CartSchema},
    orders: { type: [OrderSchema], default: [] } // domyślnie pusta lista
});

const User = mongoose.model('User', UserSchema);

export { User }