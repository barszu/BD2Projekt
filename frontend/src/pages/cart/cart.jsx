import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

import {CartContext} from "../../context/cartContext.jsx";
import CartItem from "./CartItem.jsx";
import "./cart.css"

const Cart = () => {

    const {cartItems , sellCart, loadingCart} = useContext(CartContext);
    const navigate = useNavigate();

    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        let total = 0;
        for (let item of cartItems) {
            total += item.quantity * item.productData.price;
        }
        setTotalAmount(Number(total.toFixed(2)));
    }, [cartItems]);

    if (loadingCart) return (<div>Ładowanie...</div>);

    return (
        <div className="cart">
            <div>
                <h1>
                    Twój koszyk:
                </h1>
            </div>
            <div className="cartItems">
                {

                    cartItems.map((item) => {
                        if (item.productData) {
                            return <CartItem key={item.productId} data={
                                {
                                    imageUrl: item.productData.imageUrl,
                                    name: item.productData.name,
                                    price: item.productData.price,
                                    quantity: item.quantity,
                                    productId: item.productId
                                }
                            }/>
                        }
                        return null;
                    })
                }
            </div>
            {cartItems.length ?
                <div className="checkout-correct">
                    <p> Podsumowanie: {totalAmount} zł</p>
                    <button onClick={() => navigate("/")}> Kontynuuj Zakupy</button>
                    <button onClick={() => {
                        sellCart()
                        navigate('/')
                    }}> Zapłać</button>
                </div>

                :
                <div className="checkout">
                    <h1>Twój koszyk jest pusty!</h1>
                    <button onClick={() => navigate("/")}> Kontynuuj Zakupy</button>
                </div>



            }
        </div>
    );
}

export default Cart;