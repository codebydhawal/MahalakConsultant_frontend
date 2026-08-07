import React, { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Paper,
    TextField,
    Typography,
    Alert,
} from "@mui/material";
import { ArrowBack, Save } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import MediaService from "../../../services/MediaService";
import { MediaRequest } from "../../../services/Media";

const AddMedia: React.FC = () => {

    const navigate = useNavigate();

    const [request, setRequest] = useState<MediaRequest>({
        title: "",
        videoUrl: "",
        displayOrder: 1,
    });

    const [thumbnail, setThumbnail] = useState<File | null>(null);

    const [preview, setPreview] = useState<string>("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const { name, value } = e.target;

        setRequest((prev) => ({
            ...prev,
            [name]:
                name === "displayOrder"
                    ? Number(value)
                    : value,
        }));
    };

    const handleThumbnail = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        if (!e.target.files?.length) return;

        const file = e.target.files[0];

        setThumbnail(file);

        setPreview(URL.createObjectURL(file));
    };

    const validate = (): boolean => {

        if (!request.title.trim()) {

            setError("Title is required.");

            return false;
        }

        if (!request.videoUrl.trim()) {

            setError("Video URL is required.");

            return false;
        }

        if (request.displayOrder <= 0) {

            setError("Display Order should be greater than zero.");

            return false;
        }

        if (!thumbnail) {

            setError("Thumbnail Image is required.");

            return false;
        }

        setError("");

        return true;
    };

    const saveMedia = async () => {

        if (!validate()) return;

        try {

            setLoading(true);

            await MediaService.addMedia(
                request,
                thumbnail!
            );

            setSuccess("Media added successfully.");

            setTimeout(() => {

                navigate("/admin/media");

            }, 1000);

        } catch (err: any) {

            console.error(err);

            setError(
                err?.response?.data?.message ??
                "Failed to save media."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <Card>

            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                    }}
                >

                    <Typography variant="h5">

                        Add Media

                    </Typography>

                    <Button
                        startIcon={<ArrowBack />}
                        variant="outlined"
                        onClick={() => navigate("/admin/media")}
                    >

                        Back

                    </Button>

                </Box>

                {error && (

                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>

                )}

                {success && (

                    <Alert
                        severity="success"
                        sx={{ mb: 2 }}
                    >
                        {success}
                    </Alert>

                )}

                <Grid container spacing={3}>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField
                            fullWidth
                            required
                            label="Title"
                            name="title"
                            value={request.title}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField
                            fullWidth
                            required
                            label="Display Order"
                            name="displayOrder"
                            type="number"
                            value={request.displayOrder}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <TextField
                            fullWidth
                            required
                            label="Video URL"
                            name="videoUrl"
                            value={request.videoUrl}
                            onChange={handleChange}
                            placeholder="https://youtube.com/watch?v=..."
                        />

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <Button
                            variant="contained"
                            component="label"
                        >

                            Upload Thumbnail

                            <input
                                hidden
                                accept="image/*"
                                type="file"
                                onChange={handleThumbnail}
                            />

                        </Button>

                    </Grid>

                    {preview && (

                        <Grid size={{ xs: 12 }}>

                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    width: 300,
                                }}
                            >

                                <Typography
                                    sx={{ mb: 2, fontWeight: "bold" }}
                                >

                                    Thumbnail Preview

                                </Typography>

                                <img
                                    src={preview}
                                    alt="Preview"
                                    style={{
                                        width: "100%",
                                        borderRadius: 8,
                                    }}
                                />

                            </Paper>

                        </Grid>

                    )}

                    <Grid size={{ xs: 12 }}>

                        <Button
                            variant="contained"
                            startIcon={
                                loading
                                    ? <CircularProgress size={18} color="inherit" />
                                    : <Save />
                            }
                            disabled={loading}
                            onClick={saveMedia}
                        >

                            {loading
                                ? "Saving..."
                                : "Save Media"}

                        </Button>

                    </Grid>

                </Grid>

            </CardContent>

        </Card>

    );

};

export default AddMedia;