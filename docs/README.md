# BD2 mini projekt - sklep internetowy

Skład grupy (imiona i nazwiska, adresy email):

- Bartłomiej Szubiak bszubiak@student.agh.edu.pl
- Szymon Kubiczek kubiczek@student.agh.edu.pl
- Konrad Armatys karmatys@student.agh.edu.pl

Temat (tytuł) projektu: Sklep internetowy

Informacje o wykorzystywanym SZBD i technologii realizacji projektu

- baza danych: `MongoDB`
- backend: `Node.js` , `Express.js`
- frameworki\middleware dla backend'u: `mongoose` , `multer` , `cors`
- frontend: `React`

(Link do repozytorium)[https://github.com/Simsoftcik/BD2Projekt]

## Własne typy danych (pasujące do wyrażeń regularnych)

### string: email

`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`

### string: phone

`^\+(?:[0-9] ?){6,14}[0-9]$`

### int: year

`^\d{4}$`

### int: month

`^(0?[1-9]|1[0-2])$`

## Endpointy

### Endpointy koszyka

Każda metoda opisana poniżej korzysta z middleware findUser,
który weryfikuje czy użytkownik istnieje i czy podany przez niego token jest poprawny.

#### /cart/own

##### Opis

Zwraca koszyk klienta.

##### Parametry

- \_id `ObjectId`

##### Wartość zwracana

```js
{
  success: true,
  cartData: CartItemSchema[]
}
```

##### Zwracanie błędu

```js
{
  success: false,
  message: string,
  errors: string
}
```

#### /cart/updateone

##### Opis

Zmienia dane jednego produktu w koszyku użytkownika.

##### Parametry

- \_id `ObjectId`
- cartProductData `CartItemSchema`

##### Wartość zwracana

```js
{
  success: true,
  message: 'Cart updated',
  newCart: {
    type: [CartItemSchema],
    default: []
  },
  oldCart: {
    type: [CartItemSchema],
    default: []
  }
}
```

##### Zwracanie błędu

```js
{
  success: false,
  message: string,
  errors: string
}
```

#### /cart/sell

##### Opis

Sprzedaje produkty użytkownikowi z jego koszyka.

---

Aby zachować synchroniczność dostępu do danych używamy mutexa weryfikacyjnego.

##### Parametry

- \_id `ObjectId`

##### Wartość zwracana

```js
{
  success: true,
  message: 'Products sold',
  totalPrice: number
}
```

##### Zwracanie błędu

```js
{
  success: false,
  message: string,
  errors: string,
  newCart: {
    type: [CartItemSchema],
    default: []
  },
  oldCart: {
    type: [CartItemSchema],
    default: []
  }
}
```

### Endpointy produktu

#### /products/list

##### Opis

Zwraca wszystkie produkty.

##### Parametry

- \_id `ObjectId`

##### Wartość zwracana

```js
{
  success: true,
  cartData: CartItemSchema[]
}
```

##### Zwracanie błędu

```js
{
  success: false,
  message: string,
  errors: string
}
```

#### /products/available

##### Opis

Zwraca wszystkie dostępne produkty.

##### Parametry

- \_id `ObjectId`

##### Wartość zwracana

```js
{
  success: true,
  cartData: CartItemSchema[]
}
```

##### Zwracanie błędu

```js
{
  success: false,
  message: string,
  errors: string
}
```

#### /products/add

##### Opis

Dodaje nowy produkt.

---

Przed wykonaniem sprawdzamy przy pomocy middlewaru validateBodyJsonSchema czy dane nowego produktu są poprawne.

##### Parametry

- \_id `ObjectId`
- newProduct `productSchema`

##### Wartość zwracana

```js
{
  success: true,
  message: 'Product saved',
  name: string
}
```

##### Zwracanie błędu

```js
{
  success: false,
  message: string,
  errors: string
}
```

#### /products/get/:id

##### Opis

Dodaje nowy produkt.

---

Przed wykonaniem sprawdzamy przy pomocy middlewaru validateBodyJsonSchema czy dane nowego produktu są poprawne.

##### Parametry

- \_id `ObjectId`
- _optional_ projection `Projection`

##### Wartość zwracana

```js
{
  success: true,
  product: {
    _id: ObjectId,
    name: string,
    quantity: number,
    price: number,
    productDetails: {
      mainDescription: string,
      paragraphDescription: string,
    },
    imageUrl: string,
    available: boolean,
  }
}
```

---

Wartość zwracana jest zależna od projection.
Powyżej znajdują się dane otrzymane gdy projection nie zostanie podane.

##### Zwracanie błędu

```js
{
  success: false,
  message: string,
  errors: string
}
```

### Endpointy użytkownika

#### /users/list

##### Opis

Zwraca wszystkich użytkowników.

##### Parametry

- _optional_ projection `Projection`
- _optional_ filter `Filter`

##### Wartość zwracana

```js
{
  success: true,
  products: [
    {
      _id: ObjectId,
      customerData: {
        firstName: string,
        lastName: string,
        phone: string,
        adress: {
          country: string,
          postalCode: string,
          region: string,
          city: string,
          street: string,
          buildingNumber: string,
          apartmentNumber: string
        }
      },
      login: string,
      email: string,
      password: encodedPassword,
      cartData: {
        productId: number
        quantity: number
      }
      orders: {
        _id: ObjectId,
        date: Date,
        paymentStatus: string,
        products: [
          {
            productId: number,
            quantity: number
          },
          {
            productId: number,
            quantity: number
          },
        ],
        totalPrice: number
      }
    }
  ]
}
```

---

Wartość zwracana jest zależna od projection.
Powyżej znajdują się dane otrzymane gdy projection nie zostanie podane.

##### Zwracanie błędu

```js
{
  success: false,
  message: string,
  errors: string
}
```

#### /users/add

##### Opis

Dodaje nowego użytkownika.

##### Parametry

- user `UserSchema`

##### Wartość zwracana

```js
{
  success: true,
  message: 'User has been created',
  user: {
    _id: ObjectId,
    customerData: {
      firstName: string,
      lastName: string,
      phone: string,
      adress: {
        country: string,
        postalCode: string,
        region: string,
        city: string,
        street: string,
        buildingNumber: string,
        apartmentNumber: string
      }
    },
    login: string,
    email: string,
    password: encodedPassword,
    cartData: {
      productId: number
      quantity: number
    }
    orders: {
      _id: ObjectId,
      date: Date,
      paymentStatus: string,
      products: [
        {
          productId: number,
          quantity: number
        },
        {
          productId: number,
          quantity: number
        },
      ],
      totalPrice: number
    }
  }
}
```

##### Zwracanie błędu

```js
{
  success: false,
  message: string,
  errors: string
}
```

#### /users/signup

##### Opis

Rejestruje nowego użytkownika.

##### Parametry

- user `UserSchema`

##### Wartość zwracana

```js
{
  success: true,
  token: token,
  user: {
    _id: ObjectId,
    login: string,
    email: string
  }
}
```

##### Zwracanie błędu

```js
{
  success: false,
  message: string,
  errors: string
}
```

#### /users/login

##### Opis

Loguje użytkownika.

##### Parametry

- user `UserSchema`

##### Wartość zwracana

```js
{
  success: true,
  token: token,
  user: {
    _id: ObjectId,
    login: string,
    email: string
  }
}
```

##### Zwracanie błędu

```js
{
  success: false,
  message: string,
  errors: string
}
```

## Metody pomocnicze

#### addNewUser

##### Opis

Dodaje użytkownika do bazy.

##### Parametry

- userData `UserSchema`

##### Wartość zwracana

```js
{
  success: true,
  message: 'User has been created',
  user: {
    _id: ObjectId,
    customerData: {
      firstName: string,
      lastName: string,
      phone: string,
      adress: {
        country: string,
        postalCode: string,
        region: string,
        city: string,
        street: string,
        buildingNumber: string,
        apartmentNumber: string
      }
    },
    login: string,
    email: string,
    password: encodedPassword,
    cartData: {
      productId: number
      quantity: number
    }
    orders: {
      _id: ObjectId,
      date: Date,
      paymentStatus: string,
      products: [
        {
          productId: number,
          quantity: number
        },
        {
          productId: number,
          quantity: number
        },
      ],
      totalPrice: number
    }
  }
}
```

##### Zwracanie błędu

```js
{
  success: false,
  message: string,
  errors: string
}
```

#### getUserToken

##### Opis

Generuje token użytkownikowi.

##### Parametry

- user `UserSchema`

##### Wartość zwracana

`string`

#### getUserByToken

##### Opis

Zwraca użytkownika na podstawie tokenu.

##### Parametry

- token `string`

##### Wartość zwracana

```js
{
  _id: ObjectId,
  customerData: {
    firstName: string,
    lastName: string,
    phone: string,
    adress: {
      country: string,
      postalCode: string,
      region: string,
      city: string,
      street: string,
      buildingNumber: string,
      apartmentNumber: string
    }
  },
  login: string,
  email: string,
  password: encodedPassword,
  cartData: {
    productId: number
    quantity: number
  }
  orders: {
    _id: ObjectId,
    date: Date,
    paymentStatus: string,
    products: [
      {
        productId: number,
        quantity: number
      },
      {
        productId: number,
        quantity: number
      },
    ],
    totalPrice: number
  }
}
```

#### findUser

##### Opis

Sprawdza czy użytkownik istnieje w bazie i czy jego token jest poprawny.

##### Parametry

- req `Request`
- res `Response`
- next `Function`

##### Wartość zwracana

`undefined`

##### Zwracanie błędu

```js
{
  success: false,
  message: string,
  errors: string
}
```

#### verifyCart

##### Opis

Sprawdza czy koszyk jest poprawny.

##### Parametry

- cartData `CartItemSchema[]`

##### Wartość zwracana

```js
{
  fixedCart: [
    {
      productId: number,
      quantity: number
    }
  ],
  cartError: false
}
```

##### Zwracanie błędu

```js
{
  fixedCart: [
    {
      productId: number,
      quantity: number
    }
  ],
  cartError: true
}
```

#### validateBodyJsonSchema

##### Opis

Middleware który sprawdza czy request.body posiada daną strukturę.

##### Parametry

- bodyFieldName `string`
- schema `Function`

##### Wartość zwracana

`undefined`

##### Zwracanie błędu

```js
{
  success: false,
  message: string,
  errors: string
}
```
