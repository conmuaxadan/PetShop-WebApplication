import React, { createContext, useContext, useReducer } from "react";
import type { ReactNode, Dispatch } from "react";

export interface CartItem {
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    weight: number;
}

export type CartAction =
    | { type: "ADD_ITEM"; payload: CartItem }
    | { type: "REMOVE_ITEM"; payload: { id: string | number } }
    | { type: "UPDATE_QUANTITY"; payload: { id: string | number; quantity: number } }
    | { type: "CLEAR_CART" };

export interface CartContextType {
    cart: CartItem[];
    dispatch: Dispatch<CartAction>;
    getTotalQuantity: () => number;
    getTotalPrice: () => number;
    getTotalWeight: () => number;
}

const getCartFromStorage = (): CartItem[] => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
};

export const CartActionTypes = {
    ADD_ITEM: "ADD_ITEM",
    REMOVE_ITEM: "REMOVE_ITEM",
    UPDATE_QUANTITY: "UPDATE_QUANTITY",
    CLEAR_CART: "CLEAR_CART",
} as const;

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
    let updatedCart: CartItem[];
    switch (action.type) {
        case CartActionTypes.ADD_ITEM:
            // Check if item with same id already exists
            const existingItem = state.find((item) => item.id === action.payload.id);
            if (existingItem) {
                // Update quantity of existing item
                updatedCart = state.map((item) =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + action.payload.quantity }
                        : item
                );
            } else {
                // Add new item
                updatedCart = [...state, action.payload];
            }
            break;

        case CartActionTypes.REMOVE_ITEM:
            updatedCart = state.filter((item) => item.id !== action.payload.id);
            break;

        case CartActionTypes.UPDATE_QUANTITY:
            updatedCart = state.map((item) =>
                item.id === action.payload.id
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            );
            break;

        case CartActionTypes.CLEAR_CART:
            updatedCart = [];
            break;

        default:
            return state;
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    return updatedCart;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, [], getCartFromStorage);

    // Tính tổng số lượng sản phẩm
    const getTotalQuantity = (): number => {
        return cart.reduce((total, item) => total + item.quantity, 0); // Fixed: Sum item.quantity
    };

    // Tính tổng giá tiền
    const getTotalPrice = (): number => {
        return cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    // Tính tổng trọng lượng
    const getTotalWeight = (): number => {
        return cart.reduce(
            (total, item) => total + item.weight * item.quantity,
            0
        );
    };

    return (
        <CartContext.Provider value={{ cart, dispatch, getTotalQuantity, getTotalPrice, getTotalWeight }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};