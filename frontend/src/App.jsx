import { BrowserRouter, Routes , Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar.jsx'
import Shop from "./pages/shop/shop.jsx";
import Cart from "./pages/cart/cart.jsx";
import Login from './pages/login/login.jsx';
import ProductPage from './pages/products/ProductPage.jsx';
import {ShopContextProvider} from "./context/cartContext.jsx";
import { AuthProvider } from './context/authContext.jsx';
import { ProductsProvider} from "./context/productsContext.jsx";

function App() {
    return (
        <div className="App">
            <ProductsProvider>
                <AuthProvider>
                    {/*<ShopContextProvider>*/}
                        <BrowserRouter>
                            <Navbar />
                            {/*navbars bedzie widoczne w kazdej stronie*/}
                            <Routes>
                                <Route path="/" element={<Shop/>} />
                                <Route path="/cart" element={<Cart/>} />
                                <Route path="/login" element={<Login/>} />
                                <Route path="/products/:id" element={<ProductPage />} />


                                <Route path="*" element={<h1>Not Found</h1>} />
                            </Routes>
                        </BrowserRouter>
                    {/*</ShopContextProvider>*/}
                </AuthProvider>
            </ProductsProvider>


        </div>
        // <div className="App">
        //     <ProductsProvider>
        //         <AuthProvider>
        //                 <BrowserRouter>
        //                     <Routes>
        //                         <Route path="/" element={<Shop/>}/>
        //                         <Route path="/cart" element={<Cart/>}/>
        //                         <Route path="/login" element={<Login/>}/>
        //                         <Route path="/products/:id" element={<ProductPage/>}/>
        //
        //
        //                         <Route path="*" element={<h1>Not Found</h1>}/>
        //                     </Routes>
        //                 </BrowserRouter>
        //         </AuthProvider>
        //     </ProductsProvider>
        //
        //
        //
        // </div>

    )

}

export default App
