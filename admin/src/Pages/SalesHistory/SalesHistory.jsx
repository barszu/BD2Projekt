import React from 'react';
import './SalesHistory.css';
import {useParams} from "react-router-dom";

const SalesHistory = () => {
    const { id } = useParams();

    console.log(id)

    const [productData , setProductData] = React.useState(null)
    const [salesHistory , setSalesHistory] = React.useState([])
    const [loading , setLoading] = React.useState(true)

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
                setLoading(false);
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
            <p>{JSON.stringify(productData)}</p>
            <br/>
            <h1>SalesHistory</h1>
            <p>{JSON.stringify(salesHistory)}</p>
        </div>
    );
}

export default SalesHistory