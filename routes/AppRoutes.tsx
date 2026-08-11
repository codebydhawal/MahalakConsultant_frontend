import React from "react";
import { Route, Routes } from "react-router-dom";

import { About } from "../pages/About";
import { Blog } from "../pages/Blog";
import { BlogDetail } from "../pages/BlogDetail";
import { Cart } from "../pages/Cart";
import { Contact } from "../pages/Contact";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Portfolio } from "../pages/Portfolio";
import ProductDetails from "../pages/ProductDetails";
import Register from "../pages/Register";
import { Shop } from "../pages/Shop";

import AdminDashboard from "../pages/AdminDashboard";
import StaffDashboard from "../pages/StaffDashboard";

import EditUsers from "../pages/common/users/EditUsers";
import UserList from "../pages/common/users/UserList";
import ViewUser from "../pages/common/users/ViewUser";

import AddTeam from "../pages/common/teams/AddTeam";
import EditTeam from "../pages/common/teams/EditTeam";
import TeamList from "../pages/common/teams/TeamList";

import AddProduct from "../pages/common/products/AddProduct";
import EditProduct from "../pages/common/products/EditProduct";
import ProductList from "../pages/common/products/ProductList";
import ViewProduct from "../pages/common/products/ViewProduct";

import AddBlog from "../pages/common/blogs/AddBlog";
import BlogList from "../pages/common/blogs/BlogList";
import EditBlog from "../pages/common/blogs/EditBlog";
import ViewBlog from "../pages/common/blogs/ViewBlog";

import AddProject from "../pages/common/projects/AddProject";
import ProjectList from "../pages/common/projects/ProjectList";
import ViewProject from "../pages/common/projects/ViewProject";

import AddMedia from "../pages/common/medias/AddMedia";
import EditMedia from "../pages/common/medias/EditMedia";
import MediaList from "../pages/common/medias/MediaList";

import MyProfile from "../pages/common/profile/MyProfile";

import {
  BlogPost,
  MediaItem,
  Project,
  SiteConfig,
  TeamMember,
  Testimonial,
} from "../types";
import { Checkout } from "@/pages/Checkout";
import { OrderSuccess } from "@/pages/OrderSuccess";
import { OnlinePayment } from "@/pages/OnlinePayment";
import { MyOrders } from "@/pages/MyOrders";
import { CommerceAdmin } from "@/pages/common/commerce/CommerceAdmin";
import { PricingRules } from "@/pages/common/commerce/PricingRules";
import { CloudSetupAdmin, ConfigAdmin, SecurityInfoAdmin, TestimonialsAdmin } from "@/pages/common/admin/StaticAdminPages";

interface AppRoutesProps {
  projects: Project[];
  blogs: BlogPost[];
  media: MediaItem[];
  testimonials: Testimonial[];
  team: TeamMember[];
  config: SiteConfig;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  projects,
  blogs,
  media,
  testimonials,
  team,
  config,
}) => {
  return (
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
  );
};

export default AppRoutes;
