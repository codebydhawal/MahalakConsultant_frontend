import { useState } from "react";
import { CartItem, Product } from "../types";
import { useAppSelector } from "../store/hooks";

const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    const user = useAppSelector((state) => {
      const authState = (state as { auth?: { user?: unknown } }).auth;
      return authState?.user;
    });
    if (!user) {
      alert("Namaste! Please login to your account to add items to the cart.");
      window.location.hash = "#/login";
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
            ...item,
            quantity: Math.max(1, item.quantity + delta),
          }
          : item
      )
    );
  };

  const cartCount = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return {
    cart,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};

export default useCart;