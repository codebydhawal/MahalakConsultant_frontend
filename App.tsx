
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { Shop } from './pages/Shop';
import { Blog } from './pages/Blog';
import { BlogDetail } from './pages/BlogDetail';
import { Login } from './pages/Login';
import { About } from './pages/About';
import { Cart } from './pages/Cart';
import { Contact } from './pages/Contact';
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import BlogList from "./pages/common/blogs/BlogList";
import AddBlog from "./pages/common/blogs/AddBlog";
import EditBlog from "./pages/common/blogs/EditBlog";
import ViewBlog from "./pages/common/blogs/ViewBlog";
import { AIAdvisor } from './components/AIAdvisor';
import { CartItem, Product, BlogPost, Project, TeamMember, Testimonial, SiteConfig, MediaItem } from './types';
import { PRODUCTS as initialProducts, BLOGS as initialBlogs, PROJECTS as initialProjects } from './constants';
import { fetchAll, fetchConfig } from './lib/database';
import {
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Typography,
  Box,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

import UserList from "./pages/common/users/UserList";
import ViewUser from "./pages/common/users/ViewUser";
import EditUsers from "./pages/common/users/EditUsers";
import ProductList from "./pages/common/products/ProductList";
import AddProduct from "./pages/common/products/AddProduct";
import EditProduct from "./pages/common/products/EditProduct";
import ViewProduct from "./pages/common/products/ViewProduct";
import ProductDetails from './pages/ProductDetails';
import ProjectList from './pages/common/projects/ProjectList';
import AddProject from './pages/common/projects/AddProject';
import ViewProject from './pages/common/projects/ViewProject';

// const [user, setUser] = useState<any>(() => {
//   const savedUser = localStorage.getItem("user");
//   return savedUser ? JSON.parse(savedUser) : null;
// });

const WhatsAppButton: React.FC<{ number: string }> = ({ number }) => (
  <a
    href={`https://wa.me/${number.replace(/\D/g, '')}?text=Namaste Mahalak Consultants! I have a general enquiry.`}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-42 md:bottom-48 right-6 md:right-8 w-12 h-12 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full shadow-2xl z-[100] flex items-center justify-center transition-all hover:scale-110 active:scale-95"
    title="General Enquiry"
  >
    <i className="fa-brands fa-whatsapp text-2xl md:text-3xl"></i>
  </a>
);

const BackToTop: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const toggleVisible = () => {
      if (window.pageYOffset > 400) setVisible(true);
      else setVisible(false);
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  if (location.pathname !== '/' || !visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 md:bottom-8 right-6 md:right-8 w-12 h-12 md:w-16 md:h-16 bg-white text-stone-900 border border-stone-200 rounded-full shadow-2xl z-[100] flex items-center justify-center transition-all hover:scale-110 active:scale-95 animate-in fade-in slide-in-from-bottom-4"
      title="Back to Top"
    >
      <i className="fa-solid fa-arrow-up text-xl md:text-2xl"></i>
    </button>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Navbar: React.FC<{ cartCount: number, config: SiteConfig, user: any, onLogout: () => void }> = ({ cartCount, config, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Shop', path: '/shop' },
    { name: 'Blog', path: '/blog' },
    // { name: 'AdminDashboard', path: '/admin' },  //here i update  bcs i  want ro add this nav bar to my admin page
  ];

  const isTransparent = !scrolled && (location.pathname === '/' || location.pathname === '/about');

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-stone-200 py-0' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-500 ${scrolled ? 'h-20' : 'h-24'}`}>
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="logo.png" alt="Mahalak Logo" className="w-12 h-12 object-contain transition-all group-hover:rotate-12" onError={(e) => (e.currentTarget.style.display = 'none')} />
              <div className="flex flex-col items-start">
                <span className={`text-2xl font-black tracking-tighter leading-none transition-colors duration-500 ${isTransparent ? 'text-white' : 'text-stone-800'}`}>MAHALAKK</span>
                <span className="text-[9px] font-black uppercase tracking-[0.5em] leading-none mt-1" style={{ color: config.accentColor }}>CONSULTANT</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-amber-700 ${location.pathname === link.path ? 'text-amber-700 border-b-2 border-amber-700 pb-1' : (isTransparent ? 'text-white/80 hover:text-white' : 'text-stone-600')}`}
                style={location.pathname === link.path ? { color: config.accentColor, borderColor: config.accentColor } : {}}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/cart" className={`relative p-2 transition-all hover:scale-110 ${isTransparent ? 'text-white' : 'text-stone-800'}`}>
              <i className="fa-solid fa-basket-shopping text-2xl"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-lg" style={{ backgroundColor: config.accentColor }}>
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <>
                <Avatar
                  onClick={handleMenuOpen}
                  sx={{
                    bgcolor: config.accentColor,
                    cursor: "pointer",
                    width: 42,
                    height: 42,
                    fontWeight: "bold",
                  }}
                >
                  {user?.email?.charAt(0)?.toUpperCase()}
                </Avatar>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  slotProps={{
                    paper: {
                      sx: {
                        mt: 1.5,
                        width: 250,
                        borderRadius: 3,
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                    }}
                  >
                    <Typography sx={{ fontWeight: "bold" }}>
                      {user.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {user.email}
                    </Typography>
                  </Box>

                  <Divider />

                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate("/profile");
                    }}
                  >
                    <PersonIcon sx={{ mr: 1 }} />
                    View Profile
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      onLogout();
                    }}
                  >
                    <LogoutIcon sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-3 bg-stone-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl"
              >
                User Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-6">
            <Link to="/cart" className={`relative p-2 ${isTransparent ? 'text-white' : 'text-stone-800'}`}>
              <i className="fa-solid fa-basket-shopping text-2xl"></i>
              {cartCount > 0 && <span className="absolute top-0 right-0 bg-amber-700 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: config.accentColor }}>{cartCount}</span>}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className={isTransparent ? 'text-white' : 'text-stone-800'}>
              <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 fade-in">
          <div className="px-6 pt-4 pb-12 space-y-2 text-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-6 text-sm font-black uppercase tracking-widest text-stone-800 hover:text-amber-700"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <button onClick={() => { onLogout(); setIsOpen(false); }} className="block w-full px-3 py-6 text-red-500 font-black uppercase">Logout</button>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-6 bg-stone-900 text-white rounded-2xl font-black mt-6">User Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC<{ config: SiteConfig }> = ({ config }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <footer className="bg-stone-950 text-stone-400 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-4 gap-20">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-white text-3xl font-black mb-8 tracking-tighter">MAHALAKK <span className="text-amber-600" style={{ color: config.accentColor }}>CONSULTANT</span></h3>
          <p className="text-sm leading-loose mb-10 font-medium">
            Premium architectural solutions bridging engineering precision with ancient energetic harmony.
          </p>
          <div className="flex gap-5">
            <a href="#" className="w-12 h-12 rounded-2xl border border-stone-800 flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 hover:text-white transition-all"><i className="fa-brands fa-instagram text-lg"></i></a>
            <a href="#" className="w-12 h-12 rounded-2xl border border-stone-800 flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 hover:text-white transition-all"><i className="fa-brands fa-youtube text-lg"></i></a>
            <a href="#" className="w-12 h-12 rounded-2xl border border-stone-800 flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 hover:text-white transition-all"><i className="fa-brands fa-linkedin-in text-lg"></i></a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-black mb-10 text-[10px] uppercase tracking-[0.4em]">The Studio</h4>
          <ul className="space-y-6 text-xs font-bold uppercase tracking-widest">
            <li><Link to="/about" className="hover:text-amber-500 transition-colors">Our Vision</Link></li>
            <li><Link to="/portfolio" className="hover:text-amber-500 transition-colors">Project Portfolio</Link></li>
            <li><Link to="/shop" className="hover:text-amber-500 transition-colors">Vastu Shop</Link></li>
            <li><Link to="/blog" className="hover:text-amber-500 transition-colors">Research & Journals</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-black mb-10 text-[10px] uppercase tracking-[0.4em]">Head Office</h4>
          <div
            className="space-y-6 text-sm leading-loose mb-10 font-medium"
            dangerouslySetInnerHTML={{ __html: config.address }}
          ></div>
          <Link to="/contact" className="inline-block px-8 py-4 bg-amber-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all shadow-2xl shadow-amber-900/40" style={{ backgroundColor: config.accentColor }}>
            Studio Inquiry &raquo;
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-32 pt-12 border-t border-stone-900">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-stone-600 font-black uppercase tracking-[0.3em]">
          <p>&copy; {new Date().getFullYear()} Mahalak Consultants. all rights reserved</p><br /><p>Website desing by MAHALAK TECHNOLOGIES</p>
          <div className="flex gap-12">
            <Link to="/login" className="hover:text-amber-500">Client Hub</Link>
            <Link to="/admin" className="opacity-40 hover:opacity-100 flex items-center gap-2"><i className="fa-solid fa-lock"></i> Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  const [cart, setCart] = useState<Array<CartItem>>([]);
  const location = useLocation();
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [products, setProducts] = useState<Array<Product>>(initialProducts);
  const [blogs, setBlogs] = useState<Array<BlogPost>>(initialBlogs);
  const [projects, setProjects] = useState<Array<Project>>(initialProjects);
  const [media, setMedia] = useState<Array<MediaItem>>([]);
  const [team, setTeam] = useState<Array<TeamMember>>([]);
  const [testimonials, setTestimonials] = useState<Array<Testimonial>>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    aboutTitle: 'Design Beyond Structures',
    shortIntro: 'Mahalak Consultants is a premier design studio blending structural innovation with spiritual wellness.',
    aboutDescription: 'Crafting excellence for over 16 years.',
    visionTitle: 'The Energy of Architecture',
    visionDescription1: 'Creating spaces that elevate consciousness.',
    visionDescription2: 'Sustainable, structural, spiritual.',
    contactEmail: 'studio@mahalakconsultant.com',
    contactPhone: '+91 9893389629',
    whatsappShopping: '+91 7879628738',
    whatsappEnquiry: '+91 9893389629',
    whatsappComplaint: '+91 9109249478',
    whatsappNumber: '+91 9893389629',
    vastuRedirectUrl: '#/contact',
    address: '11-B, Shri Nagar Colony, Berasiya Road, Bhopal (MP)| India',
    statYearsExp: '12+',
    statProjectsDone: '100+',
    statVastuExp: '7+',
    statVastuAudits: '50+',
    accentColor: '#b45309',
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Inter', sans-serif",
    headingFontSize: 'text-7xl',
    aboutImage1: 'https://picsum.photos/seed/ab1/400/400',
    aboutImage2: 'https://picsum.photos/seed/ab2/400/400',
    legacyImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    heroMediaType: 'image',
    heroMediaUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000'
  });

  // Cloud Sync Logic on Mount
  useEffect(() => {
    const initializeData = async () => {
      const [cloudProducts, cloudBlogs, cloudProjects, cloudTeam, cloudMedia, cloudTestimonials, cloudConfig] = await Promise.all([
        fetchAll('products'),
        fetchAll('blogs'),
        fetchAll('projects'),
        fetchAll('team'),
        fetchAll('media'),
        fetchAll('testimonials'),
        fetchConfig()
      ]);

      if (cloudProducts?.length) setProducts(cloudProducts);
      if (cloudBlogs?.length) setBlogs(cloudBlogs);
      if (cloudProjects?.length) setProjects(cloudProjects);
      if (cloudTeam?.length) setTeam(cloudTeam);
      if (cloudMedia?.length) setMedia(cloudMedia);
      if (cloudTestimonials?.length) setTestimonials(cloudTestimonials);
      if (cloudConfig) setSiteConfig(cloudConfig);
    };
    initializeData();
  }, []);

  const addToCart = (product: Product) => {
    if (!user) {
      alert("Namaste! Please login to your account to add items to the cart.");
      window.location.hash = '#/login';
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleLogout = () => {
    localStorage.clear();

    setUser(null);
    setCart([]);
    window.location.hash = '#/';
  };

  const removeFromCart = (id: number) => setCart((prev) => prev.filter((item) => item.id !== id));
  const clearCart = () => setCart([]);
  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isHeroPage = location.pathname === '/' || location.pathname === '/about';

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-stone-50 overflow-x-hidden">
        <Navbar cartCount={cartCount} config={siteConfig} user={user} onLogout={handleLogout} />
        <main className={`flex-grow ${isHeroPage ? 'pt-0' : 'pt-24 md:pt-28'}`}>
          <Routes>
            <Route path="/" element={<Home projects={projects} blogs={blogs} media={media} testimonials={testimonials} config={siteConfig} />} />
            <Route path="/about" element={<About config={siteConfig} team={team} />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="shop/view/:id" element={<ProductDetails />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blogs/view/:id" element={<BlogDetail />} />
            <Route path="/login" element={<Login onLogin={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact config={siteConfig} />} />
            <Route path="/admin" element={<AdminDashboard />}>
              <Route path="users" element={<UserList />} />
              <Route path="users/view/:id" element={<ViewUser />} />
              <Route path="users/edit/:id" element={<EditUsers />} />
              {/* Product Routes */}
              <Route path="products" element={<ProductList />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              <Route path="products/view/:id" element={<ViewProduct />} />
              {/* Blog Routes */}
              <Route path="blogs" element={<BlogList />} />
              <Route path="blogs/add" element={<AddBlog />} />
              <Route path="blogs/edit/:id" element={<EditBlog />} />
              <Route path="blogs/view/:id" element={<ViewBlog />} />
              {/* Project Routes */}
              <Route path="projects" element={<ProjectList />} />
              <Route path="projects/add" element={<AddProject />} />
              {/* <Route path="projects/edit/:id" element={<EditProject />} /> */}
              <Route path="projects/view/:id" element={<ViewProject />} />
            </Route>
            <Route path="/staff" element={<StaffDashboard />} >
              {/* Product Routes */}
              <Route path="products" element={<ProductList />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              <Route path="products/view/:id" element={<ViewProduct />} />
              {/* Blog Routes */}
              <Route path="blogs" element={<BlogList />} />
              <Route path="blogs/add" element={<AddBlog />} />
              <Route path="blogs/edit/:id" element={<EditBlog />} />
              <Route path="blogs/view/:id" element={<ViewBlog />} />
              {/* Project Routes */}
              <Route path="projects" element={<ProjectList />} />
              <Route path="projects/add" element={<AddProject />} />
              {/* <Route path="projects/edit/:id" element={<EditProject />} /> */}
              <Route path="projects/view/:id" element={<ViewProject />} />
            </Route>
            <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} config={siteConfig} clearCart={clearCart} user={user} />} />
          </Routes>
        </main>
        <Footer config={siteConfig} />
        <WhatsAppButton number={siteConfig.whatsappEnquiry} />
        <AIAdvisor accentColor={siteConfig.accentColor} />
        <BackToTop accentColor={siteConfig.accentColor} />
      </div>
    </>
  );
};

const AppWrapper: React.FC = () => (
  <HashRouter>
    <App />
  </HashRouter>
);

export default AppWrapper;
