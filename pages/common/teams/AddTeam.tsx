import TeamService from "@/services/TeamService";
import {
  ArrowBack,
  CloudUpload,
  Save,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardBasePath } from "../../../services/RouteUtils";
import { TEAM_DEPARTMENTS } from "../../../services/TeamConstants";

const AddTeam = () => {

  const navigate = useNavigate();
  const basePath = getDashboardBasePath();
  // Image
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  // Personal Information
  const [fullName, setFullName] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [experience, setExperience] = useState("");

  // Social Links
  const [linkedIn, setLinkedIn] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [facebook, setFacebook] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  // About
  const [bio, setBio] = useState("");

  // Status
  const [active, setActive] = useState(true);

  // Loading
  const [loading, setLoading] = useState(false);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    setImage(file);
    setPreview(URL.createObjectURL(file));

  };
  const handleAdd = async () => {
    try {

      setLoading(true);

      const request = {
        fullName,
        designation,
        shortBio: bio,
        email,
        phoneNumber: phone,
        linkedInUrl: linkedIn,
        instagramUrl: instagram,
        facebookUrl: facebook,
        twitterUrl: twitter,
        displayOrder,
      };

      if (!image) return;
      await TeamService.addTeam(request, image);

      navigate(`${basePath}/team`);

    } catch (error) {

      console.error("Failed to add team member", error);

    } finally {

      setLoading(false);

    }
  };

  return (

    <Box sx={{ p: 3 }}>

      <Button
        startIcon={<ArrowBack />}
        sx={{ mb: 2 }}
        onClick={() => navigate(`${basePath}/team`)}
      >
        Back
      </Button>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 3,
        }}
      >
        Add Team Member
      </Typography>

      <Card>

        <CardContent>

          <Grid container spacing={4}>

            {/* Image Section */}

            <Grid size={{ xs: 12, md: 4 }}>

              <Typography
                variant="h6"
                gutterBottom
              >
                Team Member Photo
              </Typography>

              <Box
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: 3,
                  height: 320,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  mb: 2,
                }}
              >

                {preview ? (

                  <img
                    src={preview}
                    alt="Team Member"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                ) : (

                  <Typography color="text.secondary">
                    No Photo Selected
                  </Typography>

                )}

              </Box>

              <Button
                fullWidth
                variant="contained"
                component="label"
                startIcon={<CloudUpload />}
              >
                Upload Photo

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

              </Button>

            </Grid>

            {/* Right Side Form (Next Part) */}

            <Grid size={{ xs: 12, md: 8 }}>

              <Typography
                variant="h6"
                gutterBottom
              >
                Team Information
              </Typography>

              <Grid container spacing={2}>

                {/* Full Name */}

                <Grid size={{ xs: 12 }}>

                  <TextField
                    fullWidth
                    label="Full Name"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                  />

                </Grid>

                {/* Designation */}

                <Grid size={{ xs: 12, md: 6 }}>

                  <TextField
                    fullWidth
                    label="Designation"
                    value={designation}
                    onChange={(e) =>
                      setDesignation(e.target.value)
                    }
                  />

                </Grid>

                {/* Department */}

                <Grid size={{ xs: 12, md: 6 }}>

                  <FormControl fullWidth>

                    <InputLabel>
                      Department
                    </InputLabel>

                    <Select
                      value={department}
                      label="Department"
                      onChange={(e) =>
                        setDepartment(e.target.value)
                      }
                    >
                      {TEAM_DEPARTMENTS.map((item) => (

                        <MenuItem
                          key={item}
                          value={item}
                        >
                          {item}
                        </MenuItem>

                      ))}

                    </Select>

                  </FormControl>

                </Grid>

                {/* Email */}

                <Grid size={{ xs: 12, md: 6 }}>

                  <TextField
                    fullWidth
                    type="email"
                    label="Email Address"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />

                </Grid>

                {/* Phone */}

                <Grid size={{ xs: 12, md: 6 }}>

                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                  />

                </Grid>

                {/* Experience */}

                <Grid size={{ xs: 12 }}>

                  <TextField
                    fullWidth
                    type="number"
                    label="Experience (Years)"
                    value={experience}
                    onChange={(e) =>
                      setExperience(e.target.value)
                    }
                  />

                </Grid>

                <Grid size={{ xs: 12 }}>

                  <TextField
                    fullWidth
                    type="number"
                    label="Display Order"
                    value={displayOrder}
                    onChange={(e) =>
                      setDisplayOrder(Number(e.target.value)>=0 ? Number(e.target.value) : 0)
                    }
                  />

                </Grid>

                <Grid size={{ xs: 12 }}>

                  <TextField
                    fullWidth
                    label="LinkedIn URL"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedIn}
                    onChange={(e) =>
                      setLinkedIn(e.target.value)
                    }
                  />

                </Grid>

                <Grid size={{ xs: 12 }}>

                  <TextField
                    fullWidth
                    label="Instagram URL"
                    placeholder="https://instagram.com/username"
                    value={instagram}
                    onChange={(e) =>
                      setInstagram(e.target.value)
                    }
                  />

                </Grid>

                <Grid size={{ xs: 12 }}>

                  <TextField
                    fullWidth
                    label="Twitter / X URL"
                    placeholder="https://x.com/username"
                    value={twitter}
                    onChange={(e) =>
                      setTwitter(e.target.value)
                    }
                  />

                </Grid>

                <Grid size={{ xs: 12 }}>

                  <TextField
                    fullWidth
                    label="Portfolio Website"
                    placeholder="https://yourportfolio.com"
                    value={portfolio}
                    onChange={(e) =>
                      setPortfolio(e.target.value)
                    }
                  />

                </Grid>

                <Grid size={{ xs: 12 }}>

                  <TextField
                    fullWidth
                    label="Facebook URL"
                    placeholder="https://facebook.com/username"
                    value={facebook}
                    onChange={(e) =>
                      setFacebook(e.target.value)
                    }
                  />

                </Grid>

                <Grid size={{ xs: 12 }}>

                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    label="Short Bio"
                    value={bio}
                    onChange={(e) =>
                      setBio(e.target.value)
                    }
                  />

                </Grid>

                <Grid
                  size={{ xs: 12 }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >

                  <Typography sx={{ mr: 2 }}>
                    {active ? "Active" : "Inactive"}
                  </Typography>

                  <Switch
                    checked={active}
                    onChange={(e) =>
                      setActive(e.target.checked)
                    }
                  />

                </Grid>

              </Grid>

            </Grid>

          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >

            <Button
              variant="outlined"
              onClick={() => navigate(`${basePath}/team`)}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleAdd}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Team Member"}
            </Button>
          </Box>

        </CardContent>

      </Card>

    </Box>

  );
};

export default AddTeam;