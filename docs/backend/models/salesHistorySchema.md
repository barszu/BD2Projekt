# Dokumentacja schematu Historii Sprzedaży

Plik `salesHistorySchema.js` definiuje schemat Mongoose dla modelu `ProductSalesHistory`. Ten model reprezentuje historię sprzedaży produktu w aplikacji.

```js
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
```

## Pola

- `productId`: Jest to odniesienie do modelu `Product`. Jest to pole wymagane.
- `quantity`: Reprezentuje ilość sprzedanego produktu. Domyślnie wynosi 1 i musi być liczbą całkowitą większą lub równą 1.
- `date`: Reprezentuje datę sprzedaży. Domyślnie jest to bieżąca data i godzina, jest to pole wymagane. Jest również indeksowane dla szybszych zapytań.
- `price`: Reprezentuje cenę produktu w momencie sprzedaży. Jest to pole wymagane i musi być dodatnią liczbą z co najwyżej 2 miejscami po przecinku.
- `userId`: Jest to odniesienie do modelu `User`. Reprezentuje użytkownika, który dokonał zakupu. Jest to pole wymagane.

## Model

Model `ProductSalesHistory` jest eksportowany na końcu pliku i może być importowany w innych częściach aplikacji w razie potrzeby.