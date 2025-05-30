
import './App.css'


import {ToastContainer} from "react-toastify";
import AppRoutes from "./route/route-config.tsx";
import {BrowserRouter} from "react-router-dom";
import {CartProvider} from "./context/CartContext.tsx";
import {UserProvider} from "./context/UserContext.tsx";

function App() {

  return (
      <UserProvider>
          <CartProvider>
              <BrowserRouter>
                  <AppRoutes />
                  <ToastContainer/>
              </BrowserRouter>
          </CartProvider>
      </UserProvider>

  )
}

export default App
