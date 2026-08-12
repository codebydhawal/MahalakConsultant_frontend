import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { SiteConfig } from "../types";

const load = (loader: () => Promise<any>, name?: string) => lazy(async () => {
  const module = await loader();
  return { default: name ? module[name] : module.default };
});

const About = load(() => import("../pages/About"), "About");
const Blog = load(() => import("../pages/Blog"), "Blog");
const BlogDetail = load(() => import("../pages/BlogDetail"), "BlogDetail");
const Cart = load(() => import("../pages/Cart"), "Cart");
const Contact = load(() => import("../pages/Contact"), "Contact");
const Home = load(() => import("../pages/Home"), "Home");
const Login = load(() => import("../pages/Login"), "Login");
const Portfolio = load(() => import("../pages/Portfolio"), "Portfolio");
const ProductDetails = load(() => import("../pages/ProductDetails"));
const Register = load(() => import("../pages/Register"));
const Shop = load(() => import("../pages/Shop"), "Shop");
const AdminDashboard = load(() => import("../pages/AdminDashboard"));
const StaffDashboard = load(() => import("../pages/StaffDashboard"));
const EditUsers = load(() => import("../pages/common/users/EditUsers"));
const UserList = load(() => import("../pages/common/users/UserList"));
const ViewUser = load(() => import("../pages/common/users/ViewUser"));
const AddTeam = load(() => import("../pages/common/teams/AddTeam"));
const EditTeam = load(() => import("../pages/common/teams/EditTeam"));
const TeamList = load(() => import("../pages/common/teams/TeamList"));
const AddProduct = load(() => import("../pages/common/products/AddProduct"));
const EditProduct = load(() => import("../pages/common/products/EditProduct"));
const ProductList = load(() => import("../pages/common/products/ProductList"));
const ViewProduct = load(() => import("../pages/common/products/ViewProduct"));
const AddBlog = load(() => import("../pages/common/blogs/AddBlog"));
const BlogList = load(() => import("../pages/common/blogs/BlogList"));
const EditBlog = load(() => import("../pages/common/blogs/EditBlog"));
const ViewBlog = load(() => import("../pages/common/blogs/ViewBlog"));
const AddProject = load(() => import("../pages/common/projects/AddProject"));
const ProjectList = load(() => import("../pages/common/projects/ProjectList"));
const ViewProject = load(() => import("../pages/common/projects/ViewProject"));
const AddMedia = load(() => import("../pages/common/medias/AddMedia"));
const EditMedia = load(() => import("../pages/common/medias/EditMedia"));
const MediaList = load(() => import("../pages/common/medias/MediaList"));
const MyProfile = load(() => import("../pages/common/profile/MyProfile"));
const Checkout = load(() => import("@/pages/Checkout"), "Checkout");
const OrderSuccess = load(() => import("@/pages/OrderSuccess"), "OrderSuccess");
const OnlinePayment = load(() => import("@/pages/OnlinePayment"), "OnlinePayment");
const MyOrders = load(() => import("@/pages/MyOrders"), "MyOrders");
const CommerceAdmin = load(() => import("@/pages/common/commerce/CommerceAdmin"), "CommerceAdmin");
const PricingRules = load(() => import("@/pages/common/commerce/PricingRules"), "PricingRules");
const TestimonialsAdmin = load(() => import("@/pages/common/admin/StaticAdminPages"), "TestimonialsAdmin");
const ConfigAdmin = load(() => import("@/pages/common/admin/StaticAdminPages"), "ConfigAdmin");
const SecurityInfoAdmin = load(() => import("@/pages/common/admin/StaticAdminPages"), "SecurityInfoAdmin");
const CloudSetupAdmin = load(() => import("@/pages/common/admin/StaticAdminPages"), "CloudSetupAdmin");

interface AppRoutesProps { config: SiteConfig; }

const AppRoutes: React.FC<AppRoutesProps> = ({
  config,
}) => {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" aria-busy="true" />}>
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <Home
            config={config}
          />
        }
      />

      <Route
        path="/about"
        element={<About config={config} />}
      />

      <Route path="/portfolio" element={<Portfolio />} />

      <Route path="/shop" element={<Shop />} />

      <Route path="shop/view/:id" element={<ProductDetails />} />

      <Route path="/blog" element={<Blog />} />

      <Route path="/blogs/view/:id" element={<BlogDetail />} />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route path="/register" element={<Register />} />

      <Route
        path="/contact"
        element={<Contact config={config} />}
      />

      <Route path="/cart" element={<Cart />} />

      <Route path="/cart/checkout" element={<Checkout />} />
      <Route path="/order/success" element={<OrderSuccess />} />
      <Route path="/payment/online" element={<OnlinePayment />} />
      <Route path="/orders" element={<MyOrders />} />
      
      <Route path="/profile" element={<MyProfile />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />}>
        <Route path="users" element={<UserList />} />
        <Route path="users/view/:id" element={<ViewUser />} />
        <Route path="users/edit/:id" element={<EditUsers />} />

        <Route path="team" element={<TeamList />} />
        <Route path="team/edit/:id" element={<EditTeam />} />
        <Route path="team/add" element={<AddTeam />} />

        <Route path="media" element={<MediaList />} />
        <Route path="media/add" element={<AddMedia />} />
        <Route path="media/edit/:id" element={<EditMedia />} />

        <Route path="products" element={<ProductList />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="products/view/:id" element={<ViewProduct />} />

        <Route path="blogs" element={<BlogList />} />
        <Route path="blogs/add" element={<AddBlog />} />
        <Route path="blogs/edit/:id" element={<EditBlog />} />
        <Route path="blogs/view/:id" element={<ViewBlog />} />

        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/add" element={<AddProject />} />
        <Route path="projects/view/:id" element={<ViewProject />} />
        <Route path="commerce" element={<CommerceAdmin />} />
        <Route path="pricing-rules" element={<PricingRules />} />
        <Route path="testimonials" element={<TestimonialsAdmin />} />
        <Route path="config" element={<ConfigAdmin />} />
        <Route path="SecurityInfo" element={<SecurityInfoAdmin />} />
        <Route path="CloudSetup" element={<CloudSetupAdmin />} />
      </Route>

      {/* Staff Routes */}
      <Route path="/staff" element={<StaffDashboard />}>
        <Route path="products" element={<ProductList />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="products/view/:id" element={<ViewProduct />} />

        <Route path="blogs" element={<BlogList />} />
        <Route path="blogs/add" element={<AddBlog />} />
        <Route path="blogs/edit/:id" element={<EditBlog />} />
        <Route path="blogs/view/:id" element={<ViewBlog />} />

        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/add" element={<AddProject />} />
        <Route path="projects/view/:id" element={<ViewProject />} />

        <Route path="media" element={<MediaList />} />
        <Route path="media/add" element={<AddMedia />} />
        <Route path="media/edit/:id" element={<EditMedia />} />
      </Route>
    </Routes>
    </Suspense>
  );
};

export default AppRoutes;
