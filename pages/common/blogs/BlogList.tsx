import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
    CardMedia,
    CardActions,
    Grid,
} from "@mui/material";

import {
    Add,
    Delete,
    Edit,
    Search,
    Visibility,
} from "@mui/icons-material";

import BlogService from "../../../services/BlogService";
import { BlogResponse } from "../../../services/BlogResponse";
import { BlogStatus } from "../../../services/BlogConstants";

const BlogList = () => {

    const navigate = useNavigate();

    const [blogs, setBlogs] = useState<BlogResponse[]>([]);
    const [filteredBlogs, setFilteredBlogs] = useState<BlogResponse[]>([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        loadBlogs();
    }, []);

    useEffect(() => {

        let data = blogs;

        if (search.trim() !== "") {
            data = data.filter((blog) =>
                blog.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (status !== "") {
            data = data.filter((blog) => blog.status === status);
        }

        setFilteredBlogs(data);

    }, [search, status, blogs]);

    const loadBlogs = () => {

        BlogService.getAllBlogs()
            .then((response) => {

                setBlogs(response.data.data);
                setFilteredBlogs(response.data.data);

            })
            .catch(console.error);
    };

    const deleteBlog = (blogId: string) => {

        if (!window.confirm("Delete this blog?")) return;

        BlogService.deleteBlog(blogId)
            .then(() => loadBlogs())
            .catch(console.error);

    };

    const handleStatus = (
        event: SelectChangeEvent
    ) => {

        setStatus(event.target.value);

    };

    return (

        <Box>

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

                        <Typography variant="h5" component="h5" sx={{ fontWeight: "bold" }}>

                            Blog Management

                        </Typography>

                        <Button
                            onClick={() => navigate("add")}
                        >
                            Add Blog
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            mb: 3,
                        }}
                    >

                        <TextField
                            fullWidth
                            placeholder="Search Blog..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        <FormControl sx={{ minWidth: 220 }}>

                            <InputLabel>

                                Status

                            </InputLabel>

                            <Select
                                value={status}
                                label="Status"
                                onChange={handleStatus}
                            >

                                <MenuItem value="">
                                    All
                                </MenuItem>

                                <MenuItem value={BlogStatus.DRAFT}>
                                    Draft
                                </MenuItem>

                                <MenuItem value={BlogStatus.UNPUBLISHED}>
                                    Unpublished
                                </MenuItem>

                                <MenuItem value={BlogStatus.PUBLISHED}>
                                    Published
                                </MenuItem>

                            </Select>

                        </FormControl>

                    </Box>

                    <Paper sx={{ p: 3 }}>

                        <Grid container spacing={3}>

                            {filteredBlogs
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((blog) => (

                                    <Grid
                                        key={blog.id}
                                        size={{ xs: 12, sm: 6, md: 4 }}
                                    >

                                        <Card
                                            onClick={() => navigate(`view/${blog.id}`)}
                                            sx={{
                                                borderRadius: 4,
                                                overflow: "hidden",
                                                transition: "0.3s",
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                "&:hover": {
                                                    transform: "translateY(-6px)",
                                                    boxShadow: 8,
                                                },
                                            }}
                                        >

                                            {/* <CardMedia
                                                component="img"
                                                height="220"
                                                image={blog.featuredImageUrl}
                                                alt={blog.title}
                                            /> */}
                                            {/* <CardMedia
                                                component="img"
                                                image={blog.featuredImageUrl}
                                                alt={blog.title}
                                                sx={{
                                                    height: 220,
                                                    width: "100%",
                                                    objectFit: "cover", // fills card without distortion
                                                }}
                                            /> */}

                                            <Box
                                                sx={{
                                                    width: "100%",
                                                    height: 220,
                                                    overflow: "hidden",
                                                }}
                                            >

                                                <img
                                                    src={blog.featuredImageUrl}
                                                    alt={blog.title}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                        display: "block",
                                                    }}
                                                    onLoad={() => console.log("Loaded")}
                                                    onError={(e) => {
                                                        console.log("Image failed");

                                                        const img = e.currentTarget;
                                                    }}
                                                />
                                            </Box>

                                            <CardContent sx={{ flexGrow: 1 }}>

                                                <Typography
                                                    sx={{ variant: "h6", fontWeight: "bold" }}
                                                >
                                                    {blog.title}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mt: 1 }}
                                                >
                                                    {blog.authorName}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    sx={{ mt: 1 }}
                                                >
                                                    {blog.category}
                                                </Typography>

                                                <Chip
                                                    sx={{ mt: 2 }}
                                                    label={blog.status}
                                                    color={
                                                        blog.status === BlogStatus.PUBLISHED
                                                            ? "success"
                                                            : blog.status === BlogStatus.DRAFT
                                                                ? "warning"
                                                                : "default"
                                                    }
                                                />

                                                <Typography
                                                    variant="body2"
                                                    sx={{ mt: 2 }}
                                                >
                                                    👁 {blog.views}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                >
                                                    Publish : {blog.publishDate}
                                                </Typography>

                                            </CardContent>

                                            <CardActions
                                                sx={{
                                                    justifyContent: "space-evenly",
                                                    pb: 2,
                                                }}
                                            >

                                                <IconButton
                                                    color="primary"
                                                    onClick={() => navigate(`view/${blog.id}`)}
                                                >
                                                    <Visibility />
                                                </IconButton>

                                                <IconButton
                                                    color="success"
                                                    onClick={() =>
                                                        navigate(`edit/${blog.id}`)
                                                    }
                                                >
                                                    <Edit />
                                                </IconButton>

                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        deleteBlog(blog.id)
                                                    }
                                                >
                                                    <Delete />
                                                </IconButton>

                                            </CardActions>

                                        </Card>

                                    </Grid>

                                ))}

                        </Grid>

                        <TablePagination
                            component="div"
                            count={filteredBlogs.length}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={(e, newPage) =>
                                setPage(newPage)
                            }
                            onRowsPerPageChange={(e) => {

                                setRowsPerPage(
                                    parseInt(e.target.value, 10)
                                );

                                setPage(0);

                            }}
                        />

                    </Paper>

                </CardContent>

            </Card>

        </Box >

    );

};

export default BlogList;