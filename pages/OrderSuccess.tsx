import React from "react";
import { Link, useLocation } from "react-router-dom";
import { OrderResponse } from "../services/Commerce";

export const OrderSuccess: React.FC = () => {
  const state = useLocation().state as { order?: OrderResponse; paymentSubmitted?: boolean } | null;
  const order = state?.order;
  if (!order) return <div className="max-w-3xl mx-auto px-4 py-32 text-center"><h1 className="text-3xl font-black">No order details found</h1><Link to="/shop" className="text-amber-700 font-bold">Go to shop</Link></div>;
  const isOnline = order.paymentMethod === "ONLINE";
  return <main className="max-w-2xl mx-auto px-4 py-32 text-center"><div className="bg-white border border-stone-100 shadow-xl rounded-[2.5rem] p-10"><div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl">✓</div><h1 className="text-3xl font-black">{state?.paymentSubmitted ? "Payment proof submitted" : "Order placed successfully"}</h1><p className="mt-3 text-stone-500">Your order number is <strong className="text-stone-900">{order.orderNumber}</strong>.</p><p className="mt-5 text-lg font-bold">Amount: ₹{order.finalAmount.toLocaleString("en-IN")}</p>{isOnline && <div className="mt-6 text-left p-5 rounded-2xl bg-amber-50 text-amber-900"><strong>Payment verification pending</strong><p className="mt-1 text-sm">We will confirm your order after the payment proof is verified.</p></div>}<div className="mt-8 flex justify-center gap-3"><Link to="/orders" className="px-6 py-3 rounded-xl border border-stone-300 font-bold">My orders</Link><Link to="/shop" className="px-6 py-3 rounded-xl bg-stone-900 text-white font-bold">Continue shopping</Link></div></div></main>;
};
