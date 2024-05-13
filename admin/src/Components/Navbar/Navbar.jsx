import React from "react";
import './Navbar.css';
import navlogo from '../../assets/navlogo.png';

const Navbar = () => {
    return (
        <div className='navbar'>
            <h1>Navbar</h1>
            <img src={navlogo} alt='logo' />
            <img src={'../../assets/navlogo.png'} alt='logo2' />
        </div>
    );
}

export default Navbar;