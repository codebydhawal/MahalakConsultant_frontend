import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginSuccess } from "../slices/authSlice";
import { useAppDispatch } from "../store/hooks";
import CartService from "@/services/CartService";
import { setCart } from "@/slices/cartSlice";

// interface LoggedInUser {
//   email: string;
//   role: string;
//   token: string;
//   user: any;
// }

// interface LoginProps {
//   onLogin: (user: LoggedInUser) => void;
// }

interface JwtPayload {
  sub: string;
  id: number;
  name: string;
  role: string;
  iat: number;
  exp: number;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/rest/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login Response:", response.data);

      // Get token from API response
      const token = response.data.data.token;
      const user = {
        id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
        role: response.data.data.role,
      };

      // Save token
      // localStorage.setItem("token", token);
      // localStorage.setItem("user", JSON.stringify(user));

      // Decode JWT
      const decoded = jwtDecode<JwtPayload>(token);

      console.log("Decoded Token:", decoded);

      const role = decoded.role;

      // Store login information
      dispatch(
        loginSuccess({
          user,
          token,
        })
      );

      try {
        const cartResponse = await CartService.getCart();

        dispatch(setCart(cartResponse.data.data));
      } catch (error) {
        console.error("Unable to load cart", error);
      }

      // ================================
      // CHECK PENDING BUY NOW
      // ================================

      const pendingBuyNow = localStorage.getItem("pendingBuyNow");

      if (pendingBuyNow) {

        try {

          const buyNowData = JSON.parse(pendingBuyNow);

          const request = {
            productId: buyNowData.productId,
            quantity: buyNowData.quantity,
          };

          console.log("Processing pending Buy Now:", request);

          const buyNowResponse =
            await CartService.addToCart(request);

          // Update Redux cart
          dispatch(
            setCart(buyNowResponse.data.data)
          );

          // Remove pending Buy Now only after successful add
          localStorage.removeItem("pendingBuyNow");

          // Go directly to checkout
          navigate("/cart/checkout", {
            replace: true,
          });

          return;

        } catch (error) {

          console.error(
            "Failed to process Buy Now:",
            error
          );

          setError(
            "Login successful, but unable to prepare your checkout."
          );

          return;
        }
      }


      // ================================
      // NORMAL LOGIN REDIRECT
      // ================================

      switch (role) {

        case "ADMIN":
          navigate("/admin/users", {
            replace: true,
          });
          break;

        case "STAFF":
          navigate("/staff/products", {
            replace: true,
          });
          break;

        case "CUSTOMER":

          const redirectTo =
            location.state?.redirectTo || "/shop";

          navigate(redirectTo, {
            replace: true,
          });

          break;

        default:
          navigate("/", {
            replace: true,
          });
      }

    } catch (err: any) {
      console.error("Login Error:", err);

      if (err.response) {
        setError(
          err.response.data.message || "Invalid email or password."
        );
      } else if (err.request) {
        setError("Unable to connect to the server.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-stone-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100">
        <div className="p-10">

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-stone-900 mb-2">
              Welcome Back
            </h2>

            <p className="text-stone-500 text-sm">
              Sign in to access your account.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-stone-500 ml-1">
                Email Address
              </label>

              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-stone-500 ml-1">
                Password
              </label>

              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-amber-700 text-white font-bold rounded-xl shadow-lg hover:bg-amber-800 transition-all disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>

          <div className="mt-8 pt-8 border-t border-stone-100 text-center space-y-4">

            <p className="text-stone-500 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-amber-700 font-bold hover:underline"
              >
                Sign Up
              </Link>
            </p>

            {/* <div className="pt-4 border-t border-stone-50">
              <Link
                to="/admin"
                className="text-xs text-stone-400 hover:text-amber-700 font-medium italic"
              >
                Staff Portal Access &raquo;
              </Link>
            </div> */}

          </div>

        </div>
      </div>
    </div>
  );
};