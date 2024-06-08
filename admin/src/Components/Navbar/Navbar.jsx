import React from "react";
import './Navbar.css';
import navlogo from '../../assets/navlogo.png';
import {Link} from "react-router-dom";

const Navbar = () => {
    return (
        <div className='navbar'>
            <h1>Navbar</h1>
            <img src={navlogo} alt='logo' className={"navbar-image"}/>
            <Link to={'/addproduct'} style={{textDecoration: "none"}}>
                <div className={"navbar-item"}>
                    <h3>Add Product</h3>

                </div>
            </Link>
            <Link to={'/listproduct'} style={{textDecoration: "none"}}>
                <div className={"navbar-item"}>
                    <h3>List Product</h3>

                </div>
            </Link>
            <Link to={'/listusers'} style={{textDecoration: "none"}}>
                <div className={"navbar-item"}>
                    <h3>List Users</h3>
                </div>
            </Link>

        </div>
    );
}

export default Navbar;