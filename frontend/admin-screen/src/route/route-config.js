// src/route/route-config.js
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Orders from '../pages/Orders';
import Products from '../pages/products';
import User from '../pages/users';
import Roles from '../pages/roles';
import MainLayout from '../layout/main-layout';
import Profile from '../pages/profile';
import LoginPage from '../pages/login';
import ProtectedRoute from '../utils/ProtectedRoute';
import ForbiddenPage from "../pages/403";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/orders-management"
                    element={
                        <ProtectedRoute>
                            <Orders />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/products-management"
                    element={
                        <ProtectedRoute>
                            <Products />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/users-management"
                    element={
                        <ProtectedRoute>
                            <User />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/roles-management"
                    element={
                        <ProtectedRoute>
                            <Roles />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile-management"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route path="/403" element={<ForbiddenPage/>} />
                <Route index element={<LoginPage />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;