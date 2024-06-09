import React, {createContext, useContext, useEffect, useState} from 'react';

const productsContext = createContext(null);

const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        fetch('http://localhost:4000/products/available')
            .then((response) => response.json())
            .then((data) => {setProducts(data.products); console.log("pobrano produkty available")})
            .catch((err) => console.log('Something went wrong with server... Is it running???', err));
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const contextValue = {
        products,
        fetchProducts,
    };

    return <productsContext.Provider value={contextValue}>{children}</productsContext.Provider>;
}

const useProductsContext = () => useContext(productsContext);

export { ProductsProvider, useProductsContext };