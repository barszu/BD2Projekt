import React, {useEffect, useState} from 'react';
import {CartContext} from "../../context/cartContext.jsx";

const CartItem = (props) => {

    const ProductData = props.data;
    const {addToCart , removeFromCart , removeCompletelyFromCart , cartItems , setCartItemCount} = React.useContext(CartContext);

    const [inputValue, setInputValue] = useState(ProductData.quantity);

    useEffect(() => {
        setInputValue(ProductData.quantity);
    } , [ProductData.quantity]);

    return (
        <div className="cartItem">
            <img src={ProductData.imageUrl} alt={ProductData.name}></img>
            <div className="description">
                <p className="product-name">{ProductData.name}</p>
                <p className="product-price">{ProductData.price} zł</p>
                <div className="countHandler">
                    <button className="countHandler-button" onClick={() => removeFromCart(ProductData._id)}>-</button>

                    {/*<input value={cartItems[id]} onChange={(event) => {setCartItemCount(Number(event.target.value) , id)}}/>*/}

                    <input className= "changer"
                        value={inputValue}
                        onKeyDown={(event) => {
                            if ( event.key === 'Enter' && event.target.value.length > 0) {
                                setCartItemCount(Number(event.target.value) , ProductData._id)
                            }
                        }}
                        onChange={(event) => {
                            setInputValue(event.target.value); //to new value
                        }}
                        onBlur={(event) => {
                            setInputValue(ProductData.quantity); //to default value
                        }}
                    />

                    <button className="countHandler-button" onClick={() => {addToCart(ProductData._id)}}>+</button>
                    <button className="removal-button" onClick={() => {removeCompletelyFromCart(ProductData._id)}}>Usuń</button>
                </div>



            </div>
        </div>)

}

export default CartItem;