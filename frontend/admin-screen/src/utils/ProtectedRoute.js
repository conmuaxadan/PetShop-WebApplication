// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import AuthService from '../service/auth-service';
import {toast} from "react-toastify";

function ProtectedRoute({ children }) {
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user || AuthService.checkExpiredToken(user.token)) {
        toast.warn("Vui lòng đăng nhập !")
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default ProtectedRoute;