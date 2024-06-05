import React from "react";
import './ListProduct.css';

const ListProduct = () => {

    const [allProducts, setAllProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const fetchInfo = async () => {
        await fetch('http://localhost:4000/allproducts', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then((data) => {
                setAllProducts(data);
                setLoading(false);
            })
    }

    React.useEffect(() => {
        fetchInfo();
    }, []);

    const removeProduct = async (productId) => {
        await fetch('http://localhost:4000/removeproduct', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: productId}),
        })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                fetchInfo();
        })
    }


    return (
        <div className={"list-product"}>
            <h1>ListProduct</h1>
            <div className={"list-product-format-main"}>
                <p>Products</p>
                <p>Title</p>
                <p>Old Price</p>
                <p>New Price</p>
                <p>Category</p>
                <p>Remove</p>
            </div>
            <div className={"list-product-allproducts"}>
                <hr/>
                {loading ? <p>Loading...</p> : allProducts.map((product, index) => {
                    return (
                        <>
                            <div key={index} className={"list-product-format-main list-product-format"}>
                                <img src={product.image} alt={product.name} className={"list-product-image"}/>
                                <p>{product.name}</p>
                                <p>{product.old_price}</p>
                                <p>{product.new_price}</p>
                                <p>{product.category}</p>
                                <button onClick={async ()=>{
                                    await removeProduct(product.id);
                                    await fetchInfo();
                                }} className={"list-product-remove"}>Remove</button>
                            </div>
                            <hr/>
                        </>
                    )
                })}
            </div>
        </div>
    );
}
export default ListProduct;