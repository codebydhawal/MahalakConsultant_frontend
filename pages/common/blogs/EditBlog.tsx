import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import{getDashboardBasePath} from "../../../services/RouteUtils";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography,
    Snackbar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";

import {
    ArrowBack,
    CloudUpload,
    Save,
} from "@mui/icons-material";

import BlogService from "../../../services/BlogService";
import { BlogRequest } from "../../../services/BlogRequest";
import { BlogResponse } from "../../../services/BlogResponse";
import {
    BLOG_CATEGORIES,
    BLOG_STATUS_OPTIONS,
    BlogStatus,
} from "../../../services/BlogConstants";

const EditBlog = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const basePath = getDashboardBasePath();
    /*----------------------------------------------------------
     * Loading
     *---------------------------------------------------------*/

    const [pageLoading, setPageLoading] = useState(true);

    const [loading, setLoading] = useState(false);

    /*----------------------------------------------------------
     * Dirty State
     *---------------------------------------------------------*/

    const [dirty, setDirty] = useState(false);

    /*----------------------------------------------------------
     * Existing Blog
     *---------------------------------------------------------*/

    const [existingBlog, setExistingBlog] =
        useState<BlogResponse | null>(null);

    /*----------------------------------------------------------
     * Request
     *---------------------------------------------------------*/

    const [blog, setBlog] = useState<BlogRequest>({
        title: "",
        authorName: "",
        shortDescription: "",
        category: "",
        tags: [],
        publishDate: "",
        status: BlogStatus.DRAFT,
    });

    /*----------------------------------------------------------
     * Tags
     *---------------------------------------------------------*/

    const [tagInput, setTagInput] = useState("");

    /*----------------------------------------------------------
     * Files
     *---------------------------------------------------------*/

    const [featuredImage, setFeaturedImage] =
        useState<File | null>(null);

    const [authorImage, setAuthorImage] =
        useState<File | null>(null);

    const [blogDocument, setBlogDocument] =
        useState<File | null>(null);

    /*----------------------------------------------------------
     * Preview
     *---------------------------------------------------------*/

    const [featuredPreview, setFeaturedPreview] =
        useState("");

    const [authorPreview, setAuthorPreview] =
        useState("");

    /*----------------------------------------------------------
     * Load Blog
     *---------------------------------------------------------*/

    useEffect(() => {

        if (!id) return;

        loadBlog(id);

    }, [id]);

    const loadBlog = async (blogId: string) => {

        try {

            setPageLoading(true);

            const response =
                await BlogService.getBlogById(blogId);

            const data = response.data.data;


            console.log(data);
            console.log("Featured:", data.featuredImageUrl);
            console.log("Author:", data.authorImageUrl);

            setExistingBlog(data);

            setBlog({
                title: data.title,
                authorName: data.authorName,
                shortDescription: data.shortDescription,
                category: data.category,
                tags: data.tags,
                publishDate: data.publishDate,
                status: data.status,
            });

            setTagInput(data.tags.join(", "));

            setFeaturedPreview(
                data.featuredImageUrl
            );

            setAuthorPreview(
                data.authorImageUrl
            );

        } catch (error) {

            console.error(error);

        } finally {

            setPageLoading(false);

        }

    };

    /*----------------------------------------------------------
     * Handlers
     *---------------------------------------------------------*/

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {

        setDirty(true);

        setBlog({
            ...blog,
            [e.target.name]: e.target.value,
        });

    };

    const handleCategoryChange = (
        e: SelectChangeEvent
    ) => {

        setDirty(true);

        setBlog({
            ...blog,
            category: e.target.value,
        });

    };

    const handleStatusChange = (
        e: SelectChangeEvent
    ) => {

        setDirty(true);

        setBlog({
            ...blog,
            status: e.target.value as BlogStatus,
        });

    };

    const handleTagChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {

        setDirty(true);

        setTagInput(e.target.value);

        const tags = e.target.value
            .split(",")
            .map(tag => tag.trim())
            .filter(Boolean);

        setBlog({
            ...blog,
            tags,
        });

    };

    const handleFeaturedImage = (
        e: ChangeEvent<HTMLInputElement>
    ) => {

        const file = e.target.files?.[0];

        if (!file) return;

        setDirty(true);

        setFeaturedImage(file);

        setFeaturedPreview(
            URL.createObjectURL(file)
        );

    };

    const handleAuthorImage = (
        e: ChangeEvent<HTMLInputElement>
    ) => {

        const file = e.target.files?.[0];

        if (!file) return;

        setDirty(true);

        setAuthorImage(file);

        setAuthorPreview(
            URL.createObjectURL(file)
        );

    };

    const handleBlogDocument = (
        e: ChangeEvent<HTMLInputElement>
    ) => {

        const file = e.target.files?.[0];

        if (!file) return;

        setDirty(true);

        setBlogDocument(file);

    };

    /*----------------------------------------------------------
     * Snackbar
     *---------------------------------------------------------*/

    const [successOpen, setSuccessOpen] = useState(false);

    const [errorOpen, setErrorOpen] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    /*----------------------------------------------------------
     * Leave Confirmation
     *---------------------------------------------------------*/

    const [openLeaveDialog, setOpenLeaveDialog] = useState(false);

    /*----------------------------------------------------------
     * Update Blog
     * (Part 2)
     *---------------------------------------------------------*/

    const updateBlog = async () => {

        if (loading) return;

        if (!id) return;

        if (!blog.title.trim()) {

            setErrorMessage("Blog title is required.");

            setErrorOpen(true);

            return;

        }

        if (!blog.authorName.trim()) {

            setErrorMessage("Author name is required.");

            setErrorOpen(true);

            return;

        }

        if (!blog.shortDescription.trim()) {

            setErrorMessage("Short description is required.");

            setErrorOpen(true);

            return;

        }

        if (!blog.category) {

            setErrorMessage("Category is required.");

            setErrorOpen(true);

            return;

        }

        if (!blog.publishDate) {

            setErrorMessage("Publish date is required.");

            setErrorOpen(true);

            return;

        }

        try {

            setLoading(true);

            await BlogService.updateBlog(

                id,

                blog,

                featuredImage ?? undefined,

                blogDocument ?? undefined,

                authorImage ?? undefined

            );

            setDirty(false);

            setSuccessOpen(true);

            setTimeout(() => {

                navigate(`${basePath}/blogs`);

            }, 1200);

        } catch (error: any) {

            setErrorMessage(

                error?.response?.data?.message ||

                "Unable to update blog."

            );

            setErrorOpen(true);

        } finally {

            setLoading(false);

        }

    };

    if (pageLoading) {

        return (

            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>

                <CircularProgress />

            </Box>

        );

    }

    return (
        <>        <Card>

            <CardContent>

                <Stack
                    direction="row"
                    sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3
                    }}
                >

                    <Typography
                        variant="h5"
                        component="h2"
                        sx={{ fontWeight: "bold" }}
                    >

                        Edit Blog

                    </Typography>

                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => {

                            if (dirty) {

                                setOpenLeaveDialog(true);

                                return;

                            }

                            navigate(`${basePath}/blogs`);

                        }}
                    >

                        Back

                    </Button>

                </Stack>

                <Divider sx={{ mb: 4 }} />

                <Grid
                    container
                    spacing={3}
                >

                    <Grid size={{ xs: 12 }}>

                        <TextField
                            fullWidth
                            label="Blog Title"
                            name="title"
                            value={blog.title}
                            onChange={handleInputChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField
                            fullWidth
                            label="Author Name"
                            name="authorName"
                            value={blog.authorName}
                            onChange={handleInputChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <FormControl fullWidth>

                            <InputLabel>

                                Category

                            </InputLabel>

                            <Select
                                value={blog.category}
                                label="Category"
                                onChange={handleCategoryChange}
                            >

                                {BLOG_CATEGORIES.map(category => (

                                    <MenuItem
                                        key={category}
                                        value={category}
                                    >

                                        {category}

                                    </MenuItem>

                                ))}

                            </Select>

                        </FormControl>

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Short Description"
                            name="shortDescription"
                            value={blog.shortDescription}
                            onChange={handleInputChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <TextField
                            fullWidth
                            label="Tags"
                            value={tagInput}
                            helperText="Comma separated"
                            onChange={handleTagChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField
                            fullWidth
                            type="date"
                            name="publishDate"
                            label="Published Date"
                            value={blog.publishDate}
                            onChange={handleInputChange}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <FormControl fullWidth>

                            <InputLabel>

                                Status

                            </InputLabel>

                            <Select
                                value={blog.status}
                                label="Status"
                                onChange={handleStatusChange}
                            >

                                {BLOG_STATUS_OPTIONS.map(item => (

                                    <MenuItem
                                        key={item.value}
                                        value={item.value}
                                    >

                                        {item.label}

                                    </MenuItem>

                                ))}

                            </Select>

                        </FormControl>

                    </Grid>

                    {/* Existing Featured Image */}

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Typography sx={{ fontWeight: 'bold', mb: 1 }}>

                            Featured Image

                        </Typography>

                        {featuredPreview && (

                            <img
                                src={featuredPreview}
                                alt=""
                                style={{
                                    width: "100%",
                                    height: 220,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                }}
                            />

                        )}

                        <Button
                            sx={{ mt: 2 }}
                            component="label"
                            variant="outlined"
                            startIcon={<CloudUpload />}
                            fullWidth
                        >

                            Replace Featured Image

                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={handleFeaturedImage}
                            />

                        </Button>

                    </Grid>

                    {/* Existing Author Image */}

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Typography
                            sx={{ fontWeight: "bold", mb: 1 }}
                        >

                            Author Image

                        </Typography>

                        {authorPreview && (

                            <img
                                src={authorPreview}
                                alt=""
                                style={{
                                    width: 180,
                                    height: 180,
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                }}
                            />

                        )}

                        <Button
                            sx={{ mt: 2 }}
                            component="label"
                            variant="outlined"
                            startIcon={<CloudUpload />}
                            fullWidth
                        >

                            Replace Author Image

                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={handleAuthorImage}
                            />

                        </Button>

                    </Grid>

                    {/* Blog Document */}

                    <Grid size={{ xs: 12 }}>

                        <Alert severity="info">

                            Current Blog Document will remain unchanged unless a new file is uploaded.

                        </Alert>

                        <Button
                            sx={{ mt: 2 }}
                            fullWidth
                            component="label"
                            variant="outlined"
                            startIcon={<CloudUpload />}
                        >

                            Replace Blog Document

                            <input
                                hidden
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleBlogDocument}
                            />

                        </Button>

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{ justifyContent: "flex-end" }}
                        >

                            <Button

                                variant="outlined"

                                disabled={loading}

                                onClick={() => {

                                    if (dirty) {

                                        setOpenLeaveDialog(true);

                                        return;

                                    }

                                    navigate(`${basePath}/blogs`);

                                }}

                            >

                                Cancel

                            </Button>

                            <Button

                                variant="contained"

                                startIcon={

                                    loading

                                        ? <CircularProgress
                                            size={20}
                                            color="inherit"
                                        />

                                        : <Save />

                                }

                                disabled={loading}

                                onClick={updateBlog}

                            >

                                {loading

                                    ? "Updating..."

                                    : "Update Blog"}

                            </Button>

                        </Stack>

                    </Grid>

                </Grid>

            </CardContent>

            <Dialog
                open={openLeaveDialog}
                onClose={() => setOpenLeaveDialog(false)}
            >

                <DialogTitle>

                    Unsaved Changes

                </DialogTitle>

                <DialogContent>

                    You have unsaved changes.

                    Do you really want to leave?

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() =>
                            setOpenLeaveDialog(false)
                        }
                    >

                        Stay

                    </Button>

                    <Button
                        color="error"
                        onClick={() => {
                            setOpenLeaveDialog(false);
                            navigate(`${basePath}/blogs`);
                        }}
                    >
                        Leave
                    </Button>

                </DialogActions>

            </Dialog>

        </Card>
            <Snackbar
                open={successOpen}
                autoHideDuration={3000}
                onClose={() =>
                    setSuccessOpen(false)
                }
            >

                <Alert severity="success">

                    Blog updated successfully.

                </Alert>

            </Snackbar>

            <Snackbar
                open={errorOpen}
                autoHideDuration={4000}
                onClose={() =>
                    setErrorOpen(false)
                }
            >

                <Alert severity="error">

                    {errorMessage}

                </Alert>

            </Snackbar>
        </>
    );

};

export default EditBlog;
