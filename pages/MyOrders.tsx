import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OrderService from "../services/OrderService";
import ProductService from "../services/ProductService";
import { OrderResponse } from "../services/Commerce";
import { ProductResponse } from "../services/ProductResponse";

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;

// imageUrls is optional. Your current API can continue to return only imageUrl.
type ProductWithImages = ProductResponse & {
  imageUrls?: string[];
};

export const MyOrders: React.FC = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [products, setProducts] = useState<
    Record<string, ProductWithImages>
  >({});
  const [itemsLoading, setItemsLoading] = useState(false);

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const load = () =>
    OrderService.getMyOrders()
      .then(({ data }) => setOrders(data.data ?? []))
      .catch((e) =>
        setError(e.response?.data?.message ?? "Could not load orders.")
      )
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!galleryImages.length) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeGallery();
      }

      if (galleryImages.length > 1 && event.key === "ArrowLeft") {
        showPreviousImage();
      }

      if (galleryImages.length > 1 && event.key === "ArrowRight") {
        showNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryImages.length]);

  const cancel = async (orderId: string) => {
    try {
      setBusyId(orderId);
      await OrderService.cancelOrder(orderId);
      load();
    } catch (e: any) {
      setError(e.response?.data?.message ?? "Order could not be cancelled.");
    } finally {
      setBusyId("");
    }
  };

  const reorder = async (orderId: string) => {
    try {
      setBusyId(orderId);
      await OrderService.reorder(orderId);
      navigate("/cart");
    } catch (e: any) {
      setError(
        e.response?.data?.message ??
        "Items could not be added to the cart."
      );
    } finally {
      setBusyId("");
    }
  };

  const showOrderItems = async (order: OrderResponse) => {
    if (expandedOrderId === order.orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(order.orderId);
    setError("");

    const productIds = [
      ...new Set(
        order.items?.map((item) => item.productId).filter(Boolean) ?? []
      ),
    ];

    const missingProductIds = productIds.filter(
      (productId) => !products[productId]
    );

    if (!missingProductIds.length) return;

    try {
      setItemsLoading(true);

      const results = await Promise.allSettled(
        missingProductIds.map((productId) =>
          ProductService.getProductById(productId)
        )
      );

      const fetchedProducts: Record<string, ProductWithImages> = {};

      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value.data.data) {
          const product = result.value.data.data as ProductWithImages;
          fetchedProducts[product.productId] = product;
        }
      });

      setProducts((previous) => ({
        ...previous,
        ...fetchedProducts,
      }));
    } catch (e: any) {
      setError(
        e.response?.data?.message ??
        "Could not load ordered product details."
      );
    } finally {
      setItemsLoading(false);
    }
  };

  const getProductImages = (product?: ProductWithImages): string[] => {
    const multipleImages =
      product?.imageUrls?.filter((image) => Boolean(image)) ?? [];

    if (multipleImages.length) return multipleImages;

    return product?.imageUrl ? [product.imageUrl] : [];
  };

  const openGallery = (product?: ProductWithImages) => {
    const images = getProductImages(product);

    if (!images.length) return;

    setGalleryImages(images);
    setActiveImageIndex(0);
  };

  const closeGallery = () => {
    setGalleryImages([]);
    setActiveImageIndex(0);
  };

  const showPreviousImage = () => {
    setActiveImageIndex((current) =>
      current === 0 ? galleryImages.length - 1 : current - 1
    );
  };

  const showNextImage = () => {
    setActiveImageIndex((current) =>
      current === galleryImages.length - 1 ? 0 : current + 1
    );
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-28">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
            Purchase history
          </p>
          <h1 className="text-4xl font-black">My orders</h1>
        </div>

        <Link to="/shop" className="font-bold text-amber-700">
          Continue shopping
        </Link>
      </div>

      {error && (
        <div className="mb-5 rounded-xl bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading orders…</p>
      ) : !orders.length ? (
        <div className="rounded-3xl border border-stone-100 bg-white p-12 text-center">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const canPay =
              order.paymentMethod === "ONLINE" &&
              ["PAYMENT_PENDING", "PAYMENT_FAILED"].includes(
                order.orderStatus
              ) &&
              order.paymentId;

            const canCancel = ["PAYMENT_PENDING", "CONFIRMED"].includes(
              order.orderStatus
            );

            const isExpanded = expandedOrderId === order.orderId;

            return (
              <article
                key={order.orderId}
                className="rounded-3xl border border-stone-100 bg-white p-6"
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                  <div>
                    <button
                      type="button"
                      onClick={() => showOrderItems(order)}
                      className="text-left text-lg font-extrabold transition hover:text-amber-700"
                      aria-expanded={isExpanded}
                    >
                      {order.orderNumber}
                      <span className="ml-2 text-sm text-stone-400">
                        {isExpanded ? "▲" : "▼"}
                      </span>
                    </button>

                    <p className="mt-1 text-sm text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")} ·{" "}
                      {order.items?.length ?? 0} item(s)
                    </p>

                    <p className="mt-3 text-xs font-bold uppercase text-amber-700">
                      {order.orderStatus.replaceAll("_", " ")} ·{" "}
                      {order.paymentMethod}
                    </p>
                  </div>

                  <div className="md:text-right">
                    <p className="text-xl font-black">
                      {money(order.finalAmount)}
                    </p>

                    <div className="mt-3 flex gap-3 md:justify-end">
                      {canPay && (
                        <button
                          onClick={() =>
                            navigate("/payment/online", { state: { order } })
                          }
                          className="text-sm font-bold text-amber-700"
                        >
                          Pay now
                        </button>
                      )}

                      {canCancel && (
                        <button
                          disabled={busyId === order.orderId}
                          onClick={() => cancel(order.orderId)}
                          className="text-sm font-bold text-red-600 disabled:text-stone-400"
                        >
                          {busyId === order.orderId
                            ? "Cancelling…"
                            : "Cancel"}
                        </button>
                      )}

                      <button
                        disabled={busyId === order.orderId}
                        onClick={() => reorder(order.orderId)}
                        className="text-sm font-bold text-stone-700 disabled:text-stone-400"
                      >
                        Order again
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-6 border-t border-stone-100 pt-5">
                    <p className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-500">
                      Ordered items
                    </p>

                    {itemsLoading ? (
                      <p className="text-sm text-stone-500">
                        Loading ordered items…
                      </p>
                    ) : !order.items?.length ? (
                      <p className="text-sm text-stone-500">
                        No item information available.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {order.items.map((item) => {
                          const product = products[item.productId];
                          const hasImage = getProductImages(product).length > 0;

                          return (
                            <div
                              key={`${order.orderId}-${item.productId}`}
                              className="flex items-center gap-4 rounded-2xl bg-stone-50 p-3"
                            >
                              <button
                                type="button"
                                onClick={() => openGallery(product)}
                                disabled={!hasImage}
                                className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white disabled:cursor-default"
                                aria-label={`View ${product?.name || "product"
                                  } image`}
                              >
                                <img
                                  src={
                                    product?.imageUrl ||
                                    "https://placehold.co/120x120?text=Product"
                                  }
                                  alt={product?.name || "Ordered product"}
                                  className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                                />

                                {hasImage && (
                                  <span className="absolute inset-0 grid place-items-center bg-black/0 text-xs font-bold text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                                    View
                                  </span>
                                )}
                              </button>

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
                )}
              </article>
            );
          })}
        </div>
      )}

      {galleryImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={closeGallery}
          role="dialog"
          aria-modal="true"
          aria-label="Product image preview"
        >
          <div
            className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white p-3 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeGallery}
              className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-xl text-white transition hover:bg-black"
              aria-label="Close image preview"
            >
              ×
            </button>

            <img
              src={galleryImages[activeImageIndex]}
              alt={`Product image ${activeImageIndex + 1}`}
              className="max-h-[70vh] w-full rounded-2xl object-contain"
            />

            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPreviousImage}
                  className="absolute left-6 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl font-bold text-stone-800 shadow-lg transition hover:scale-110 hover:bg-amber-500 hover:text-white"
                  aria-label="Previous image"
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={showNextImage}
                  className="absolute right-6 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl font-bold text-stone-800 shadow-lg transition hover:scale-110 hover:bg-amber-500 hover:text-white"
                  aria-label="Next image"
                >
                  ›
                </button>

                <p className="mt-3 text-center text-sm font-bold text-stone-500">
                  {activeImageIndex + 1} / {galleryImages.length}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
};