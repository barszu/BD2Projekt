import React, {useContext} from "react";
import { CartContext } from "../../context/cartContext.jsx";
import {Link} from "react-router-dom";
import "./product.css";
import { useAuth } from '../../context/authContext.jsx';

const Product = (props) => {
    const { isLoggedIn, login, logout } = useAuth();
    const productData = props.data;
    // const { addToCart , cartItems } = useContext(CartContext)
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
                    // (<button className="addToCartBttn" onClick={() => addToCart(productData)}>
                    //     Dodaj do koszyka! {cartItems[id] ? `(${cartItems[id]})` : null}
                    // </button>)
                    (<button className="addToCartBttn" >
                        Dodaj do koszyka!
                    </button>)
                }
        </div>
    )
};

export default Product;
