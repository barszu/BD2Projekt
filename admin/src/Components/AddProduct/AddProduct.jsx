import React from "react";
import './AddProduct.css';
import navlogo from '../../assets/navlogo.png';
const AddProduct = () => {
    const [image, setImage] = React.useState(false);

    const [product, setProduct] = React.useState({
        name: "",
        old_price: "",
        new_price: "",
        category: "",
        image: ""
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
            console.log('productData', productData);
            await fetch('http://localhost:4000/addproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
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
                <input value={product.name} onChange={productHandler} type={"text"} name={"name"} placeholder={'input for name'}/>
            </div>
            <div className={"addproduct-price"}>
                <p>Product Old Price</p>
                <input value={product.old_price} onChange={productHandler} type={"number"} name={"old_price"} placeholder={'input for old_price'}/>
            </div>
            <div className={"addproduct-price"}>
                <p>Product new Price</p>
                <input value={product.new_price} onChange={productHandler} type={"number"} name={"new_price"} placeholder={'input for new_price'}/>
            </div>
            <div className={"add-product-item-field"}>
                <p>Product Category</p>
                <select value={product.category} onChange={productHandler} name={"category"} className={"add-product-selector"}>
                    <option value={"electronics"}>Electronics</option>
                    <option value={"fashion"}>Fashion</option>
                    <option value={"grocery"}>Grocery</option>
                    <option value={"appliances"}>Appliances</option>
                    <option value={"sports"}>Sports</option>
                    <option value={"books"}>Books</option>
                </select>
            </div>
            <div className={"add-product-item-field"}>
                <label htmlFor={"file-input"}>
                    <img src={image?URL.createObjectURL(image):navlogo} className={"add-product-thumnail-img"} alt='logo2' />
                    <p>klliknij mnie zeby dodac zdjecie!</p>
                </label>
                <input onChange={imageHandler} type={"file"} name={"image"} id={"file-input"} hidden/>
            </div>
            <button onClick={()=>{addProduct().catch(error => alert("blad jakis" + error.message))}} className={"add-product-btn"}>Add Product</button>

        </div>
    );
}

export default AddProduct;