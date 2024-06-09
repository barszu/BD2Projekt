import React, {useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {ShoppingCart} from "phosphor-react"
import {CartContext} from "../context/cartContext.jsx";
import "./navbar.css";
import { useAuth } from '../context/authContext.jsx';
//phosphor-react to biblioteka ikonek

const Navbar = () => {

    const { cartItems, getTotalCartItems } = useContext(CartContext)

    const { isLoggedIn, login, logout } = useAuth();

    return (
        <div className="navbar">
            <Link to="/"><div className="navbar-brand">eBazarek Andrzej</div></Link>
            <div className="links">
                <Link to="/">Bazarzysko</Link>
                {isLoggedIn ? (
                    <>
                        <Link to="/" onClick={logout}>Wyloguj się</Link>
                        <Link to="/cart">
                            <ShoppingCart size={32}/>
                        </Link>
                        <p className="item-no">({getTotalCartItems()})</p>
                    </>
                ) : (
                    <Link to="/login">Zaloguj się</Link>
                )}
            </div>
        </div>
    );
}

export default Navbar;