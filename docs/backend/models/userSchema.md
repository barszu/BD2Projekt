# Dokumentacja schematu użytkownika

Plik `userSchema.js` definiuje schemat Mongoose dla modelu `User`. Ten model reprezentuje użytkownika w aplikacji.



## Stałe

regularStringLength: Ta stała definiuje maksymalną długość dozwoloną dla zwykłych stringów w różnych polach schematu, ustawioną na 50 znaków.

regularMessageStringLength: Ten szablon stringu konstruuje komunikat walidacyjny, który wskazuje, że string nie może być dłuższy niż regularStringLength.

```js
const regularStringLength = 50;
const regularMessageStringLength = `cannot be longer than ${regularStringLength} characters`;
````


## Schematy
### AddressSchema
AddressSchema definiuje strukturę adresu z kilkoma polami:

country: String z maksymalną długością 50 znaków.
postalCode: String z maksymalną długością 50 znaków.
region: String z maksymalną długością 50 znaków.
city: String z maksymalną długością 50 znaków.
street: String z maksymalną długością 50 znaków.
buildingNumber: String z maksymalną długością 50 znaków.
apartmentNumber: String z maksymalną długością 50 znaków, może być null.

```js
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
        maxlength: [regularStringLength, `city ${regularMessageStringLength}`]
    },
    street: {
        type: String,
        maxlength: [regularStringLength, `street ${regularMessageStringLength}`]
    },
    buildingNumber: {
        type: String,
        maxlength: [regularStringLength, `buildingNumber ${regularMessageStringLength}`]
    },
    apartmentNumber: {
        type: String,
        maxlength: [regularStringLength, `apartmentNumber ${regularMessageStringLength}`]
    } // nullable
});

```



### CustomerDataSchema

CustomerDataSchema definiuje strukturę danych klienta:

firstName: String z maksymalną długością 50 znaków.
lastName: String z maksymalną długością 50 znaków.
phone: String walidowany za pomocą wyrażenia regularnego, aby pasował do międzynarodowych numerów telefonów.
address: Zagnieżdżony schemat dla szczegółów adresu używający AddressSchema.

```js
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
        type: String,
        validate: /^\+(?:[0-9] ?){6,14}[0-9]$/
    },
    address: {
        type: AddressSchema
    }
});
```

### CartItemSchema

CartItemSchema definiuje strukturę elementu koszyka:

productId: ID obiektu referencjonujące produkt, wymagane.
quantity: Liczba z minimalną wartością 1, walidowana, aby była liczbą całkowitą, wymagana.


```js
const CartItemSchema = new Schema({
productId: {
type: ObjectId,
ref: 'Products',
required: true
},
quantity: {
type: Number,
min: 1,
validate: {
validator: Number.isInteger,
message: props => `${props.value} is not an integer value`
},
required: true
}
});
```



### OrderSchema
OrderSchema definiuje strukturę zamówienia:

date: Pole daty z domyślną wartością bieżącej daty, wymagane.
paymentStatus: String wskazujący status płatności, wymagany, z dozwolonymi wartościami 'Paid', 'Pending' lub 'Failed'.
products: Tablica elementów koszyka, walidowana, aby upewnić się, że jest przynajmniej jeden produkt, wymagane.
totalPrice: Liczba walidowana, aby była dodatnia i miała maksymalnie 2 miejsca po przecinku.

```js
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
        type: [CartItemSchema],
        required: true,
        validate: {
        validator: function (products) {
        return products.length > 0;
        },
        message: props => `Order should have at least one product`
        }
    },
    totalPrice: {
        type: Number,
        validate: [
        {
        validator: function (price) {
        return price > 0;
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
```




### UserSchema
UserSchema definiuje główną strukturę użytkownika:

customerData: Zagnieżdżony schemat dla danych klienta używający CustomerDataSchema.
login: String dla loginu użytkownika, wymagany, unikalny, walidowany za pomocą wyrażenia regularnego, 
        sklada sie z małych lub dużych liter lub cyfr, jego dlugosc to min 5 znakow.
email: String dla emaila użytkownika, wymagany, unikalny, walidowany za pomocą wyrażenia regularnego,
        zgodnie z formatem adresu email. (np. aaa@g.com)
password: String dla hasła użytkownika, wymagany.
cartData: Tablica elementów koszyka, domyślnie pusta tablica.
orders: Tablica zamówień, domyślnie pusta tablica.

```js
const UserSchema = new Schema({
customerData: { type: CustomerDataSchema }, 
    login: {
    type: String,
    required: true,
    unique: true,
    validate: /^[a-zA-Z0-9]{5,}$/
},
email: {
    type: String,
    required: true,
    unique: true,
    validate: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
},
password: {
    type: String,
    required: true
},
cartData: {
    type: [CartItemSchema],
    default: []
}, // default to empty array
orders: {
    type: [OrderSchema],
    default: []
} // default to empty array
});
```




## Model
User: Główny model użytkowników utworzony za pomocą UserSchema

```js
const User = mongoose.model('User', UserSchema);

export { User };
```




