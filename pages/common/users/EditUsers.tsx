import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import UserService from "../../../services/UserService";

const EditUser = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await UserService.getUserById(Number(id));

                const user = response.data.data;
                setRole(user.role);
                setStatus(user.status);

            } catch (error) {
                console.error(error);
                alert("Unable to load user details.");
            }
        };

        if (id) {
            loadUser();
        }
    }, [id]);

    const saveUser = async () => {
        try {

            if (!role || !status) {
                alert("Please select both Role and Status.");
                return;
            }

            await UserService.updateUserRoleAndStatus(
                Number(id),
                role,
                status
            );

            alert("User updated successfully.");

            navigate(-1);

        } catch (error: any) {
            console.error(error);

            alert(
                error.response?.data?.message ??
                "Unable to update user."
            );
        }
    };

    return (
        <Box sx={{ p: 3 }}>

            <Typography variant="h5" sx={{ mb: 3 }}>
                Edit User
            </Typography>

            <Card>
                <CardContent>

                    {/* Role */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Role</InputLabel>

                        <Select
                            value={role}
                            label="Role"
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="ADMIN">
                                Admin
                            </MenuItem>

                            <MenuItem value="CUSTOMER">
                                Customer
                            </MenuItem>

                            <MenuItem value="STAFF">
                                Staff
                            </MenuItem>
                        </Select>
                    </FormControl>

                    {/* Status */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Status</InputLabel>

                        <Select
                            value={status}
                            label="Status"
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <MenuItem value="ACTIVE">
                                Active
                            </MenuItem>

                            <MenuItem value="INACTIVE">
                                Inactive
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 4,
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={saveUser}
                            sx={{ minWidth: 160 }}
                        >
                            Save Changes
                        </Button>

                        <IconButton
                            onClick={() => navigate(-1)}
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                border: "1px solid #d1d5db",
                                bgcolor: "#fff",
                                color: "#1976d2",
                                boxShadow: 2,
                                "&:hover": {
                                    bgcolor: "#f5f5f5",
                                    boxShadow: 4,
                                },
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    </Box>

                </CardContent>
            </Card>

        </Box>
    );
};

export default EditUser;