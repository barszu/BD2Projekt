import React, {useEffect, useState} from "react";
import {useAuth} from "./authContext.jsx";

//global states -> global varaiables
export const CartContext = React.createContext(null);


export const ShopContextProvider = (props) => {
    const [cart, setCart] = useState([]);

    const fetchCart = async () => {
        const token = localStorage.getItem('auth-token');
        fetch('http://localhost:4000/cart/own', {
            method: 'GET',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
                'user-auth-token': `${token}`
            },
        })
            .then(response => {return response.json();})
            .then(data => {setCart(data.cartData);})
            .catch(err => {console.log("Something went wrong with server... Is it running???" , err);})
    }

    useEffect(() => {
        fetchCart();
    }, []);

    const getTotalCartItems = () => {
        return cart.length;
    }

    const updateCart = async (cartItem) => {
        const token = localStorage.getItem('auth-token');
        fetch('http://localhost:4000/cart/updateone', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
                'user-auth-token': `${token}`
            },
            body: JSON.stringify({
                cartProductData : {
                    productId: cartItem.productId,
                    quantity: cartItem.quantity
                }
            })
        })
            .then(response => {return response.json();})
            .then(data => {setCart(data.newCart);console.log("Cart updated successfully");})
            .catch(err => {console.log("Something went wrong with server... Is it running???" , err);})
    }

    const addToCart = (productId) => {
        const currentItem = cart.find((item) => item.productId === productId);
        if (currentItem) {
            updateCart({productId: productId, quantity: currentItem.quantity + 1});
        } else {
            updateCart({productId: productId, quantity: 1});
        }

    }

    const removeFromCart = (productId) => {
        const currentItem = cart.find((item) => item.productId === productId);
        if (currentItem) {
            updateCart({productId: productId, quantity: currentItem.quantity - 1});
        }
    }

    const removeCompletelyFromCart = (productId) => {
        const currentItem = cart.find((item) => item.productId === productId);
        if (currentItem) {
            updateCart({productId: productId, quantity: 0});
        }
    }

    const setCartItemCount = (count, productId) => {
        const currentItem = cart.find((item) => item.productId === productId);
        if (currentItem) {
            updateCart({productId: productId, quantity: count});
        }
    }

    const getQuantity = (productId) => {
        const currentItem = cart.find((item) => item.productId === productId);
        if (currentItem) {
            return currentItem.quantity;
        }
        return null;
    }

    // console.log(cartItems)

    const contextValue = {
        cartItems: cart,
        addToCart,
        removeFromCart,
        removeCompletelyFromCart,
        setCartItemCount,
        getTotalCartItems,
        getQuantity
    }

    return <CartContext.Provider value={contextValue}>{props.children}</CartContext.Provider>//provider -> track of all data, organize logic
}

