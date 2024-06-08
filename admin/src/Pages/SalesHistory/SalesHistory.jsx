import React from 'react';
import './SalesHistory.css';
import {Link, useParams} from "react-router-dom";

const SalesHistory = () => {
    const { id } = useParams();

    console.log(id)

    const [productData , setProductData] = React.useState(null)
    const [salesHistory , setSalesHistory] = React.useState([])
    const [loading , setLoading] = React.useState(true)
    const [total , setTotal] = React.useState(null)

    const fetchData = async () => {
        await fetch(`http://localhost:4000/salesHistory/get/${id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                return data;
            })
            .then((data) => {
                setProductData(data.product)
                setSalesHistory(data.salesHistory)

            }).then(async () => {
                await fetch(`http://localhost:4000/salesHistory/totalEarned/${id}`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },

                })
                    .then(response => response.json())
                    .then((data) => {
                        console.log(data)
                        setTotal(data.totalEarned)
                        setLoading(false);
                    })
            })
    }

    React.useEffect(() => {
        fetchData().then()
    },[])

    if (loading) {
        return (
            <div className='salesHistory'>
                <h1>loading...</h1>
            </div>
        )
    }


    return (
        <div className='salesHistory'>
            <h1>SalesHistory {id}</h1>
            <h1>ProductData</h1>
            <div className={"list-product-format-main list-product-format"}>
                <img src={productData.imageUrl} alt={productData.name} className={"list-product-image"}/>
                <p>{productData.name}</p>
                <p>{productData.quantity}</p>
                <p>{productData.price}</p>
                <p>{productData.available.toString()}</p>
                <p>{productData.productDetails.mainDescription}</p>
                <p>{productData.productDetails.paragraphDescription}</p>
            </div>
            <hr/>
            <h1>SalesHistory</h1>
            <div >
                <div className={"list-product-format-main list-product-format"}>
                    <p>quantity</p>
                    <p>price</p>
                    <p>date</p>
                    <hr/>
                </div>
                {salesHistory.map((sale , idx)=>{
                    return (
                        <>
                            <div key={idx} className={"list-product-format-main list-product-format"}>
                                <p>{sale.quantity}</p>
                                <p>{sale.price}</p>
                                <p>{new Date(sale.date).toLocaleString()}</p>
                            </div>
                            <hr/>
                        </>

                    )
                })}
            </div>
            <h1>Total</h1>
            <p>{JSON.stringify(total)}</p>
        </div>
    );
}

export default SalesHistory