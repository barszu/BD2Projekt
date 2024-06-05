import React, {useContext, useEffect, useState} from "react";
import { CartContext } from "../../context/cartContext.jsx";
import {Link} from "react-router-dom";
import "./product.css";
import { useAuth } from '../../context/authContext.jsx';

const Product = (props) => {
    const { isLoggedIn, login, logout } = useAuth();
    const productData = props.data;
    const { addToCart , cartItems , getQuantity } = useContext(CartContext)

    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        const newQuantity = getQuantity(productData._id);
        if (newQuantity){
            setQuantity(newQuantity);
        }
        else {
            setQuantity(0);
        }
    }, [cartItems]);

    return (
        <div className="product">
            <Link key={productData._id} to={`/products/${productData._id}`}>
                <img src={productData.imageUrl} alt={productData.name}/>
                <div className="product-info">
                    <p className="product-name">{productData.name}</p>
                    <p>{productData.price} zł</p>
                </div>
            </Link>
                {isLoggedIn &&
                    (<button className="addToCartBttn" onClick={() => addToCart(productData._id)}>
                        Dodaj do koszyka! {quantity > 0 && `(${quantity})`}
                    </button>)
                }
        </div>
    )
};

export default Product;
