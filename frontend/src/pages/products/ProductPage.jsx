import React, {useContext, useEffect, useState} from 'react';
import { CartContext } from "../../context/cartContext.jsx";
import './product-page.css';
import {useParams} from "react-router-dom";
import { useAuth } from '../../context/authContext.jsx';
import {useProductsContext} from "../../context/productsContext.jsx";

const ProductPage = () => {

    const {products} = useProductsContext();


    const { id } = useParams();
    const product = products.find((product) => product._id === id);
    const { addToCart , cartItems , removeFromCart , removeCompletelyFromCart  } = useContext(CartContext)
    const { isLoggedIn, login, logout } = useAuth();

    console.log(products);
    return (
        <div className="p-box">
            <div className="p-info">
                <div className="p-left-details">
                    <h2>{product.name}</h2>
                    <img src={product.imageUrl} alt={product.name}/>
                </div>
                <div className="p-pricing">
                    <div className="p-right-details">
                        <p className="p-price">Cena: ${product.price.toFixed(2)}</p>
                        <p>{product.productDetails.mainDescription}</p>
                        <p>{product.productDetails.paragraphDescription}</p>
                    </div>
                    <div className="p-bttn-section">
                        {isLoggedIn && (
                            <>
                                <button className="p-addToCartBttn" onClick={() => addToCart(product._id)}>
                                    Dodaj do koszyka!
                                </button>
                                <button className="p-removeOneFromCartBttn" onClick={() => removeFromCart(product._id)}>
                                    Usuń z koszyka jedną sztuke!
                                </button>
                                <button className="p-removeCompletlyFromCartBttn" onClick={() => removeCompletelyFromCart(product._id)}>
                                    Usuń z koszyka wszystkie sztuki!
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </div>

        </div>
    );
};


export default ProductPage;
