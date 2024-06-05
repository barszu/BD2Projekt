import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

import {CartContext} from "../../context/cartContext.jsx";
import CartItem from "./CartItem.jsx";
import "./cart.css"

const Cart = () => {

    const {cartItems} = useContext(CartContext);
    const navigate = useNavigate();

    const [allProducts, setAllProducts] = useState([]);

    const fetchProducts = async () => {
        await fetch("http://localhost:4000/products/list")
            .then((response) => response.json())
            .then((data) => {
                setAllProducts(data);
                console.log("pobrano produkty wszystkie")
            })
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        let total = 0;
        for (let item of cartItems) {
            const ProductData = allProducts.find((product) => product._id === item.productId);
            if (ProductData) {
                total += ProductData.price * item.quantity;
            }
        }
        setTotalAmount(total.toFixed(2));
    }, [allProducts, cartItems]);

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
                        const ProductData = allProducts.find((product) => product._id === item.productId);
                        return <CartItem key={item.productId} data={
                            {
                                ...ProductData,
                                quantity: item.quantity
                            }
                        }/>
                    })
                }
            </div>
            {cartItems.length ?
                <div className="checkout-correct">
                    <p> Podsumowanie: {totalAmount} zł</p>
                    <button onClick={() => navigate("/")}> Kontynuuj Zakupy</button>
                    <button onClick={() => alert("zaplacono, ale nic sie nie stalo")}> Zapłać</button>
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