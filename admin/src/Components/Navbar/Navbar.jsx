import React from "react";
import './Navbar.css';
import navlogo from '../../assets/navlogo.png';
import {Link} from "react-router-dom";

const Navbar = () => {
    return (
        <div className='navbar bg-neutral-900 sticky top-0 z-10'>
            <b><h1>eBazarek Andrzej- <span className="text-red-400">Admin Page</span></h1></b>
            {/* <img src={navlogo} alt='logo' className={"navbar-image"}/> */}
            <Link to={'/addproduct'} style={{textDecoration: "none"}}>
                <div className={"navbar-item"}>
                    <b><h3 className="hover:text-neutral-400 transition">Add Product</h3></b>
                </div>
            </Link>
            <Link to={'/listproduct'} style={{textDecoration: "none"}}>
                <div className={"navbar-item"}>
                    <b><h3 className="hover:text-neutral-400 transition">List Product</h3></b>

                </div>
            </Link>
            <Link to={'/listusers'} style={{textDecoration: "none"}}>
                <div className={"navbar-item"}>
                    <b><h3 className="hover:text-neutral-400 transition">List Users</h3></b>
                </div>
            </Link>
            <div className="w-6"></div>

        </div>
    );
}

export default Navbar;