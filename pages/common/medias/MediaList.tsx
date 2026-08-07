import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Typography,
    Avatar,
} from "@mui/material";

import {
    Add,
    Delete,
    Edit,
    Search,
    OpenInNew,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import MediaService from "../../../services/MediaService";
import { MediaResponse } from "../../../services/Media";
import mediaService from "../../../services/MediaService";

const MediaList: React.FC = () => {

    const navigate = useNavigate();

    const [media, setMedia] = useState<MediaResponse[]>([]);
    const [filteredMedia, setFilteredMedia] = useState<MediaResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        loadMedia();
    }, []);

    const loadMedia = async () => {

        try {

            setLoading(true);

            const response = await mediaService.getAllMedia();

            const mediaData = response.data.data;

            mediaData.sort(
                (a: MediaResponse, b: MediaResponse) =>
                    a.displayOrder - b.displayOrder
            );

            setMedia(mediaData);
            setFilteredMedia(mediaData);
            setSelectedImage(mediaData[0]?.thumbnailImageUrl);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const handleSearch = (value: string) => {

        setSearch(value);

        if (!value.trim()) {
            setFilteredMedia(media);
            return;
        }

        const filtered = media.filter((item) =>
            item.title
                .toLowerCase()
                .includes(value.toLowerCase())
        );

        setFilteredMedia(filtered);

    };

    const deleteMedia = () => {

        if (!deleteId) return;

        MediaService.deleteMedia(deleteId)
            .then(() => {

                loadMedia();

                setDeleteId(null);

            })
            .catch((error) => {
                console.error(error);
            });

    };

    if (loading) {
        return (
            <Box
                sx={{ display: "flex", justifyContent: "center", mt: 5 }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (

        <Card>

            <CardContent>

                <Box
                    sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
                >

                    <Typography variant="h5">
                        Media Management
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate("/admin/media/add")}
                    >
                        Add Media
                    </Button>

                </Box>

                <Box
                    sx={{ display: "flex", mb: 3 }}
                >

                    <TextField
                        fullWidth
                        label="Search Media"
                        value={search}
                        onChange={(e) =>
                            handleSearch(e.target.value)
                        }
                    />

                    <IconButton>

                        <Search />

                    </IconButton>

                </Box>

                <Typography
                    sx={{ mb: 2 }}
                    color="primary"
                >
                    Total Media : {filteredMedia.length}
                </Typography>

                <TableContainer component={Paper}>

                    <Table>

                        <TableHead>

                            <TableRow>

                                <TableCell font-weight="bold">Thumbnail</TableCell>

                                <TableCell font-weight="bold">Title</TableCell>

                                <TableCell font-weight="bold">Video</TableCell>

                                <TableCell font-weight="bold">Display Order</TableCell>

                                <TableCell align="center" font-weight="bold">
                                    Actions
                                </TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>

                            {filteredMedia.map((item) => (

                                <TableRow key={item.mediaId}>

                                    <TableCell>

                                        <img
                                            src={item.thumbnailImageUrl}
                                            style={{
                                                width: 120,
                                                height: 70,
                                                objectFit: "cover",
                                                borderRadius: 6,
                                            }}
                                            onLoad={() => console.log("Loaded:", item.thumbnailImageUrl)}
                                            onError={() => console.log("Failed:", item.thumbnailImageUrl)}
                                        />

                                    </TableCell>

                                    <TableCell>

                                        {item.title}

                                    </TableCell>

                                    <TableCell>

                                        <Button
                                            endIcon={<OpenInNew />}
                                            onClick={() =>
                                                window.open(
                                                    item.videoUrl,
                                                    "_blank"
                                                )
                                            }
                                        >
                                            Open Video
                                        </Button>

                                    </TableCell>

                                    <TableCell>

                                        {item.displayOrder}

                                    </TableCell>

                                    <TableCell align="center">

                                        <IconButton
                                            color="primary"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/media/edit/${item.mediaId}`
                                                )
                                            }
                                        >

                                            <Edit />

                                        </IconButton>

                                        <IconButton
                                            color="error"
                                            onClick={() =>
                                                setDeleteId(item.mediaId)
                                            }
                                        >

                                            <Delete />

                                        </IconButton>

                                    </TableCell>

                                </TableRow>

                            ))}

                        </TableBody>

                    </Table>

                </TableContainer>

            </CardContent>

            <Dialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
            >

                <DialogTitle>

                    Delete Media

                </DialogTitle>

                <DialogContent>

                    <DialogContentText>

                        Are you sure you want to delete this media?

                    </DialogContentText>

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() => setDeleteId(null)}
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={deleteMedia}
                    >
                        Delete
                    </Button>

                </DialogActions>

            </Dialog>

        </Card>

    );

};

export default MediaList;