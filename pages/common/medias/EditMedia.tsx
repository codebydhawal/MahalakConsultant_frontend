import React, { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import {
    ArrowBack,
    Save,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import MediaService from "../../../services/MediaService";
import {
    MediaRequest,
    MediaResponse,
} from "../../../services/Media";

const EditMedia: React.FC = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [thumbnail, setThumbnail] = useState<File | undefined>();

    const [preview, setPreview] = useState("");

    const [request, setRequest] = useState<MediaRequest>({
        title: "",
        videoUrl: "",
        displayOrder: 1,
    });

    useEffect(() => {

        if (id) {

            loadMedia(id);

        }

    }, [id]);

    const loadMedia = async (mediaId: string) => {

        try {

            setLoading(true);

            const response = await MediaService.getMediaById(mediaId);

             const media = response.data.data;

            setRequest({

                title: media.title,

                videoUrl: media.videoUrl,

                displayOrder: media.displayOrder,

            });

            setPreview(media.thumbnailImageUrl);

        } catch (err) {

            console.error(err);

            setError("Failed to load media.");

        } finally {

            setLoading(false);

        }

    };

    const handleChange = (

        e: React.ChangeEvent<HTMLInputElement>

    ) => {

        const { name, value } = e.target;

        setRequest({

            ...request,

            [name]:
                name === "displayOrder"
                    ? Number(value)
                    : value,

        });

    };

    const handleThumbnail = (

        e: React.ChangeEvent<HTMLInputElement>

    ) => {

        if (!e.target.files?.length) return;

        const file = e.target.files[0];

        setThumbnail(file);

        setPreview(URL.createObjectURL(file));

    };

    const validate = () => {

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

        setError("");

        return true;

    };

    const updateMedia = async () => {

        if (!validate()) {

            return;

        }

        try {

            setSaving(true);

            await MediaService.updateMedia(

                id!,

                request,

                thumbnail

            );

            setSuccess("Media updated successfully.");

            setTimeout(() => {

                navigate("/admin/media");

            }, 1000);

        } catch (err: any) {

            console.error(err);

            setError(

                err?.response?.data?.message ||

                "Failed to update media."

            );

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

    return (

        <Card>

            <CardContent>


                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>

                    <Typography variant="h5">

                        Edit Media

                    </Typography>

                    <Button

                        variant="outlined"

                        startIcon={<ArrowBack />}

                        onClick={() => navigate("/admin/media")}

                    >

                        Back

                    </Button>

                </Box>

                {error && (

                    <Alert severity="error" sx={{ mb: 2 }}>

                        {error}

                    </Alert>

                )}

                {success && (

                    <Alert severity="success" sx={{ mb: 2 }}>

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

                            type="number"

                            label="Display Order"

                            name="displayOrder"

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

                        />

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <Typography sx={{ mb: 1 }}>

                            Current Thumbnail

                        </Typography>

                        <Paper

                            sx={{

                                p: 2,

                                width: 300,

                            }}

                        >

                            <img

                                src={preview}

                                alt="Thumbnail"

                                style={{

                                    width: "100%",

                                    borderRadius: 8,

                                }}

                            />

                        </Paper>

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <Button

                            variant="contained"

                            component="label"

                        >

                            Change Thumbnail

                            <input

                                hidden

                                type="file"

                                accept="image/*"

                                onChange={handleThumbnail}

                            />

                        </Button>

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <Button

                            variant="contained"

                            color="primary"

                            startIcon={

                                saving

                                    ? <CircularProgress size={18} color="inherit" />

                                    : <Save />

                            }

                            disabled={saving}

                            onClick={updateMedia}

                        >

                            {saving

                                ? "Updating..."

                                : "Update Media"}

                        </Button>

                    </Grid>

                </Grid>

            </CardContent>

        </Card>

    );

};

export default EditMedia;