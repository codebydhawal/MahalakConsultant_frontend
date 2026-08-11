import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PaymentService from "../services/PaymentService";
import { OrderResponse } from "../services/Commerce";

export const OnlinePayment: React.FC = () => {
  const navigate = useNavigate();
  const order = (useLocation().state as { order?: OrderResponse } | null)?.order;
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!order?.paymentId) return <main className="max-w-xl mx-auto px-4 py-32 text-center"><h1 className="text-3xl font-black">Payment session unavailable</h1><Link className="mt-6 inline-block text-amber-700 font-bold" to="/shop">Return to shop</Link></main>;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!screenshot) { setError("Please upload your payment screenshot."); return; }
    try {
      setSubmitting(true); setError("");
      await PaymentService.submit(order.paymentId!, transactionId.trim(), screenshot);
      navigate("/order/success", { state: { order, paymentSubmitted: true } });
    } catch (requestError: any) {
      setError(requestError.response?.data?.message ?? "Payment proof could not be submitted. Please try again.");
    } finally { setSubmitting(false); }
  };

  return <main className="max-w-4xl mx-auto px-4 py-28"><div className="grid md:grid-cols-2 bg-white border border-stone-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-stone-200/50"><section className="p-8 md:p-10 bg-stone-900 text-white"><p className="text-amber-400 text-xs font-black tracking-[.2em] uppercase">Secure UPI payment</p><h1 className="mt-3 text-3xl font-black">Pay {`₹${order.finalAmount.toLocaleString("en-IN")}`}</h1><p className="mt-3 text-stone-300 text-sm">Order {order.orderNumber}</p><img className="mt-8 w-full max-w-[280px] rounded-2xl bg-white p-2" src="/payment-qr.jpg" alt="UPI payment QR code" /><p className="mt-4 text-xs text-stone-400">Scan this QR code from any UPI app and complete the payment.</p></section><section className="p-8 md:p-10"><h2 className="text-2xl font-black text-stone-900">Submit payment proof</h2><p className="mt-2 text-sm text-stone-500">Enter the UPI transaction ID and upload the successful-payment screenshot. Our team will verify it.</p>{error && <div className="mt-5 p-3 text-sm rounded-xl bg-red-50 text-red-700">{error}</div>}<form onSubmit={submit} className="mt-7 space-y-5"><label className="block text-sm font-bold text-stone-700">Transaction ID<input required value={transactionId} onChange={(event) => setTransactionId(event.target.value)} className="mt-2 w-full border border-stone-300 rounded-xl px-4 py-3 outline-none focus:border-amber-600" placeholder="e.g. 425678912345" /></label><label className="block text-sm font-bold text-stone-700">Payment screenshot<input required accept="image/*" type="file" onChange={(event) => setScreenshot(event.target.files?.[0] ?? null)} className="mt-2 block w-full text-sm text-stone-500" /></label><button disabled={submitting} className="w-full rounded-xl bg-amber-700 hover:bg-amber-800 disabled:bg-stone-400 py-3.5 text-white font-extrabold">{submitting ? "Submitting…" : "Submit for verification"}</button></form></section></div></main>;
};
