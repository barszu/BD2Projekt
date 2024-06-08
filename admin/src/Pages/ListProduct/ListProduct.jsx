import React from "react";
import './ListProduct.css';
import { Link } from "react-router-dom";
import navlogo from "../../assets/navlogo.png";

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
        .then(data => {
            console.log(data);
            return data;
        })
        .then((data) => {
            setAllProducts(data.products);
            setLoading(false);
        })
    }

    React.useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className={"list-product"}>
            <b><h1 className="my-10 text-lg text-red-700">Lista produktów</h1></b>
            <div className={"list-product-allproducts"}>
                <table className="">
                    <thead>
                        <tr>
                            <th className="px-5">Image</th>
                            <th className="px-5">Name</th>
                            <th className="px-5">Quantity</th>
                            <th className="px-5">Price</th>
                            <th className="px-5">Available</th>
                            <th className="px-5">Main <br />Description</th>
                            <th className="px-5">Paragraph <br />Description</th>
                            <th className="px-5">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan="8">Loading...</td></tr> : allProducts.map((product, index) => {
                            return (
                                <>
                                    <tr key={index} className="border-b-2">
                                        <td className="px-5"><img src={product.imageUrl} alt={product.name} className={"list-product-image"} /></td>
                                        <td className="px-5">{product.name}</td>
                                        <td className="px-5">{product.quantity}</td>
                                        <td className="px-5">{product.price}</td>
                                        <td className="px-5">{product.available.toString()}</td>
                                        <td className="px-5">{product.productDetails.mainDescription}</td>
                                        <td className="px-5">{product.productDetails.paragraphDescription}</td>
                                        <td className="px-5">
                                            <Link to={`/salesHistory/${product._id}`} style={{ textDecoration: "none" }}>
                                                <button>
                                                    <div className={"sidebar-item mx-10 bg-neutral-200 px-2 py-1 rounded-md"}>
                                                        <h3>Historia</h3>
                                                    </div>
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                </>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default ListProduct;
