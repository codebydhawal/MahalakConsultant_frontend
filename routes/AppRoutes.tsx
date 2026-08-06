import React from "react";
import { Routes, Route } from "react-router-dom";

import { Home } from "../pages/Home";
import { About } from "../pages/About";
import { Portfolio } from "../pages/Portfolio";
import { Shop } from "../pages/Shop";
import { Blog } from "../pages/Blog";
import { BlogDetail } from "../pages/BlogDetail";
import { Login } from "../pages/Login";
import Register from "../pages/Register";
import { Contact } from "../pages/Contact";
import { Cart } from "../pages/Cart";
import ProductDetails from "../pages/ProductDetails";

import AdminDashboard from "../pages/AdminDashboard";
import StaffDashboard from "../pages/StaffDashboard";

import UserList from "../pages/common/users/UserList";
import ViewUser from "../pages/common/users/ViewUser";
import EditUsers from "../pages/common/users/EditUsers";

import TeamList from "../pages/common/teams/TeamList";
import EditTeam from "../pages/common/teams/EditTeam";
import AddTeam from "../pages/common/teams/AddTeam";

import ProductList from "../pages/common/products/ProductList";
import AddProduct from "../pages/common/products/AddProduct";
import EditProduct from "../pages/common/products/EditProduct";
import ViewProduct from "../pages/common/products/ViewProduct";

import BlogList from "../pages/common/blogs/BlogList";
import AddBlog from "../pages/common/blogs/AddBlog";
import EditBlog from "../pages/common/blogs/EditBlog";
import ViewBlog from "../pages/common/blogs/ViewBlog";

import ProjectList from "../pages/common/projects/ProjectList";
import AddProject from "../pages/common/projects/AddProject";
import ViewProject from "../pages/common/projects/ViewProject";

import {
  BlogPost,
  MediaItem,
  Project,
  SiteConfig,
  TeamMember,
  Testimonial,
} from "../types";

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
            projects={projects}
            blogs={blogs}
            media={media}
            testimonials={testimonials}
            config={config}
          />
        }
      />

      <Route
        path="/about"
        element={<About config={config} team={team} />}
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

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />}>
        <Route path="users" element={<UserList />} />
        <Route path="users/view/:id" element={<ViewUser />} />
        <Route path="users/edit/:id" element={<EditUsers />} />

        <Route path="team" element={<TeamList />} />
        <Route path="team/edit/:id" element={<EditTeam />} />
        <Route path="team/add" element={<AddTeam />} />

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
      </Route>
    </Routes>
  );
};

export default AppRoutes;