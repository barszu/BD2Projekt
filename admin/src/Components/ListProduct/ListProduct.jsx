import React from "react";
import './ListProduct.css';

const ListProduct = () => {

    const [allProducts, setAllProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const fetchProducts = async () => {
        await fetch('http://localhost:4000/products/list', {
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
        fetchProducts();
    }, []);

    return (
        <div className={"list-product"}>
            <h1>ListProduct</h1>
            <div className={"list-product-format-main"}>
                <p>Products</p>
                <p>Name</p>
                <p>Quantity</p>
                <p>Price</p>
                <p>Available</p>
                <p>MainDescription</p>
                <p>ParagraphDescription</p>
            </div>
            <div className={"list-product-allproducts"}>
                <hr/>
                {loading ? <p>Loading...</p> : allProducts.map((product, index) => {
                    return (
                        <>
                            <div key={index} className={"list-product-format-main list-product-format"}>
                                <img src={product.imageUrl} alt={product.name} className={"list-product-image"}/>
                                <p>{product.name}</p>
                                <p>{product.quantity}</p>
                                <p>{product.price}</p>
                                <p>{product.available.toString()}</p>
                                <p>{product.productDetails.mainDescription}</p>
                                <p>{product.productDetails.paragraphDescription}</p>
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