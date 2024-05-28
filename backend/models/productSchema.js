import mongoose from 'mongoose';

const regularStringLength = 100
const regularMessageStringLength = `Cannot be longer than ${regularStringLength} characters`

const Product = mongoose.model('Product', {
    name: {type: String, required: true},
    quantity: {
        type: Number,
        required: true,
        validate: {
            validator: function (quantity){
                return Number.isInteger(quantity) && quantity > 0 ;
            },
            message: props => `${props.value} quantity should be positive and have Integer value`
        }
    },
    price: {
        type: Number,
        required: true,
        validate: {
            validator: function (price){
                return price > 0 ;
            },
            message: props => `${props.value} is less than 0! Price should be positive`
        }
    },
    productDetails: {
        type:
            {
                mainDescription: {
                    type: String,
                    required: true,
                    maxLength: [regularStringLength, regularMessageStringLength]
                },
                paragraphDescription: {
                    type: String,
                    required: true,
                    maxLength: [regularStringLength, regularMessageStringLength]
                }
            },
        required: true},
    imageUrl: {type: String, required: true},
    available: {type: Boolean, default: true},

});

export { Product }