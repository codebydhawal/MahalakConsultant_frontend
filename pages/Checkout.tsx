import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddressService from "../services/AddressService";
import CommerceService from "../services/CommerceService";
import OrderService from "../services/OrderService";
import { AddressResponse } from "../services/Address";
import { CheckoutPreviewResponse, PaymentMethod } from "../services/Commerce";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearCartState } from "../slices/cartSlice";

const money = (amount = 0) => `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.cart);
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [addressId, setAddressId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [preview, setPreview] = useState<CheckoutPreviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { state: { from: "/cart/checkout" } });
      return;
    }
    AddressService.getAddressesByUser()
      .then(({ data }) => {
        const list = data.data ?? [];
        setAddresses(list);
        setAddressId(list.find((address) => address.defaultAddress)?.addressId ?? list[0]?.addressId ?? "");
      })
      .catch(() => setError("We could not load your saved addresses."))
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    if (!addressId) { setPreview(null); return; }
    setError("");
    CommerceService.previewCheckout({ addressId, couponCode: couponCode.trim() || undefined })
      .then(({ data }) => setPreview(data.data))
      .catch((requestError) => setError(requestError.response?.data?.message ?? "Could not calculate the final amount."));
  }, [addressId, couponCode]);

  const placeOrder = async () => {
    if (!addressId) { setError("Please select a delivery address."); return; }
    try {
      setPlacing(true); setError("");
      const { data } = await OrderService.createOrder({ addressId, paymentMethod, couponCode: couponCode.trim() || undefined });
      dispatch(clearCartState());
      if (paymentMethod === "ONLINE" && data.data.paymentId) {
        navigate("/payment/online", { state: { order: data.data } });
      } else {
        navigate("/order/success", { state: { order: data.data } });
      }
    } catch (requestError: any) {
      setError(requestError.response?.data?.message ?? "Your order could not be placed. Please try again.");
    } finally { setPlacing(false); }
  };

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center font-bold">Loading checkout…</div>;
  if (!cart?.items.length) return <div className="max-w-3xl mx-auto px-4 py-32 text-center"><h1 className="text-3xl font-black">Your cart is empty</h1><Link to="/shop" className="inline-block mt-6 text-amber-700 font-bold">Continue shopping</Link></div>;

  return <main className="max-w-6xl mx-auto px-4 py-32"><h1 className="text-4xl font-black mb-10">Checkout</h1>
    {error && <div className="mb-6 rounded-xl bg-red-50 text-red-700 p-4">{error}</div>}
    <div className="grid lg:grid-cols-3 gap-8"><section className="lg:col-span-2 space-y-7">
      <div className="bg-white rounded-3xl border border-stone-100 p-6"><h2 className="text-xl font-extrabold mb-4">Delivery address</h2>
        {addresses.length ? <div className="space-y-3">{addresses.map((address) => <label key={address.addressId} className={`block p-4 border rounded-2xl cursor-pointer ${addressId === address.addressId ? "border-amber-600 bg-amber-50" : "border-stone-200"}`}><input className="mr-3" type="radio" value={address.addressId} checked={addressId === address.addressId} onChange={() => setAddressId(address.addressId)} />{address.addressLine1}, {address.city}, {address.state} – {address.postalCode} {address.defaultAddress && <span className="ml-2 text-xs font-bold text-amber-700">DEFAULT</span>}</label>)}</div> : <p className="text-stone-500">No address saved. <Link className="text-amber-700 font-bold" to="/profile">Add an address in your profile</Link> to continue.</p>}
      </div>
      <div className="bg-white rounded-3xl border border-stone-100 p-6"><h2 className="text-xl font-extrabold mb-4">Payment method</h2><div className="grid sm:grid-cols-2 gap-3"><label className={`p-4 rounded-2xl border cursor-pointer ${paymentMethod === "COD" ? "border-amber-600 bg-amber-50" : "border-stone-200"}`}><input className="mr-2" type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />Cash on delivery</label><label className={`p-4 rounded-2xl border cursor-pointer ${paymentMethod === "ONLINE" ? "border-amber-600 bg-amber-50" : "border-stone-200"}`}><input className="mr-2" type="radio" checked={paymentMethod === "ONLINE"} onChange={() => setPaymentMethod("ONLINE")} />Online payment</label></div></div>
    </section>
    <aside className="bg-stone-900 text-white rounded-3xl p-7 h-fit"><h2 className="text-2xl font-extrabold mb-5">Order summary</h2><label className="text-sm text-stone-300">Coupon code<input value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} className="mt-2 w-full rounded-xl bg-white/10 px-3 py-3 text-white border border-white/20" placeholder="Optional" /></label><div className="mt-6 space-y-3 text-sm">{[["Products", preview?.productTotal], ["Tax", preview?.taxAmount], ["Discount", -((preview?.ruleDiscountAmount ?? 0) + (preview?.couponDiscountAmount ?? 0))], ["Shipping", preview?.shippingAmount]].map(([label, amount]) => <div className="flex justify-between" key={String(label)}><span className="text-stone-300">{label}</span><span>{money(Number(amount ?? 0))}</span></div>)}<div className="border-t border-white/20 pt-4 flex justify-between text-xl font-extrabold"><span>Total</span><span>{money(preview?.finalAmount ?? 0)}</span></div></div><button disabled={!addresses.length || !preview || placing} onClick={placeOrder} className="w-full mt-7 py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 disabled:bg-stone-600 font-extrabold">{placing ? "Placing order…" : paymentMethod === "ONLINE" ? "Continue to payment" : "Place order"}</button></aside>
    </div></main>;
};
