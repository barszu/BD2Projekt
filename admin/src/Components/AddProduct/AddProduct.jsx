import React from "react";
import './AddProduct.css';
import navlogo from '../../assets/navlogo.png';
const AddProduct = () => {
    const [image, setImage] = React.useState(false);

    const [product, setProduct] = React.useState({
        name: "",
        quantity: "",
        price: "",
        available: "",
        productDetails: {
            mainDescription: "",
            paragraphDescription: "",
        },
        image: "",
        imageUrl: "",
    });

    const imageHandler = (event) => {
        const file = event.target.files[0];
        setImage(file);
        setProduct(prevProduct => ({
            ...prevProduct,
            image: file
        }));
    }

    const productHandler = (event) => {
        setProduct({
            ...product,
            [event.target.name]: event.target.value
        });
    }

    const productDetailsHandler = (event) => {
        setProduct({
            ...product,
            productDetails: {
                ...product.productDetails,
                [event.target.name]: event.target.value
            }
        });
    }

    const addProduct = async () => {
        let responseData;
        let productData = product;
        console.log('productData', productData);

        let formData = new FormData();
        formData.append('product', productData.image);

        await fetch('http://localhost:4000/upload', {
            method: 'POST',
            headers: {Accept: 'application/json',},
            body: formData,
        })
            .then(response => response.json())
            .then((data) => {responseData = data;})

        if (responseData.success) { //zostalo zapisane na serwerze
            productData.image = responseData.path;
            productData.imageUrl = responseData.path;

            console.log('productData', productData);
            await fetch('http://localhost:4000/products/add', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newProduct: productData
                }),
            })
                .then(response => response.json())
                .then((data) => {
                    if (data.success) {
                        alert('Product Added');
                    }
                    else {
                        alert('Product not added FAILED');
                    }
                })
        }
    }


    return (
        <div className={"add-product"}>
            <div className={"addproduct-itemfield"}>
                <p>Product Name</p>
                <input value={product.name} onChange={productHandler} type={"text"} name={"name"}
                       placeholder={'input for name'}/>
            </div>
            <div className={"addproduct-price"}>
                <p>Product Price</p>
                <input value={product.price} onChange={productHandler} type={"number"} name={"price"}
                       placeholder={'input for price'}/>
            </div>
            <div className={"addproduct-price"}>
                <p>Product Quantity</p>
                <input value={product.quantity} onChange={productHandler} type={"number"} name={"quantity"}
                       placeholder={'input for quantity'}/>
            </div>
            <div className={"add-product-item-field"}>
                <p>Product Availability</p>
                <select value={product.available} onChange={productHandler} name={"available"}
                        className={"add-product-selector"}>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                </select>
            </div>
            <div className={"add-product-item-field"}>
                <label htmlFor={"file-input"}>
                    <img src={image ? URL.createObjectURL(image) : navlogo} className={"add-product-thumnail-img"}
                         alt='logo2'/>
                    <p>klliknij mnie zeby dodac zdjecie!</p>
                </label>
                <input onChange={imageHandler} type={"file"} name={"image"} id={"file-input"} hidden/>
            </div>
            <div className={"addproduct-itemfield"}>
                <p>Product MainDescription</p>
                <input value={product.productDetails.mainDescription} onChange={productDetailsHandler} type={"text"} name={"mainDescription"}
                       placeholder={'input for main description'}/>
            </div>
            <div className={"addproduct-itemfield"}>
                <p>Product ParagraphDescription</p>
                <input value={product.productDetails.paragraphDescription} onChange={productDetailsHandler} type={"text"} name={"paragraphDescription"}
                       placeholder={'input for paragraph description'}/>
            </div>

            <button onClick={() => {
                addProduct().catch(error => alert("blad jakis" + error.message))
            }} className={"add-product-btn"}>Add Product
            </button>

        </div>
    );
}

export default AddProduct;