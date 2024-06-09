import React, {useEffect, useState} from "react";
import {useAuth} from "./authContext.jsx";
import {useProductsContext} from "./productsContext.jsx";

//global states -> global varaiables
export const CartContext = React.createContext(null);


export const ShopContextProvider = (props) => {
    const [cart, setCart] = useState([]);
    const { isLoggedIn, login, logout } = useAuth();
    const { fetchProducts } = useProductsContext();

    const [loadingCart, setLoadingCart] = useState(true);

    const fetchCart =  async () => {
        setLoadingCart(true);
        if (isLoggedIn) {
            const token = localStorage.getItem('auth-token');
            await fetch('http://localhost:4000/cart/own', {
                method: 'GET',
                headers: {
                    Accept: 'application/form-data',
                    'Content-Type': 'application/json',
                    'user-auth-token': `${token}`
                },
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    setCart(data.cartData);
                    console.log("Cart data", data.cartData);
                    setLoadingCart(false);
                })
                .catch(err => {
                    console.log("Something went wrong with server... Is it running???", err);
                })
        }
    }

    useEffect( () => {
        fetchCart();
    }, [isLoggedIn]);


    useEffect(() => {
        console.log("Cart updated", cart);
        console.log("loadingCart", loadingCart);
    }, [cart]);



    const getTotalCartItems = () => {
        let total = 0;
        cart.forEach((item) => {
            total += item.quantity;
        });
        return total;
    }

    const updateCart = (cartItem) => {
        const token = localStorage.getItem('auth-token');
        setLoadingCart(true)
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
            .then(async data => {
                // setCart(data.newCart);
                // console.log("Cart data from update cart", data.newCart);
                await fetchCart();
                setLoadingCart(false);

            })
            .catch(err => {console.log("Something went wrong with server... Is it running???" , err);})
    }

    const addToCart = (productId) => {
        const currentItem = cart.find((item) => item.productId === productId);
        if (currentItem) {
            console.log("Current item", currentItem);
            const newQuantity = currentItem.quantity + 1;
            if (newQuantity > currentItem.productData.quantity) {
                alert("There are no more items available");
                return;
            }
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

    const sellCart = async () => {
        const token = localStorage.getItem('auth-token');
        await fetch('http://localhost:4000/cart/sell', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
                'user-auth-token': `${token}`
            },
        })
            .then(response => {return response.json();})
            .then(data => {
                if (data.success) {
                    fetchCart();
                    fetchProducts();
                    alert("Your order has been placed successfully");
                }
                else if (data.message === 'Cart verification failed'){
                    // wyswietl okno w ktorych uzytkonik zatwierdza zmiane koszyka
                    const userConfirmation = window.confirm('Some products in your cart are no longer available. Do you want to remove them from cart?');
                    if (userConfirmation) {
                        setCart(data.newCart);
                    }
                }
                else {
                    alert("Something went wrong with your order");
                    console.log(data);
                }
            })
            .catch(err => {console.log("Something went wrong with server... Is it running???" , err);})
    }

    // console.log(cartItems)

    const contextValue = {
        cartItems: cart,
        addToCart,
        removeFromCart,
        removeCompletelyFromCart,
        setCartItemCount,
        getTotalCartItems,
        getQuantity,
        sellCart,
        loadingCart
    }

    return <CartContext.Provider value={contextValue}>{props.children}</CartContext.Provider>//provider -> track of all data, organize logic
}

