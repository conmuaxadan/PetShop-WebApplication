import { Outlet } from "react-router-dom";
import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";

const MainLayout = () => {
    return (

        <div>
            <Header/>
            <Outlet/>
            <Footer/>
        </div>
    );
};

export default MainLayout;
