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
                    (user) => user.role === "ADMIN" || user.role === "STAFF" || user.role === "CUSTOMER"
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
            <Typography variant="h5" sx={{ mb: 3 }}>
                User Management
            </Typography>

            <TableContainer component={Paper}>
                <Table>

                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>

                                <TableCell>{user.fullName}</TableCell>

                                <TableCell>{user.email}</TableCell>

                                <TableCell>{user.role}</TableCell>

                                <TableCell>
                                    <Chip
                                        label={user.status}
                                        color={
                                            user.status === "ACTIVE"
                                                ? "success"
                                                : "error"
                                        }
                                        size="small"
                                    />
                                </TableCell>

                                <TableCell align="center">

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

                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>
        </Box>
    );
};

export default UserList;