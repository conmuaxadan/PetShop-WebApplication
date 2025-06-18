import axios from "axios";
import {toast} from "react-toastify";
import {jwtDecode} from "jwt-decode";

class AuthService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/identity/auth",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
    }

    async loginSocial(user){
        try{
            const response = await this.api.post("/log-in-social", user);
            return response.data?.data;
        }
        catch(error){
            toast.error(error.message, { position: "top-right" });
        }
    }
    async refreshToken(token){
        try{
            const response = await this.api.post("/refresh", token);
            return response.data?.data.token;
        }
        catch(error){
            toast.error(error.message, { position: "top-right" });
        }
    }

    async login(email, password) {
        try {
            const response = await this.api.post("/log-in", { email, password });
           if(response.status !== 200){
               toast.error(response.data.message, { position: "top-right" });
               return false;
           }
            return response.data?.data;
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data?.message, { position: "top-right" });
            } else {
                toast.error("Lỗi server. Vui lòng thử lại sau.", { position: "top-right" });
            }
            return false;
        }
    }
    checkExpiredToken(token){
        if(token){
            return  new Date(token.exp * 1000) < new Date();
        }
        return true;
    }
    async logout(token) {
        try {
            await this.api.post("/log-out",token);
            localStorage.removeItem('user');
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    }
}

export default new AuthService();
