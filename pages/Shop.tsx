import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Add,
  Delete,
  Edit,
  Search,
  Visibility,
} from "@mui/icons-material";

import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProductResponse } from "../services/ProductResponse";
import { PRODUCT_CATEGORIES } from "../services/ProductConstants"
import ProductService from "../services/ProductService";

export const Shop: React.FC = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");

  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);

  const formatCategory = (category: string) =>
    category
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  const categories = [
    "All",
    ...PRODUCT_CATEGORIES.map(formatCategory),
  ];

  const fetchProducts = async () => {

    try {

      setLoading(true);

      const response =
        await ProductService.getAllProducts();

      setProducts(response.data.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchProducts();

  }, []);

  const filteredProducts = products.filter((product) => {

    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      product.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress />

        <Typography variant="h6" color="text.secondary">
          Loading Products...
        </Typography>
      </Box>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-700 overflow-x-hidden">

      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 px-4">

        <div>

          <h1 className="text-5xl font-bold text-stone-900">

            ArchiVastu Shop

          </h1>

          <p className="text-stone-500 mt-3 text-lg">

            Energy-aligned artifacts for your space.

          </p>

        </div>

        <div className="flex flex-col sm:flex-row gap-4">

          <div className="relative">

            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"></i>

            <input
              type="text"
              placeholder="Find artifacts..."
              className="pl-12 pr-6 py-4 bg-white border border-stone-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-amber-500 outline-none w-full min-w-[280px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <div className="flex gap-2 overflow-auto">

            {categories.map(cat => (

              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest rounded-2xl transition-all shrink-0 ${activeCategory === cat
                  ? "bg-amber-700 text-white shadow-xl"
                  : "bg-white border border-stone-100 text-stone-500 hover:bg-stone-50"
                  }`}
              >

                {cat}

              </button>

            ))}

          </div>

        </div>

      </div>
      <div className="mt-10 flex lg:grid lg:grid-cols-4 gap-10 overflow-x-auto lg:overflow-visible no-scrollbar -mx-4 px-8 pb-10 snap-x snap-mandatory">

        {filteredProducts.map(product => (

          <div
            key={product.productId}
            className="bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col w-[300px]"
          >
            {/* Image */}
            <div
              className="relative h-56 overflow-hidden cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="px-4 py-2 bg-red-600 text-white rounded-full text-xs uppercase font-bold">
                    Sold Out
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">

              <span className="text-[11px] uppercase tracking-[0.25em] text-stone-400">
                {product.category}
              </span>

              <h3 className="text-xl font-bold text-stone-800 mt-2 line-clamp-2">
                {product.name}
              </h3>

              <div className="flex items-center gap-2 mt-3">
                <div
                  className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-emerald-500" : "bg-red-500"
                    }`}
                />
                <span
                  className={`text-xs uppercase font-bold ${product.stock > 0 ? "text-emerald-600" : "text-red-600"
                    }`}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">

                <span className="text-2xl font-bold text-stone-900">
                  ₹{product.price}
                </span>

                <button
                  onClick={() => setSelectedProduct(product)}
                  className="bg-stone-900 hover:bg-amber-700 text-white px-5 py-2 rounded-xl text-xs font-bold uppercase transition"
                >
                  View
                </button>

              </div>

            </div>
          </div>

        ))}

      </div>
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-5xl w-full overflow-hidden grid md:grid-cols-2">

            <img
              src={selectedProduct.imageUrl}
              className="w-full h-full object-cover"
              alt={selectedProduct.name}
            />

            <div className="p-10">

              <button
                onClick={() => setSelectedProduct(null)}
                className="float-right text-2xl"
              >
                ✕
              </button>

              <p className="uppercase tracking-widest text-amber-700 text-sm">
                {selectedProduct.category}
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {selectedProduct.name}
              </h2>

              <p className="text-3xl font-bold mt-5">
                ₹{selectedProduct.price}
              </p>

              <div
                className="mt-6 prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: selectedProduct.description,
                }}
              />

              <div className="mt-6">
                <Link
                  to={`/shop/view/${selectedProduct.productId}`}
                  className="text-amber-700 font-semibold hover:underline"
                >
                  See More →
                </Link>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  className="flex-1 py-4 rounded-2xl bg-amber-700 text-white font-semibold hover:bg-amber-800 transition"
                >
                  <i className="fa-solid fa-cart-shopping mr-2"></i>
                  Add to Cart
                </button>

                <button
                  className="flex-1 py-4 rounded-2xl bg-stone-900 text-white font-semibold hover:bg-stone-800 transition"
                >
                  Buy Now
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

