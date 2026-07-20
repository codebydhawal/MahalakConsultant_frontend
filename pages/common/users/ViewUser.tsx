import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, Tooltip } from "@mui/material";

import UserService from "../../../services/UserService";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const ViewUser = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const response = await UserService.getUserById(Number(id));
      setUser(response.data.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
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
    return (
      <Box sx={{ p: 3 }}>
        <Typography>User not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>

      <Typography variant="h5" sx={{ mb: 3 }}>
        User Details
      </Typography>

      <Card>
        <CardContent>

          <Grid container spacing={3}>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography>Name</Typography>
              <Typography sx={{ fontWeight: "bold" }}>
                {user.fullName}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography>Email</Typography>
              <Typography sx={{ fontWeight: "bold" }}>
                {user.email}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography>Role</Typography>
              <Typography sx={{ fontWeight: "bold" }}>
                {user.role}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography>Status</Typography>

              <Chip
                label={user.status}
                color={
                  user.status === "ACTIVE"
                    ? "success"
                    : "error"
                }
              />

            </Grid>

            {/* <Grid size={{ xs: 12, md: 6 }}>
              <Typography>Created On</Typography>
              <Typography sx={{ fontWeight: "bold" }}>
                {new Date(user.createdAt).toLocaleString()}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography>Last Updated</Typography>
              <Typography sx={{ fontWeight: "bold" }}>
                {new Date(user.updatedAt).toLocaleString()}
              </Typography>
            </Grid> */}

          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              pr: 4, // Move it slightly left from the edge
              mb: 3,
            }}
          >
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                width: 42,
                height: 42,
                border: "1px solid #d1d5db",
                borderRadius: "50%",
                bgcolor: "#fff",
                "&:hover": {
                  bgcolor: "#f5f5f5",
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

export default ViewUser;