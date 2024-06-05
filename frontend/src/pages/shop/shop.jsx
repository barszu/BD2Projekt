import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import "./shop.css";
import Product from "./product.jsx";
import { useProductsContext } from "../../context/productsContext.jsx";

const Shop = () => {

    const productsContext = useProductsContext();
    const [products, setProducts] = useState(productsContext);

    useEffect(() => {
        setProducts(productsContext);
    }, [productsContext]);

    console.log(products)

    return (
        <div className="shop">
            <div className="products">
                {products.map((product) => (
                    <Product data={product} key={product._id}/>
                ))}
            </div>
        </div>
    );
};

export default Shop;
