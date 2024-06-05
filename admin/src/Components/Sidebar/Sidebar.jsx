import React from "react";
import './Sidebar.css';
import { Link } from 'react-router-dom';
import navlogo from '../../assets/navlogo.png';

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <h1>Sidebar</h1>
            <Link to={'/addproduct'} style={{textDecoration: "none"}}>
                <div className={"sidebar-item"}>
                    <img src={navlogo} alt='logo2' />
                    <h3>Add Product</h3>

                </div>
            </Link>
            <Link to={'/listproduct'} style={{}}>
                <div className={"sidebar-item"}>
                    <img src={navlogo} alt='logo2' />
                    <h3>List Product</h3>

                </div>
            </Link>
        </div>
    );
}

export default Sidebar;