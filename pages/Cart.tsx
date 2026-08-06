
import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState, MouseEvent } from "react";
import CartService from "../services/CartService";
import { CartSummaryResponse } from "../services/CartSummaryResponse";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setCart,
  setCartLoading,
  setCartError,
  clearCartState,
} from "../slices/cartSlice";


interface CartProps {
  refreshCartSummary: () => Promise<void>;
}

export const Cart: React.FC = () => {
  const dispatch = useAppDispatch();

  const cartSummary = useAppSelector(
    (state) => state.cart.cart
  );

  const loading = useAppSelector(
    (state) => state.cart.loading
  );

  const loadCart = async () => {
    try {
      dispatch(setCartLoading(true));

      const response = await CartService.getCart();

      dispatch(setCart(response.data.data));

    } catch (error) {
      console.error(error);
      dispatch(setCartError("Failed to load cart."));
    }
  };
  useEffect(() => {
    loadCart();
  }, []);

  const proceedToCheckout = () => {
    console.log("Proceed to Checkout");
    // navigate("/checkout");
  };

  const updateQuantity = async (cartId: string, quantity: number) => {
    try {
      // Prevent quantity from going below 1
      if (quantity < 1) {
        return;
      }
      const response = await CartService.updateCart(cartId, quantity);

      dispatch(setCart(response.data.data));
    } catch (error) {
      console.error(error);
      dispatch(setCartError("Failed to update cart item."));
    }
  };

  const removeFromCart = async (cartId: string) => {
    try {
      const response = await CartService.deleteCart(cartId);

      dispatch(setCart(response.data.data));
    } catch (error) {
      console.error(error);
      dispatch(setCartError("Failed to remove item from cart."));
    }
  };

  const clearCart = async () => {
    try {
      const response = await CartService.clearCart();

      if (
        response.data.data &&
        response.data.data.items.length > 0
      ) {
        dispatch(setCart(response.data.data));
      } else {
        dispatch(clearCartState());
      }

    } catch (error) {
      console.error(error);
      dispatch(setCartError("Failed to clear cart."));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        Loading...
      </div>
    );
  }

  if (!loading && (!cartSummary || cartSummary.items.length === 0)) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-basket-shopping text-3xl text-stone-300"></i>
        </div>
        <h2 className="text-3xl font-bold text-stone-900 mb-4">Your bag is empty</h2>
        <p className="text-stone-500 mb-10">Look like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="px-8 py-4 bg-amber-700 text-white rounded-xl font-bold hover:bg-amber-800 transition-all">
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-16">
        <h1 className="text-5xl font-extrabold tracking-tighter">Your Bag.</h1>
        <p className="text-stone-400 font-bold uppercase text-[10px] tracking-[0.3em]">No Cookies • Encrypted Connection</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          {cartSummary?.items.map((item) => (
            <div
              key={item.cartId}
              className="flex gap-8 p-8 bg-white border-2 border-stone-50 rounded-[2.5rem] group hover:border-amber-100 transition-all"
            >
              <div className="w-32 h-32 bg-stone-50 rounded-[1.5rem] overflow-hidden shrink-0 shadow-inner">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="flex-grow flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-2xl text-stone-900 mb-1">
                    {item.product.name}
                  </h3>

                  <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                    {item.product.category}
                  </p>

                  <div className="flex items-center gap-6 bg-stone-50 self-start px-4 py-2 rounded-2xl border border-stone-100">
                    <button
                      onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                      className="text-stone-400 hover:text-stone-900 transition-colors"
                    >
                      <i className="fa-solid fa-minus text-xs"></i>
                    </button>

                    <span className="text-base font-extrabold w-6 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                      className="text-stone-400 hover:text-stone-900 transition-colors"
                    >
                      <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>

                <div className="mt-6 md:mt-0 text-right">
                  <p className="font-extrabold text-2xl text-stone-900">
                    ₹{item.subTotal.toLocaleString()}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline mt-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="bg-white p-12 rounded-[3.5rem] border-2 border-stone-50 h-fit space-y-8 sticky top-32 shadow-2xl shadow-stone-100">
          <h2 className="text-2xl font-extrabold tracking-tight">Summary</h2>
          <div className="space-y-6 text-sm">
            <div className="flex justify-between text-stone-500 font-medium">
              <span>Subtotal</span>
              <span className="font-bold text-stone-900">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-stone-500 font-medium">
              <span>GST (18%)</span>
              <span className="font-bold text-stone-900">₹{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500 font-medium">Delivery</span>
              <span className="px-3 py-1 bg-green-50 text-green-600 text-[9px] font-bold uppercase rounded-lg">Complimentary</span>
            </div>
            <div className="pt-6 border-t-2 border-stone-50 flex justify-between text-3xl font-extrabold text-stone-900">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div> */}

        <div className="pt-8 space-y-6">
          <button
            onClick={clearCart}
            className="w-full py-4 border-2 border-red-500 text-red-500 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all"
          >
            Clear Cart
          </button>
          <button
            onClick={proceedToCheckout}
            className="w-full py-6 bg-stone-900 text-white font-extrabold rounded-[2rem] hover:bg-black transition-all shadow-xl shadow-stone-200"
          >
            Proceed To Checkout
          </button>
          <div className="flex flex-col items-center gap-4 pt-4">
            <p className="text-[9px] font-extrabold text-stone-300 uppercase tracking-[0.3em]">We Accept</p>
            <div className="flex gap-4 opacity-40 grayscale">
              <i className="fa-brands fa-cc-visa text-2xl"></i>
              <i className="fa-brands fa-cc-mastercard text-2xl"></i>
              <i className="fa-solid fa-qrcode text-2xl"></i>
            </div>
          </div>
          <p className="text-[9px] text-center text-stone-400 font-medium leading-relaxed">
            <i className="fa-solid fa-shield-halved mr-1 text-amber-700"></i> No banking data is stored on this server. Your privacy is our priority.
          </p>
        </div>
      </div>
    </div>
  );
};
