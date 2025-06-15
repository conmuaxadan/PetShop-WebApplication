import { Routes, Route } from 'react-router-dom';
import Home from "../pages/home.js";
import MainLayout from "../layout/main-layout.tsx";
import OrderHistory from "../pages/order-history.tsx";
import Profile from "../pages/profile.tsx";
import ProductDetail from '../pages/product-detail.tsx';
import Login from '../pages/login.tsx';
import Register from '../pages/register.tsx';
import Product from '../pages/productList.tsx';
import Cart from "../pages/cart.tsx";
import Checkout from "../pages/checkout.tsx";
import PaymentResult from "../pages/payment-result.tsx";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="home" element={<Home />} />
                <Route path="order-history" element={<OrderHistory />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout/>} />
                <Route path="profile" element={<Profile />} />
                <Route path="payment-result" element={<PaymentResult/>} />
                <Route path="product-detail/:id" element={<ProductDetail />} />
                <Route path="productList" element={<Product />} />
            </Route>

            {/* Các route nằm ngoài layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
};

export default AppRoutes;
