import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import authService from "../services/auth-service";

// Định nghĩa interface cho user
interface User {
    token: string;
    [key: string]: any;
}

// Định nghĩa interface cho context
interface UserContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Hàm đăng nhập
    const login = (userData: User): void => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    // Hàm đăng xuất
    const logout = async (): Promise<void> => {
        const user = JSON.parse(localStorage.getItem("user") || "null") as User | null;
        if (user) {
            await authService.logout(user.token);
        }
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};