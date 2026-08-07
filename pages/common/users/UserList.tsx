import { useEffect, useState } from "react";
import {
    Box,
    Chip,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    Avatar,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useNavigate } from "react-router-dom";
import UserService from "../../../services/UserService";
import { UserResponse, RegisterUserRequest, UserStatus } from "@/services/User";


const UserList = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

   const loadUsers = async () => {
    try {
        const response = await UserService.getAllUsers();

        const users: UserResponse[] = response.data.data;

        setUsers(
            users.filter(
                (user) =>
                    user.role === "ADMIN" ||
                    user.role === "STAFF" ||
                    user.role === "CUSTOMER"
            )
        );
    } catch (error) {
        console.error("Error loading users:", error);
    } finally {
        setLoading(false);
    }
};

    const deleteUser = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }

        try {
            await UserService.deleteUser(id);
            loadUsers();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
                User Management
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: 4,
                }}
            >
                {users.map((user) => (
                    <Paper
                        key={user.id}
                        elevation={3}
                        sx={{
                            p: 3,
                            textAlign: "center",
                            borderRadius: 3,
                            transition: "0.3s",
                            "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: 8,
                            },
                        }}
                    >
                        <Avatar
                            src={user.profileImageUrl}
                            alt={user.fullName}
                            sx={{
                                width: 110,
                                height: 110,
                                margin: "0 auto",
                                border: "3px solid #1976d2",
                                mb: 2,
                            }}
                        >
                            {user.firstName.charAt(0)}
                        </Avatar>

                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 600 }}
                        >
                            {user.fullName}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            {user.role}
                        </Typography>

                        <Chip
                            label={user.status}
                            color={
                                user.status === UserStatus.ACTIVE
                                    ? "success"
                                    : "error"
                            }
                            size="small"
                            sx={{ mb: 2 }}
                        />

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 1,
                            }}
                        >
                            <IconButton
                                color="primary"
                                onClick={() =>
                                    navigate(`/admin/users/view/${user.id}`)
                                }
                            >
                                <VisibilityIcon />
                            </IconButton>

                            <IconButton
                                color="warning"
                                onClick={() =>
                                    navigate(`/admin/users/edit/${user.id}`)
                                }
                            >
                                <EditIcon />
                            </IconButton>

                            <IconButton
                                color="error"
                                onClick={() => deleteUser(user.id)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};

export default UserList;