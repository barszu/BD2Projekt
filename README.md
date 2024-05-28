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

Link do repozytorium (github):
https://github.com/Simsoftcik/BD2Projekt.git


## Własne typy danych (pasujące do wyrażeń regularnych)

### string: email

`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`

### string: phone

`^\+(?:[0-9] ?){6,14}[0-9]$`

### int: year

`^\d{4}$`

### int: month

`^(0?[1-9]|1[0-2])$`

## Metody

Dla czytelności dokumentacji parametr `userId` oznacza pole `_id` w kolekcji Users.
Analogicznie dla pozostałych.

### Do wielu kolekcji

#### sellProductsTo

##### Opis

Sprzedawanie klientowi produktów z koszyka.

##### Parametry

- userId `ObjectId`

##### Wartość zwracana

`boolean` - czy sprzedaż przebiegła poprawnie

##### Implementacja

```mongodb

```

### Kolekcja Customers

#### addCustomer

##### Opis

Dodanie klienta do bazy danych.

##### Parametry

- login `string`
- password `string`

---

- firstName `string`
- lastName `string`
- email `string: email`
- phone `string: phone`

---

- country `string`
- postalCode `string`
- region `string`
- city `string`
- street `string`
- buildingNumber `string`
- apartmentNumber `string`

##### Wartość zwracana

`boolean` - czy dodawanie klienta przebiegło poprawnie

##### Implementacja

```mongodb

```

#### checkIfCustomerExists

##### Opis

Sprawdzenie czy istnieje klient.

##### Parametry

- userId `ObjectId`

##### Wartość zwracana

`boolean` - czy klient istnieje

##### Implementacja

```mongodb

```

### Kolekcja Products

#### addProduct

##### Opis

Dodanie produktu do bazy danych.

##### Parametry

- name `string`
- inStock `int`
- price `double`
- isActive `boolean`

---

- mainDescription `string`
- paragraphDescription `string`

##### Wartość zwracana

`boolean` - czy dodawanie produktu przebiegło poprawnie

##### Implementacja

```mongodb

```

### Kolekcja ProductsHistory

#### getProductOrdersHistory

##### Opis

Zwracanie danych zamówień produktu.

##### Parametry

- productId `ObjectId`
- startingYear `int: year`
- startingMonth `int: month`
- monthCount `int`

##### Wartość zwracana

`BSON[]` - otrzymane dane

##### Implementacja

```mongodb

```
