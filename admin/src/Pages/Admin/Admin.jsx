import React from "react";
import './Admin.css';
import {Routes, Route, Navigate} from "react-router-dom";
import AddProduct from "../AddProduct/AddProduct.jsx";
import ListProduct from "../ListProduct/ListProduct.jsx";
import ListUsers from "../ListUsers/ListUsers.jsx";
import SalesHistory from "../SalesHistory/SalesHistory.jsx";

const Admin = () => {
    return (
        <div className='admin bg-neutral-100 p-20'>
            <div className="block">
                <h1 className="text-lg"><b>Witaj na panelu administratora</b></h1>
            </div>
            <Routes>
                <Route path={'/'} element={<Navigate to="/listproduct" />} />
                <Route path={'/addproduct'} element={<AddProduct />} />
                <Route path={'/listproduct'} element={<ListProduct />} />
                <Route path={'/listusers'} element={<ListUsers />} />
                <Route path={'/salesHistory/:id'} element={<SalesHistory />} />

                <Route path={'*'} element={<h1>404 - Not Found</h1>} />
            </Routes>
        </div>
    );
}


export default Admin;