import mongoose from 'mongoose';

const regularStringLength = 100
const regularMessageStringLength = `Cannot be longer than ${regularStringLength} characters`

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxLength: [regularStringLength, regularMessageStringLength]
    },
    quantity: {
        type: Number,
        required: true,
        validate: {
            validator: function (quantity){
                return Number.isInteger(quantity) && quantity >= 0 ;
            },
            message: props => `${props.value} quantity should be positive and have Integer value`
        }
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

// niech available to bedzie mozliwosc zablokowania towaru przez sklep

// ProductSchema.pre('save', function(next) {
//     if (this.quantity === 0) {
//         this.available = false;
//     }
//     next();
// });

const Product = mongoose.model('Product', ProductSchema);

export { Product }