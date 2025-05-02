import { useCart } from "../context/CartContext";
import CartItemComponent from "../components/cart/cart-item"; // Renamed to avoid conflict
import CartSummary from "../components/cart/cart-summary";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
    const { cart, dispatch } = useCart(); // No need for type assertion
    const navigate = useNavigate();

    return (
        <div className="container mx-auto p-6 flex flex-col lg:flex-row gap-4">
            <section
                className="flex-1 bg-white p-6 w-full lg:w-3/4 rounded-lg shadow-lg"
                aria-label="Cart Items"
            >
                <h1 className="text-xl font-bold mb-4">GIỎ HÀNG</h1>
                <div className="flex-grow overflow-y-auto max-h-[400px] pr-2">
                    {cart.length > 0 ? (
                        cart.map(item => <CartItemComponent key={item.id} item={item} />)
                    ) : (
                        <div className="text-gray-600 text-center py-4">
                            <p>Giỏ hàng trống.</p>
                            <button
                                onClick={() => navigate("/")}
                                className="mt-2 text-green-600 hover:underline"
                                aria-label="Continue shopping"
                            >
                                Tiếp tục mua sắm
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row justify-between mt-6 gap-3">
                    <button
                        onClick={() => navigate("/")}
                        className="border border-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition text-center"
                        aria-label="Continue shopping"
                    >
                        ← TIẾP TỤC XEM SẢN PHẨM
                    </button>
                    <button
                        onClick={() => dispatch({ type: "CLEAR_CART" })}
                        className={`px-4 py-2 rounded-lg shadow-md transition w-full sm:w-auto ${
                            cart.length > 0
                                ? "bg-red-400 text-white hover:bg-red-500"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={cart.length === 0}
                        aria-label="Clear entire cart"
                    >
                        XÓA TOÀN BỘ GIỎ HÀNG
                    </button>
                </div>
            </section>

            <section
                className="w-full lg:w-1/4 flex justify-end"
                aria-label="Cart Summary"
            >
                <CartSummary />
            </section>
        </div>
    );
};

export default Cart;