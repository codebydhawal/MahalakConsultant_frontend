import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SiteConfig } from "../types";

import {
    Avatar,
    Box,
    Divider,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { logout } from "../slices/authSlice";
import { clearCartState, setCart } from "../slices/cartSlice";
import CartService from "../services/CartService";

interface NavbarProps {
    config: SiteConfig;
}

const Navbar: React.FC<NavbarProps> = ({
    config,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state: any) => state.auth?.user);
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

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearCartState());

        navigate("/");
    };

    const cart = useAppSelector((state) => state.cart.cart);

    const cartCount = cart?.totalItems ?? 0;

    useEffect(() => {
        if (!localStorage.getItem("token") || cart) return;

        CartService.getCart()
            .then((response) => dispatch(setCart(response.data.data)))
            .catch(() => {
                // The user may be logged out or the cart may not exist yet.
            });
    }, [cart, dispatch]);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-stone-200 py-0' : 'bg-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex justify-between items-center transition-all duration-500 ${scrolled ? 'h-20' : 'h-24'}`}>
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-3 group">
                            <img src="/logo.png" alt="Mahalak Logo" className="w-12 h-12 object-contain transition-all group-hover:rotate-12" onError={(e) => (e.currentTarget.style.display = 'none')} />
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

                                    <MenuItem onClick={() => { handleMenuClose(); navigate("/orders"); }}>
                                        <i className="fa-solid fa-box mr-3"></i>
                                        My Orders
                                    </MenuItem>

                                    <MenuItem
                                        onClick={() => {
                                            handleMenuClose();
                                            handleLogout();
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
                        {/* {user ? (
                            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full px-3 py-6 text-red-500 font-black uppercase">Logout</button>
                        ) : (
                            <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-6 bg-stone-900 text-white rounded-2xl font-black mt-6">User Login</Link>
                        )} */}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
