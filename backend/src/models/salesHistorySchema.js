import mongoose from 'mongoose';
import { ObjectId } from "../Types/shorts.js";

const ProductSalesHistory = mongoose.model('ProductSalesHistory', {
    productId: {type: ObjectId, ref: 'Product', required: true},
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
    date: {type: Date, default: Date.now, required: true, index : true},
    price: {
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
                return v >= 0;
            },
            message: props => `${props.value} is not a valid price! Price should be greater than or equal to 0.`
        }
    }

});