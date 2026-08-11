import React, { useEffect, useState } from "react";
import { OrderResponse, PaymentResponse } from "../../../services/Commerce";
import OrderService from "../../../services/OrderService";
import PaymentService from "../../../services/PaymentService";
import ProductService from "../../../services/ProductService";
import { ProductResponse } from "../../../services/ProductResponse";

const money = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

export const CommerceAdmin: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
    null
  );
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [orderProducts, setOrderProducts] = useState<
    Record<string, ProductResponse>
  >({});

  const load = () =>
    Promise.all([OrderService.getAllOrders(), PaymentService.getPending()])
      .then(([ordersResult, paymentsResult]) => {
        setOrders(ordersResult.data.data ?? []);
        setPayments(paymentsResult.data.data ?? []);
      })
      .catch((e) =>
        setError(
          e.response?.data?.message ?? "Could not load commerce data."
        )
      );

  useEffect(() => {
    load();
  }, []);

  const verify = async (paymentId: string) => {
    try {
      setBusy(paymentId);
      await PaymentService.verify(paymentId);
      load();
    } catch (e: any) {
      setError(e.response?.data?.message ?? "Payment could not be verified.");
    } finally {
      setBusy("");
    }
  };

  const reject = async (paymentId: string) => {
    const rejectionReason = window.prompt(
      "Reason for rejecting this payment?"
    );

    if (!rejectionReason?.trim()) return;

    try {
      setBusy(paymentId);
      await PaymentService.reject(paymentId, rejectionReason);
      load();
    } catch (e: any) {
      setError(e.response?.data?.message ?? "Payment could not be rejected.");
    } finally {
      setBusy("");
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      setBusy(orderId);
      await OrderService.updateStatus(orderId, status);
      load();

      if (selectedOrder?.orderId === orderId) {
        setSelectedOrder((previous) =>
          previous ? { ...previous, orderStatus: status } : null
        );
      }
    } catch (e: any) {
      setError(e.response?.data?.message ?? "Status could not be updated.");
    } finally {
      setBusy("");
    }
  };

  const viewOrder = async (orderId: string) => {
    try {
      setBusy(orderId);
      setDetailsLoading(true);
      setError("");

      // Admin API - fetch complete order details
      const orderResult = await OrderService.getOrderForAdmin(orderId);

      const fullOrder = orderResult.data.data;

      if (!fullOrder) {
        throw new Error("Order details not found.");
      }

      setSelectedOrder(fullOrder);

      const productIds = [
        ...new Set(
          fullOrder.items?.map((item) => item.productId).filter(Boolean) ?? []
        ),
      ];

      const productResults = await Promise.allSettled(
        productIds.map((productId) =>
          ProductService.getProductById(productId)
        )
      );

      const products: Record<string, ProductResponse> = {};

      productResults.forEach((result) => {
        if (result.status === "fulfilled" && result.value.data.data) {
          const product = result.value.data.data;
          products[product.productId] = product;
        }
      });

      setOrderProducts(products);

    } catch (e: any) {
      setError(
        e.response?.data?.message ?? "Could not load order details."
      );
    } finally {
      setBusy("");
      setDetailsLoading(false);
    }
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setOrderProducts({});
  };

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
        Commerce operations
      </p>

      <h1 className="text-3xl font-black text-stone-900">
        Orders & payments
      </h1>

      {error && (
        <div className="mt-5 rounded-xl bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-black">Payments awaiting verification</h2>

        {!payments.length ? (
          <p className="mt-3 text-stone-500">
            No payment proofs awaiting review.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-stone-500">
                <tr>
                  <th className="py-3">Payment</th>
                  <th>Order</th>
                  <th>Amount</th>
                  <th>Proof</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr
                    className="border-b border-stone-100"
                    key={payment.paymentId}
                  >
                    <td className="py-4 font-bold">
                      {payment.transactionId || payment.paymentId}
                    </td>

                    <td>{payment.orderId}</td>

                    <td>{money(payment.amount)}</td>

                    <td>
                      {payment.screenshotUrl ? (
                        <a
                          className="font-bold text-amber-700"
                          target="_blank"
                          rel="noreferrer"
                          href={payment.screenshotUrl}
                        >
                          View screenshot
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="space-x-2">
                      <button
                        disabled={busy === payment.paymentId}
                        onClick={() => verify(payment.paymentId)}
                        className="rounded-lg bg-amber-700 px-3 py-2 font-bold text-white disabled:bg-stone-300"
                      >
                        Verify
                      </button>

                      <button
                        disabled={busy === payment.paymentId}
                        onClick={() => reject(payment.paymentId)}
                        className="rounded-lg border border-red-200 px-3 py-2 font-bold text-red-700 disabled:text-stone-400"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-black">All orders</h2>

        {!orders.length ? (
          <p className="mt-3 text-stone-500">No orders found.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-stone-500">
                <tr>
                  <th className="py-3">Order</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="border-b border-stone-100"
                  >
                    <td className="py-4 font-bold">{order.orderNumber}</td>

                    <td>{order.userId}</td>

                    <td>{money(order.finalAmount)}</td>

                    <td>
                      <span className="font-bold text-amber-700">
                        {order.orderStatus.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={busy === order.orderId}
                          onClick={() => viewOrder(order.orderId)}
                          className="rounded-lg bg-stone-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-amber-700 disabled:bg-stone-300"
                        >
                          {busy === order.orderId ? "Loading…" : "View"}
                        </button>

                        <select
                          disabled={busy === order.orderId}
                          value={order.orderStatus}
                          onChange={(event) =>
                            updateStatus(order.orderId, event.target.value)
                          }
                          className="rounded-lg border border-stone-300 px-2 py-2 text-xs"
                        >
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={closeOrderDetails}
          role="dialog"
          aria-modal="true"
          aria-label="Order details"
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                  Order details
                </p>

                <h2 className="mt-1 text-2xl font-black text-stone-900">
                  {selectedOrder.orderNumber}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeOrderDetails}
                className="grid h-10 w-10 place-items-center rounded-full bg-stone-100 text-xl text-stone-700 transition hover:bg-stone-200"
                aria-label="Close order details"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-4 rounded-2xl bg-stone-50 p-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase text-stone-400">
                  Customer ID
                </p>
                <p className="mt-1 font-bold text-stone-900">
                  {selectedOrder.userId}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-stone-400">
                  Order date
                </p>
                <p className="mt-1 font-bold text-stone-900">
                  {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-stone-400">
                  Payment method
                </p>
                <p className="mt-1 font-bold text-stone-900">
                  {selectedOrder.paymentMethod}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-stone-400">
                  Order status
                </p>
                <p className="mt-1 font-bold text-amber-700">
                  {selectedOrder.orderStatus.replaceAll("_", " ")}
                </p>
              </div>
            </div>

            <div className="mt-7">
              <h3 className="text-lg font-black text-stone-900">
                Ordered products
              </h3>

              {detailsLoading ? (
                <p className="mt-4 text-sm text-stone-500">
                  Loading ordered products…
                </p>
              ) : !selectedOrder.items?.length ? (
                <p className="mt-4 text-sm text-stone-500">
                  No ordered product information found.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {selectedOrder.items.map((item) => {
                    const product = orderProducts[item.productId];

                    return (
                      <div
                        key={`${selectedOrder.orderId}-${item.productId}`}
                        className="flex items-center gap-4 rounded-2xl border border-stone-100 p-3"
                      >
                        <img
                          src={
                            product?.imageUrl ||
                            "https://placehold.co/120x120?text=Product"
                          }
                          alt={product?.name || "Ordered product"}
                          className="h-16 w-16 rounded-xl bg-stone-50 object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold text-stone-900">
                            {product?.name || "Product unavailable"}
                          </p>

                          <p className="mt-1 text-sm text-stone-500">
                            {product?.category || "Product"} · Quantity:{" "}
                            {item.quantity}
                          </p>
                        </div>

                        <p className="font-black text-stone-900">
                          {money(product?.price ?? 0)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-5">
              <p className="text-sm font-bold text-stone-500">Order total</p>

              <p className="text-2xl font-black text-stone-900">
                {money(selectedOrder.finalAmount)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};