import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
    CircularProgress,
} from "@mui/material";

import {
    ArrowBack,
    CloudUpload,
    Save,
    WarningAmber,
} from "@mui/icons-material";

import BlogService from "../../../services/BlogService";
import { BlogRequest } from "../../../services/BlogRequest";
import {
    BLOG_CATEGORIES,
    BLOG_STATUS_OPTIONS,
    BlogStatus,
} from "../../../services/BlogConstants";

import{getDashboardBasePath} from "../../../services/RouteUtils";

const AddBlog = () => {

    const navigate = useNavigate();
    const basePath = getDashboardBasePath();

    /*----------------------------------------------------------
     * Disclaimer Dialog
     *---------------------------------------------------------*/

    const [openDisclaimer, setOpenDisclaimer] = useState(true);

    /*----------------------------------------------------------
     * Loading
     *---------------------------------------------------------*/

    const [loading, setLoading] = useState(false);

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
     * Tags
     *---------------------------------------------------------*/

    const [tagInput, setTagInput] = useState("");

    /*----------------------------------------------------------
     * Blog Request
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
     * Handlers
     *---------------------------------------------------------*/

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {

        setBlog({
            ...blog,
            [e.target.name]: e.target.value,
        });

    };

    const handleStatusChange = (
        e: SelectChangeEvent
    ) => {

        setBlog({
            ...blog,
            status: e.target.value as BlogStatus,
        });

    };

    const handleCategoryChange = (
        e: SelectChangeEvent
    ) => {

        setBlog({
            ...blog,
            category: e.target.value,
        });

    };

    const handleTagChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {

        setTagInput(e.target.value);

        const tags = e.target.value
            .split(",")
            .map((tag) => tag.trim())
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

        setBlogDocument(file);

    };

    const resetForm = () => {

        setBlog({
            title: "",
            authorName: "",
            shortDescription: "",
            category: "",
            tags: [],
            publishDate: "",
            status: BlogStatus.DRAFT,
        });

        setTagInput("");

        setFeaturedImage(null);
        setAuthorImage(null);
        setBlogDocument(null);

        setFeaturedPreview("");
        setAuthorPreview("");
    };

    /*----------------------------------------------------------
     * Snackbar
     *---------------------------------------------------------*/

    const [successOpen, setSuccessOpen] = useState(false);

    const [errorOpen, setErrorOpen] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    /*----------------------------------------------------------
     * Submit
     * (Implemented in Part-2)
     *---------------------------------------------------------*/

    const saveBlog = async () => {
        if (loading) return;

        if (blog.title.trim() === "") {

            setErrorMessage("Blog title is required.");

            setErrorOpen(true);

            return;

        }

        if (blog.authorName.trim() === "") {

            setErrorMessage("Author name is required.");

            setErrorOpen(true);

            return;

        }

        if (blog.shortDescription.trim() === "") {

            setErrorMessage("Short description is required.");

            setErrorOpen(true);

            return;

        }

        if (blog.category === "") {

            setErrorMessage("Category is required.");

            setErrorOpen(true);

            return;

        }

        if (blog.publishDate === "") {

            setErrorMessage("Publish date is required.");

            setErrorOpen(true);

            return;

        }

        if (!featuredImage) {

            setErrorMessage("Please upload featured image.");

            setErrorOpen(true);

            return;

        }

        if (!blogDocument) {

            setErrorMessage("Please upload blog document.");

            setErrorOpen(true);

            return;

        }

        try {

            setLoading(true);

            await BlogService.addBlog(

                blog,

                featuredImage,

                blogDocument,

                authorImage ?? undefined

            );

            resetForm();
            setSuccessOpen(true);

            setTimeout(() => {

                navigate(`${basePath}/blogs`);

            }, 1200);

        } catch (error: any) {

            setErrorMessage(

                error?.response?.data?.message ||

                "Unable to create blog."

            );

            setErrorOpen(true);

        } finally {

            setLoading(false);

        }

    };

    return (

        <>

            {/*====================================================
                         Disclaimer Dialog
            ====================================================*/}

            <Dialog
                open={openDisclaimer}
                maxWidth="md"
                fullWidth
                onClose={(_, reason) => {
                    if (
                        reason === "backdropClick" ||
                        reason === "escapeKeyDown"
                    ) {
                        return;
                    }
                }}
            >

                <DialogTitle>

                    <Stack
                        sx={{ direction: "row", spacing: 1, alignItems: "center" }}
                    >

                        <WarningAmber
                            color="warning"
                        />

                        <Typography
                            sx={{ variant: "h5", fontWeight: "bold" }}
                        >

                            Blog Creation Disclaimer

                        </Typography>

                    </Stack>

                </DialogTitle>

                <DialogContent dividers>

                    <Alert
                        severity="warning"
                        sx={{ mb: 3 }}
                    >

                        Before you continue,
                        please read the following
                        information carefully.

                    </Alert>

                    <Typography
                        sx={{ mb: 2 }}
                    >

                        You are responsible for
                        preparing and uploading
                        your complete blog content.

                    </Typography>

                    <Typography
                        sx={{ mb: 2 }}
                    >

                        This includes, but is not
                        limited to:

                    </Typography>

                    <ul>

                        <li>Images</li>

                        <li>Graphs</li>

                        <li>Charts</li>

                        <li>Tables</li>

                        <li>Screenshots</li>

                        <li>Infographics</li>

                        <li>Related Content</li>

                        <li>References</li>

                        <li>
                            Any other supporting
                            material required for
                            the blog.
                        </li>

                    </ul>

                    <Typography
                        sx={{ mt: 2 }}
                    >

                        The application will
                        not generate, validate,
                        verify or manage your
                        blog content.

                    </Typography>

                    <Typography
                        sx={{ mt: 2, fontWeight: "bold" }}
                    >

                        Please ensure your
                        document is complete
                        before uploading.

                    </Typography>

                </DialogContent>

                <DialogActions>

                    <Button
                        color="error"
                        onClick={() =>
                            navigate(`${basePath}/blogs`)
                        }
                    >

                        Cancel

                    </Button>

                    <Button
                        variant="contained"
                        onClick={() =>
                            setOpenDisclaimer(
                                false
                            )
                        }
                    >

                        I Understand &
                        Continue

                    </Button>

                </DialogActions>

            </Dialog>

            {/*====================================================
                          Add Blog Form
            ====================================================*/}

            {!openDisclaimer && (

                <Card>

                    <CardContent>

                        <Stack
                            direction="row"
                            sx={{ justifyContent: "space-between", alignItems: "center", mb: 3 }}
                        >

                            <Typography
                                sx={{ variant: "h5", fontWeight: "bold" }}
                            >

                                Add Blog

                            </Typography>

                            <Button
                                startIcon={<ArrowBack />}
                                onClick={() => navigate(`${basePath}/blogs`)}
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
                                    required
                                    label="Blog Title"
                                    name="title"
                                    value={
                                        blog.title
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                />

                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>

                                <TextField
                                    fullWidth
                                    required
                                    label="Author Name"
                                    name="authorName"
                                    value={
                                        blog.authorName
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                />

                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>

                                <FormControl
                                    fullWidth
                                >

                                    <InputLabel>

                                        Category

                                    </InputLabel>

                                    <Select
                                        value={
                                            blog.category
                                        }
                                        label="Category"
                                        onChange={
                                            handleCategoryChange
                                        }
                                    >

                                        {BLOG_CATEGORIES.map(
                                            (
                                                category
                                            ) => (

                                                <MenuItem
                                                    key={
                                                        category
                                                    }
                                                    value={
                                                        category
                                                    }
                                                >

                                                    {
                                                        category
                                                    }

                                                </MenuItem>

                                            )
                                        )}

                                    </Select>

                                </FormControl>

                            </Grid>

                            <Grid size={{ xs: 12 }}>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    required
                                    label="Short Description"
                                    name="shortDescription"
                                    value={
                                        blog.shortDescription
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                />

                            </Grid>

                            <Grid size={{ xs: 12 }}>

                                <TextField
                                    fullWidth
                                    label="Tags"
                                    helperText="Comma separated values"
                                    value={tagInput}
                                    onChange={
                                        handleTagChange
                                    }
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

                                <FormControl
                                    fullWidth
                                >

                                    <InputLabel>

                                        Blog Status

                                    </InputLabel>

                                    <Select
                                        value={
                                            blog.status
                                        }
                                        label="Blog Status"
                                        onChange={
                                            handleStatusChange
                                        }
                                    >

                                        {BLOG_STATUS_OPTIONS.map(
                                            (
                                                item
                                            ) => (

                                                <MenuItem
                                                    key={
                                                        item.value
                                                    }
                                                    value={
                                                        item.value
                                                    }
                                                >

                                                    {
                                                        item.label
                                                    }

                                                </MenuItem>

                                            )
                                        )}

                                    </Select>

                                </FormControl>

                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>

                                <Button
                                    fullWidth
                                    component="label"
                                    variant="outlined"
                                    startIcon={
                                        <CloudUpload />
                                    }
                                >

                                    Featured
                                    Image

                                    <input
                                        hidden
                                        type="file"
                                        accept="image/*"
                                        onChange={
                                            handleFeaturedImage
                                        }
                                    />

                                </Button>

                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>

                                <Button
                                    fullWidth
                                    component="label"
                                    variant="outlined"
                                    startIcon={
                                        <CloudUpload />
                                    }
                                >

                                    Author Image

                                    <input
                                        hidden
                                        type="file"
                                        accept="image/*"
                                        onChange={
                                            handleAuthorImage
                                        }
                                    />

                                </Button>

                            </Grid>

                            <Grid size={{ xs: 12 }}>

                                <Button
                                    fullWidth
                                    component="label"
                                    variant="outlined"
                                    startIcon={
                                        <CloudUpload />
                                    }
                                >

                                    Upload Blog
                                    Document

                                    <input
                                        hidden
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={
                                            handleBlogDocument
                                        }
                                    />

                                </Button>

                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>

                                {featuredPreview && (

                                    <Box>

                                        <Typography
                                            sx={{ mb: 1, fontWeight: "bold" }}
                                        >

                                            Featured Image Preview

                                        </Typography>

                                        <img
                                            src={featuredPreview}
                                            alt=""
                                            style={{
                                                width: "100%",
                                                maxHeight: 250,
                                                objectFit: "cover",
                                                borderRadius: 10,
                                            }}
                                        />

                                    </Box>

                                )}

                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>

                                {authorPreview && (

                                    <Box>

                                        <Typography
                                            sx={{ mb: 1, fontWeight: "bold" }}
                                        >

                                            Author Image Preview

                                        </Typography>

                                        <img
                                            src={authorPreview}
                                            alt=""
                                            style={{
                                                width: 180,
                                                height: 180,
                                                objectFit: "cover",
                                                borderRadius: "50%",
                                            }}
                                        />

                                    </Box>

                                )}

                            </Grid>

                            <Grid size={{ xs: 12 }}>

                                {blogDocument && (

                                    <Alert severity="info">

                                        Selected Blog Document :

                                        <strong>

                                            {" "}

                                            {blogDocument.name}

                                        </strong>

                                    </Alert>

                                )}

                            </Grid>

                            <Grid size={{ xs: 12 }}>

                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{ justifyContent: "flex-end" }}
                                >

                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate(`${basePath}/blogs`)}
                                    >
                                        Cancel
                                    </Button>

                                    <Button

                                        variant="contained"

                                        startIcon={

                                            loading

                                                ? <CircularProgress size={20} color="inherit" />

                                                : <Save />

                                        }

                                        disabled={loading}

                                        onClick={saveBlog}

                                    >

                                        {loading

                                            ? "Saving..."

                                            : "Save Blog"}

                                    </Button>

                                </Stack>

                            </Grid>

                        </Grid>

                    </CardContent>

                </Card>

            )}

            <Snackbar

                open={successOpen}

                autoHideDuration={3000}

                onClose={() => setSuccessOpen(false)}

            >

                <Alert severity="success">

                    Blog created successfully.

                </Alert>

            </Snackbar>

            <Snackbar

                open={errorOpen}

                autoHideDuration={4000}

                onClose={() => setErrorOpen(false)}

            >

                <Alert severity="error">

                    {errorMessage}

                </Alert>

            </Snackbar>
        </>

    );

};

export default AddBlog;