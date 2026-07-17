import { useState } from "react";
import {
    AppBar,
    Avatar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Divider,
    Menu,
    MenuItem,
    Tooltip,
    Chip,
} from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchIcon from "@mui/icons-material/Search";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ArticleIcon from "@mui/icons-material/Article";
import WorkIcon from "@mui/icons-material/Work";
import GroupsIcon from "@mui/icons-material/Groups";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import ReviewsIcon from "@mui/icons-material/Reviews";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import TuneIcon from "@mui/icons-material/Tune";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CloudSyncIcon from "@mui/icons-material/CloudSync";

const drawerWidth = 260;
const collapsedWidth = 80;

const menuItems = [
    // { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "Products", icon: <Inventory2Icon />, path: "/admin/products" },
    { text: "Blogs", icon: <ArticleIcon />, path: "/admin/blogs" },
    { text: "Projects", icon: <WorkIcon />, path: "/admin/projects" },
    { text: "Team", icon: <GroupsIcon />, path: "/admin/team" },
    { text: "Media", icon: <PhotoLibraryIcon />, path: "/admin/media" },
    { text: "Testimonials", icon: <ReviewsIcon />, path: "/admin/testimonials", },
    {
        text: "Config",
        icon: <TuneIcon />,
        path: "/admin/config",
    },
    {
        text: "Security Info",
        icon: <AdminPanelSettingsIcon />,
        path: "/admin/SecurityInfo",
    },
    {
        text: "Cloud Setup",
        icon: <CloudSyncIcon />,
        path: "/admin/CloudSetup",
    },
];

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const drawerSize = collapsed ? collapsedWidth : drawerWidth;

    const pageTitle =
        menuItems.find((m) => location.pathname === m.path)?.text ||
        "Dashboard";

    //new
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const openProfile = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const closeProfile = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const drawerContent = (
        <Box
            sx={{
                width: 280,
                bgcolor: "#fff",
                borderRadius: 4,
                boxShadow: "0 8px 25px rgba(0,0,0,.08)",
                border: "1px solid #E7E5E4",
                overflow: "hidden",
                position: "sticky",
                top: 100,
            }}
        >

            <List>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.text}
                        selected={location.pathname === item.path}
                        onClick={() => navigate(item.path)}
                        sx={{
                            mx: 2,
                            my: 1,
                            borderRadius: 3,
                            py: 1.5,
                            color: "#57534E",
                            transition: "all 0.3s ease",

                            "&:hover": {
                                bgcolor: "#FDE68A",
                                color: "#B45309",
                                transform: "translateX(8px)",
                                boxShadow: "0 6px 15px rgba(180,83,9,0.2)",
                            },

                            "&.Mui-selected": {
                                bgcolor: "#B45309",
                                color: "#fff",
                            },

                            "&.Mui-selected:hover": {
                                bgcolor: "#92400E",
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 40,
                                color: "inherit",
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>

                        {!collapsed && (
                            <ListItemText
                                primary={item.text}
                                sx={{
                                    "& .MuiListItemText-primary": {
                                        fontSize: "15px",
                                        fontWeight: 600,
                                        color: "inherit",
                                    },
                                }}
                            />
                        )}
                    </ListItemButton>
                ))}
            </List>

            <Box sx={{ mt: "auto", p: 2 }}>
                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        borderRadius: 2,
                    }}
                >
                    <ListItemIcon sx={{ color: "#fff" }}>
                        <LogoutIcon />
                    </ListItemIcon>

                    {!collapsed && <ListItemText
                        primary={
                            <Typography
                                sx={{
                                    fontSize: 15,
                                    fontWeight: 500,
                                }}
                            >
                                Logout
                            </Typography>
                        }
                    />}
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box
            sx={{
                maxWidth: "1400px",
                mx: "auto",
                px: 3,
                py: 4,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    gap: 4,
                    alignItems: "flex-start",
                }}
            >
                {/* Sidebar */}
                {drawerContent}

                {/* Main Content */}
                <Box
                    sx={{
                        flex: 1,
                        bgcolor: "#fff",
                        borderRadius: 4,
                        p: 4,
                        boxShadow: "0 8px 25px rgba(0,0,0,.08)",
                        minHeight: "730px",
                    }}
                >

                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default AdminDashboard;