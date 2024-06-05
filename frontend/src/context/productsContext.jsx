import React, {createContext, useContext, useEffect, useState} from 'react';

const productsContext = createContext();

const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        fetch('http://localhost:4000/allproducts')
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((err) => console.log('Something went wrong with server... Is it running???', err));
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const contextValue = {
        products,
        fetchProducts,
    };

    return <productsContext.Provider value={products}>{children}</productsContext.Provider>;
}

const useProductsContext = () => useContext(productsContext);

export { ProductsProvider, useProductsContext };