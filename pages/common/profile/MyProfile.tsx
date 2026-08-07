import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

import UserService from "../../../services/UserService";
import { UpdateUserRequest, UserResponse } from "../../../services/User";

import { jwtDecode } from "jwt-decode";
interface JwtPayload {
  sub: string;
  id: number;
  name: string;
  role: string;
  iat: number;
  exp: number;
}
const MyProfile = () => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<UpdateUserRequest>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const token = localStorage.getItem("token");
  const decoded = jwtDecode<JwtPayload>(token || "");

  console.log("Decoded Token:", decoded);
  const userId = decoded.id;

  console.log("User ID:", userId);
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await UserService.getUserById(userId);
      const profile = response.data.data;

      setUser(profile);
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    }

    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const response = await UserService.updateUser(userId, formData);
      const updatedUser = response.data.data;

      setUser(updatedUser);
      setEditMode(false);
    } catch (error) {
      console.error(error);
      setError("Could not update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Typography sx={{ p: 3 }}>Profile not found.</Typography>;
  }

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5">My Profile</Typography>

        {!editMode ? (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </Button>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<CloseIcon />}
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography color="text.secondary">First Name</Typography>

              {editMode ? (
                <TextField
                  fullWidth
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  sx={{ mt: 1 }}
                />
              ) : (
                <Typography sx={{ fontWeight: "bold" }}>{user.firstName}</Typography>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography color="text.secondary">Last Name</Typography>

              {editMode ? (
                <TextField
                  fullWidth
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  sx={{ mt: 1 }}
                />
              ) : (
                <Typography sx={{ fontWeight: "bold" }}>{user.lastName}</Typography>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography color="text.secondary">Email</Typography>

              {editMode ? (
                <TextField
                  fullWidth
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  sx={{ mt: 1 }}
                />
              ) : (
                <Typography sx={{ fontWeight: "bold" }}>{user.email}</Typography>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography color="text.secondary">Phone Number</Typography>

              {editMode ? (
                <TextField
                  fullWidth
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  sx={{ mt: 1 }}
                />
              ) : (
                <Typography sx={{ fontWeight: "bold" }}>{user.phoneNumber}</Typography>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography color="text.secondary">Role</Typography>
              <Typography sx={{ fontWeight: "bold" }}>{user.role}</Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                Status
              </Typography>
              <Chip
                label={user.status}
                color={user.status === "ACTIVE" ? "success" : "error"}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MyProfile;