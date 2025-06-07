import { useCart } from "../../context/CartContext";
import React from "react";

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContext {
  dispatch: React.Dispatch<{
    type: string;
    payload: { id: string | number; quantity?: number };
  }>;
}

interface CartItemProps {
  item: CartItem;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { dispatch } = useCart() as CartContext;

  if (!item) return null;

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: newQuantity } });
  };

  const removeItem = () => {
    dispatch({ type: "REMOVE_ITEM", payload: { id: item.id } });
  };

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center border-b py-4 gap-4">
      {/* Nút xóa */}
      <button onClick={removeItem} className="text-red-500 text-xl sm:mr-4">✕</button>

      {/* Ảnh sản phẩm */}
      <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded flex-shrink-0" />

      {/* Thông tin sản phẩm */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-green-600 truncate">{item.name}</p>
        <p className="text-lg font-bold whitespace-nowrap">{item.price.toLocaleString()}₫</p>
      </div>

      {/* Bộ tăng/giảm số lượng */}
      <div className="flex items-center">
        <button
          onClick={() => updateQuantity(item.quantity - 1)}
          className="border px-3 py-1 sm:px-4 bg-gray-200 rounded">
          -
        </button>
        <input
          type="text"
          value={item.quantity}
          readOnly
          className="w-12 text-center border mx-1 rounded"
        />
        <button
          onClick={() => updateQuantity(item.quantity + 1)}
          className="border px-3 py-1 sm:px-4 bg-gray-200 rounded">
          +
        </button>
      </div>

      {/* Tổng giá tiền */}
      <p className="font-bold text-right">{(item.price * item.quantity).toLocaleString()}₫</p>
    </div>
  );
};

export default CartItem;