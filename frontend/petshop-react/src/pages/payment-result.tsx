import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import OrderService from "../services/order-service";
import { CartActionTypes, useCart } from "../context/CartContext";
import { toast } from "react-toastify";

// Define interfaces for context and order data if needed
interface CartContext {
  dispatch: React.Dispatch<{ type: string; payload?: any }>;
}

const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { dispatch } = useCart() as CartContext;
  const [status, setStatus] = useState<"success" | "failed" | null>(null);
  const hasProcessed = useRef<boolean>(false);

  useEffect(() => {
    const processPaymentResult = async () => {
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      const paymentStatus = searchParams.get("status");
      const orderData = localStorage.getItem("order");

      if (paymentStatus === "success" && orderData) {
        try {
          setStatus("success");
          // const order = JSON.parse(orderData);
          toast.info("Đơn hàng đang được xử lí!", { position: "top-right" });
          await OrderService.createOrder(orderData);
          toast.success("Đặt hàng thành công!", { position: "top-right" });
          dispatch({ type: CartActionTypes.CLEAR_CART });
        } catch (error) {
          console.error("Lỗi khi tạo đơn hàng:", error);
          setStatus("failed");
        }
      } else {
        setStatus("failed");
      }

      localStorage.removeItem("order");
    };

    processPaymentResult();

    const timer = setTimeout(() => navigate("/"), 5000);
    return () => clearTimeout(timer);
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="text-center mt-10">
      {status === "success" ? (
        <h2 className="text-green-500 text-2xl font-bold">Thanh toán thành công!</h2>
      ) : (
        <h2 className="text-red-500 text-2xl font-bold">Thanh toán thất bại!</h2>
      )}
      <p>Đang quay về trang chủ...</p>
    </div>
  );
};

export default PaymentResult;