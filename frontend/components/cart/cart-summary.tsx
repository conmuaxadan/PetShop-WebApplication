import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

interface CartContext {
  getTotalPrice: () => number;
}

const CartSummary: React.FC = () => {
  const { getTotalPrice } = useCart() as CartContext;
  console.log(getTotalPrice());

  const navigate = useNavigate();

  return (
    <div className="border p-6 w-80 shadow-lg bg-white rounded-lg">
      <h2 className="text-xl font-bold border-b pb-2 mb-4">CỘNG GIỎ HÀNG</h2>
      <div className="flex justify-between mb-2">
        <span>Tạm tính:</span>
        <span className="font-bold">{getTotalPrice().toLocaleString()}₫</span>
      </div>
      <div className="flex justify-between mb-4">
        <span>Tổng:</span>
        <span className="font-bold">{getTotalPrice().toLocaleString()}₫</span>
      </div>
      <button onClick={() => navigate("/checkout")} className="w-full bg-black text-white py-2 font-bold rounded">
        TIẾN HÀNH THANH TOÁN
      </button>
      <button className="w-full bg-green-600 text-white py-2 mt-2 flex justify-center items-center rounded">
        <span className="mr-2">🏷️</span> Phiếu ưu đãi
      </button>
      <input type="text" placeholder="Mã ưu đãi" className="w-full border px-3 py-2 mt-2 rounded" />
      <button className="w-full border px-3 py-2 mt-2 rounded">Áp dụng</button>
    </div>
  );
};

export default CartSummary;