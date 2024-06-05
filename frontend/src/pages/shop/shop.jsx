import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from "../../dummy/dummyProducts.js";
import "./shop.css";
import Product from "./product.jsx";
import { useProductsContext } from "../../context/productsContext.jsx";

const Shop = () => {
    // const { products } = useProductsContext();
    // console.log(products);
    //
    // const [products_data, setProducts_data] = useState(products);
    //
    // useEffect(() => {
    //     setProducts_data(products)
    // }, [products]);

    const productsContext = useProductsContext();
    const [products, setProducts] = useState(productsContext);

    useEffect(() => {
        setProducts(productsContext);
    }, [productsContext]);

    console.log(products)

    return (
        <div className="shop">
            <div style={{margin: '50px'}}>
                Produkty:
                {products.map((product) => (
                    <div key={product.id}>
                        <p>{product.name}</p>
                        <img src={product.image} alt={product.name} style={{width: '100px'}}/>


                    </div>
                ))}
            </div>
            <div className="products">
                {PRODUCTS.map((product) => (

                        <Product data={product} key={product.id}/>

                ))}
            </div>
        </div>
    );
};

export default Shop;
