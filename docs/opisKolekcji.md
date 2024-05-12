# Opis bazy danych

Baza ma implementować prosty sklep internetowy, w tym celu stworzyliśmy poniższe kolekcje danych w mongoDB:


> Kolekcja customers- przykładowy dokument

```js
{
	_id: 0,
	customerData: {
		firstName: "Jan",
		lastName: "Kowalski",
		email: "janekjanek@gmail.com",
		phone: "123456789",
		adress:{
			country: "Poland",
			postalCode: "12-345",
			region: "Śląsk",
			city: "Katowice",
			street: "Mariacka",
			buildingNumber: "9",
			apartmentNumber: null
		}
	},
	login: "janekjanek",
	password: encodedPassword,
	orders: {
		_id:0,
		date: new Date("2024-05-12"),
		paymentStatus: "confirmed",
		products: [
			{
				productId: 1,
				quantity: 5
			},
			{
				productId: 10,
				quantity: 1
			},
		],
		totalPrice: 100
	}
}
```

> Kolekcja products- przykładowy dokument

```js
{
	_id: 10,
	name: "motorola moto g60",
	inStock: 15,
	price: 900,
	productDetails: {
		mainDescription: "Telefon jakich mało",
		paragraphDescription: "Dobra bateria, 128GB pamięci...",
	}
}
```

> Kolekcja salesHistory- przykładowy dokument

```js
{
	productId: 10,
	year: 2024,
	month: 5,
	sales: [{
		customer_id: 0,
		quantity: 1,
		unitPrice: 900
	}]
}
```
## Operacje CRUD na bazie danych które bedą implementowane:

1. Operacje dotyczące tylko tabeli Customers:

   - `addCustomer`dodająca klienta do bazy danych
     _(potrzebne przy tworzeniu konta)_
   - `checkIfCustomerExist`sprawdzająca czy klient o danym loginie i haśle istnieje _(potrzebne do logowania)_

2. Operacje dotyczące tylko tabeli Products:

   - `addProduct` dodająca nowy produkt

3. Operacje dotyczące obu tabel:

   - `sellProductsTo` sprzedająca klientowi produkty (z koszyka)

     - dla każdego produktu w sklepie zmniejsza ich ilość sprawdzajaąc czy produkty mozna kupić (czy jest ich na tyle oraz czy są dostępne)

     - rejestruje zakup produktu dla produktu
     - rejestruje zamowienie u klienta (order)

## Dodatkowe informacje

Baza danych pozwala na łatwe odczytanie historii produktu oraz historii klienta kosztem pamięci jednego dokumentu

Baza danych jest łatwa w modyfikowaniu i utrzymywaniu w przyszłości
