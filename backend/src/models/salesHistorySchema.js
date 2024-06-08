import mongoose from 'mongoose';
import { ObjectId } from "../Types/shorts.js";

const ProductSalesHistory = mongoose.model('ProductSalesHistory', {
    productId: {
        type: ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        default: 1 ,
        required: true,
        validate: {
            validator: function(v) {
                return v >= 1 && Number.isInteger(v);
            },
            message: props => `${props.value} is not a valid quantity! Quantity should be greater than or equal to 1 and have Integer value.`
        }
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
        index : true
    },
    price: {
        type: Number,
        required: true,
        validate: [
            {
                validator: function (price){
                    return price > 0 ;
                },
                message: props => `${props.value} is less than 0! Price should be positive`
            },
            {
                validator: function(price) {
                    return Number(price.toFixed(2)) === price;
                },
                message: props => `${props.value} has more than 2 decimal places! Price should have at most 2 decimal places`
            }
        ]
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    }

});

export { ProductSalesHistory }