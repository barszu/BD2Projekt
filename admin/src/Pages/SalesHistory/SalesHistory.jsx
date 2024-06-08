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
        <div className='salesHistory bg-gray-100 p-6 rounded-lg w-full max-w-screen-lg mx-auto'>
            <h1 className='text-2xl font-bold mb-4'>SalesHistory {id}</h1>
            <h1 className='text-xl font-semibold mb-2'>ProductData</h1>

            <div className="flex items-center space-x-4 bg-white p-8 rounded-lg shadow-md">
                <img src={productData.imageUrl} alt={productData.name} className="w-20 h-20 object-cover rounded"/>
                <div>
                    <p>name:</p>
                    <p>quantity:</p>
                    <p>price:</p>
                    <p>available:</p>
                    <p>mainDescription:</p>
                    <p>paragraphDescription:</p>
                </div>
                <div>
                    <p className='font-medium'>{productData.name}</p>
                    <p>{productData.quantity}</p>
                    <p>{productData.price}</p>
                    <p>{productData.available.toString()}</p>
                    <p>{productData.productDetails.mainDescription}</p>
                    <p>{productData.productDetails.paragraphDescription}</p>
                </div>
            </div>
            <hr className='my-4'/>
            <h1 className='text-xl font-semibold mb-2'>SalesHistory</h1>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between border-b-2 border-gray-200 pb-2 mb-2">
                    <p className='font-medium'>Quantity</p>
                    <p className='font-medium'>Price</p>
                    <p className='font-medium'>Date</p>
                </div>
                {salesHistory.map((sale, idx) => {
                    return (
                        <div key={idx} className="flex justify-between border-b-2 border-gray-200 py-2">
                            <p>{sale.quantity}</p>
                            <p>{sale.price}</p>
                            <p>{new Date(sale.date).toLocaleString()}</p>
                        </div>
                    )
                })}
            </div>
            <h1 className='text-xl font-semibold my-4'>Total</h1>
            <p className='text-lg'>{JSON.stringify(total)}</p>
        </div>
    );
}

export default SalesHistory