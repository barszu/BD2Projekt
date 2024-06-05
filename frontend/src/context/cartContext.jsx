import React, {useState} from "react";
import {useAuth} from "./authContext.jsx";

//global states -> global varaiables
export const CartContext = React.createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let i = 0; i < PRODUCTS.length; i++) {
        cart[i] = 0;
    }
    return cart
}
export const ShopContextProvider = (props) => {
    //TODO: add clound synschronization -> update cartItems in DB for user
    const {isLoggedIn} = useAuth();

    // cartItems = obj{ itemId:noOfItem }
    const [ cartItems , setCartItems ] = useState(getDefaultCart());

    const syncCart = () => { //TODO: chyba za duzy masochizm
        if (!isLoggedIn){
            alert("You need to be logged in to sync cart!")
        }
        const token = localStorage.getItem('auth-token');
        fetch('http://localhost:4000/updatecart', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
                'auth-token': `${token}`
            },
            body: JSON.stringify({
                cartItems
            }),
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
        }).catch(err => {
            console.log("Something went wrong with server... Is it running???" , err);
        })

    }

    const getTotalCartAmount = () => {
        let total = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0){
                const itemInfo = PRODUCTS.find((product) => product.id === Number(item));
                total += itemInfo.price * cartItems[item];
            }
        }
        return total;
    }

    const getTotalCartItems = () => {
        let total = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0){
                total += cartItems[item];
            }
        }
        return total;
    }

    const addToCart = (itemId) => {
        setCartItems((prev) => {
            return ({...prev , [itemId]: prev[itemId] + 1})
        })
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            return ({...prev , [itemId]: prev[itemId] - 1})
        })
    }

    const clearCart = () => {
        setCartItems(getDefaultCart());
    }

    const removeCompletelyFromCart = (itemId) => {
        setCartItems((prev) => {
            return ({...prev , [itemId]: 0})
        })
    }

    const setCartItemCount = (count , itemId ) => {
        setCartItems((prev) => {
            return ({...prev , [itemId]: count})
        })
    }

    // console.log(cartItems)

    const contextValue = {
        cartItems ,
        addToCart ,
        removeFromCart ,
        clearCart ,
        removeCompletelyFromCart ,
        setCartItemCount ,
        getTotalCartAmount ,
        getTotalCartItems,
        syncCart
    }

    return <CartContext.Provider value={contextValue}>{props.children}</CartContext.Provider>//provider -> track of all data, organize logic
}

