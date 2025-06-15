import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
    return (

        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar cố định bên trái */}
            <Sidebar />
            <main className="ml-64 flex-1">
                <Outlet /> {/* Hiển thị các route con */}
            </main>
        </div>
    );
};

export default MainLayout;
