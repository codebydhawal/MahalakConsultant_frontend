import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { RegisterUserRequest } from "../services/User";

const Register: React.FC = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterUserRequest>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "CUSTOMER",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {

      const response = await UserService.register(formData);

      setSuccess(
        response.data.message || "Registration Successful!"
      );

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "CUSTOMER",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err: any) {

      console.error(err);

      if (err.response) {
        setError(
          err.response.data.message || "Registration Failed."
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
    <div className="min-h-screen flex justify-center items-center bg-stone-50 px-4">

      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-10">

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-stone-800">
            Create Account
          </h1>

          <p className="text-stone-500 mt-2">
            Join our design community
          </p>

        </div>

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="block text-sm font-semibold mb-2">
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                required
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-600"
              />

            </div>

            <div>

              <label className="block text-sm font-semibold mb-2">
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                required
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-600"
              />

            </div>

          </div>

          <div>

            <label className="block text-sm font-semibold mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              required
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-600"
            />

          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Phone Number
            </label>

            <input
              type="tel"
              name="phoneNumber"
              required
              placeholder="+91 9876543210"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-amber-600"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-amber-700"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

        </form>

        <div className="mt-6 text-center">

          <p className="text-sm text-gray-600">

            Already have an account?

            <Link
              to="/login"
              className="ml-2 text-amber-700 font-semibold hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;