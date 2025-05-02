import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ShoppingCart } from "lucide-react";
import ProfileService from "../services/profile-service";
import PaymentService from "../services/payment-service";
import OrderService from "../services/order-service";
import ShippingService from "../services/shipping-service";
import ShippingInformation from "../components/checkout/ShippingInformation";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderSummary from "../components/checkout/OrderSummary";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
// import { CartItem } from "../types"; // Import CartItem

interface Profile {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    address?: {
        province?: string;
        district?: string;
        ward?: string;
        postalCode?: string;
        hamlet?: string;
    };
}

interface FormData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    province: string;
    district: string;
    ward: string;
    postalCode: string;
    hamlet: string;
    notes: string;
    paymentMethod: string;
}

const Checkout: React.FC = () => {
    const { cart, getTotalPrice,getTotalWeight, dispatch } = useCart();
    const { user } = useUser();
    const navigate = useNavigate();
    const [shippingFee, setShippingFee] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [profileLoading, setProfileLoading] = useState<boolean>(true);

    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        province: "",
        district: "",
        ward: "",
        postalCode: "",
        hamlet: "",
        notes: "",
        paymentMethod: "cod",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            setProfileLoading(true);
            try {
                const profile: Profile = await ProfileService.getMyProfile();

                if (profile) {
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        firstName: profile.firstName || "",
                        lastName: profile.lastName || "",
                        phone: profile.phone || "",
                        email: profile.email || "",
                        province: profile.address?.province || "",
                        district: profile.address?.district || "",
                        ward: profile.address?.ward || "",
                        postalCode: profile.address?.postalCode || "",
                        hamlet: profile.address?.hamlet || "",
                    }));

                    // Check for missing profile fields to notify user
                    const missingFields: string[] = [];
                    if (!profile.firstName) missingFields.push("First Name");
                    if (!profile.lastName) missingFields.push("Last Name");
                    if (!profile.phone) missingFields.push("Phone Number");
                    if (!profile.email) missingFields.push("Email");
                    if (!profile.address?.province) missingFields.push("Province/City");
                    if (!profile.address?.district) missingFields.push("District");
                    if (!profile.address?.ward) missingFields.push("Ward");

                    if (missingFields.length > 0) {
                        toast.warning(
                            `Please update your profile with the following information: ${missingFields.join(", ")}`
                        );
                    }
                }
            } catch (error) {
                console.error("Error loading profile:", error);
                toast.error("Could not load profile information. Please try again later.");
            } finally {
                setProfileLoading(false);
            }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        const calculateShipping = async () => {
            if (!formData.province || !formData.district || !formData.ward) return;

            setLoading(true);
            try {
                const shippingData = {
                    address: `${formData.hamlet}, ${formData.ward}, ${formData.district}, ${formData.province}`,
                    province: formData.province,
                    district: formData.district,
                    ward: formData.ward,
                    value: getTotalPrice(),
                    weight: getTotalWeight(),
                };
                const fee: number | undefined = await ShippingService.getShippingFee(shippingData);
                setShippingFee(fee || 0);
            } catch (error) {
                console.error("Error calculating shipping fee:", error);
                toast.error("Could not calculate shipping fee. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        calculateShipping();
    }, [formData.province, formData.district, formData.ward, cart, getTotalPrice]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const clearCart = () => {
        dispatch({ type: "CLEAR_CART" }); // Replace with CartActionTypes.CLEAR_CART if defined
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user?.id_user) {
            toast.error("Please log in to proceed with the order.", { position: "top-right" });
            navigate("/login");
            return;
        }

        try {
            const orderData = {
                id_user: user.id_user,
                name: `${formData.firstName} ${formData.lastName}`,
                province: formData.province,
                district: formData.district,
                ward: formData.ward,
                hamlet: formData.hamlet || "",
                tel: formData.phone,
                address: `${formData.hamlet}, ${formData.ward}, ${formData.district}, ${formData.province}`,
                pick_money: formData.paymentMethod === "cod" ? getTotalPrice() + shippingFee : 0,
                note: formData.notes || "",
                is_freeship: 0,
                payment_method: formData.paymentMethod,
                totalPrice: getTotalPrice(),
                value: getTotalPrice() + shippingFee,
                weight: getTotalWeight(),
                shipping_fee: shippingFee,
                orderItems: cart.map((item: any) => ({
                    name: item.name ?? "unknown",
                    price: item.price,
                    weight: item.weight,
                    quantity: item.quantity,
                    image: item.image,
                    productCode: item.id ?? "",// variantId
                })),
            };

            if (formData.paymentMethod === "Vnpay") {
                localStorage.setItem("order", JSON.stringify(orderData));
                const paymentUrl = await PaymentService.createPaymentVNPay(getTotalPrice() + shippingFee);
                if (paymentUrl) {
                    window.location.href = paymentUrl;
                } else {
                    toast.error("Failed to initiate VNPay payment.", { position: "top-right" });
                }
            } else {
                toast.info("Đơn hàng đang được xử lí!", { position: "top-right" });
                await OrderService.createOrder(orderData);
                toast.success("Đặt hàng thành công!", { position: "top-right" });
                clearCart();
                navigate("/");
            }
        } catch (error) {
            console.error("Error creating payment:", error);
            toast.error("An error occurred while processing your order. Please try again.", { position: "top-right" });
        }
    };

    const subtotal: number = getTotalPrice();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                    <ShoppingCart className="w-8 h-8" />
                    Checkout
                </h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <ShippingInformation
                            formData={formData}
                            handleChange={handleChange}
                            isLoading={profileLoading}
                        />
                        <PaymentMethod formData={formData} handleChange={handleChange} />
                    </div>

                    <div className="lg:col-span-1">
                        <OrderSummary
                            cart={cart}
                            subtotal={subtotal}
                            shippingFee={shippingFee}
                            loading={loading}
                            formData={formData}
                            handleChange={handleChange}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;