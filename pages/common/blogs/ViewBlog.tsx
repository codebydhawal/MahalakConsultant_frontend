import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Chip,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    CalendarMonth,
    Category,
    Person,
} from "@mui/icons-material";

import BlogService from "../../../services/BlogService";
import { BlogResponse } from "../../../services/BlogResponse";
import { getDashboardBasePath } from "../../../services/RouteUtils";
// TypeScript may not have type declarations for these CSS side-effect imports.
// @ts-ignore: allow importing CSS for react-pdf
import "react-pdf/dist/Page/TextLayer.css";
// @ts-ignore: allow importing CSS for react-pdf
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
// @ts-ignore: allow importing PDF worker for react-pdf
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const ViewBlog = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const basePath = getDashboardBasePath();

    const [loading, setLoading] = useState(true);

    const [blog, setBlog] = useState<BlogResponse>();

    const [numPages, setNumPages] = useState(0);


    useEffect(() => {

        if (id) {
            loadBlog();
        }

    }, [id]);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const loadBlog = async () => {

        try {

            const response = await BlogService.getBlogById(id as string);

            const blogData = response.data.data;

            setBlog(blogData);

            console.log("setBlog done");

        } catch (e) {

            console.log(e);

        } finally {

            console.log("finally");

            setLoading(false);

        }
    };

    if (loading) {

        return (

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 10,
                }}
            >
                <CircularProgress />
            </Box>

        );

    }

    if (!blog) {

        return (

            <Typography>

                Blog not found.

            </Typography>

        );

    }

    return (

        <Box>

            <Button
                startIcon={<ArrowBack />}
                sx={{ mb: 3 }}
                onClick={() => navigate(`${basePath}/blogs`)}
            >
                Back
            </Button>

            {/* Featured Image */}

            <Card elevation={3}>

                <CardMedia
                    component="img"
                    image={blog.featuredImageUrl}
                    sx={{
                        height: 450,
                        objectFit: "cover",
                    }}
                />

            </Card>

            {/* PDF */}

            {/* <Paper
                elevation={3}
                sx={{
                    mt: 4,
                    p: 2,
                }}
            >

                <iframe
                    src={blog.contentFileUrl}
                    title="Blog PDF"
                    width="100%"
                    height="900px"
                    style={{
                        border: 0,
                        borderRadius: 10,
                    }}
                />

            </Paper> */}

            <Paper
                elevation={3}
                sx={{
                    mt: 4,
                    p: 3,
                }}
            >

                <Typography
                    variant="h5"
                    gutterBottom
                >
                    Blog Content
                </Typography>

                <Document
                    file={`http://localhost:8080/rest/blog/pdf/${blog.contentFileId}`}
                    // file={`/BLOG_Dhawal Bahe new.pdf`}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<CircularProgress />}
                >

                    {Array.from(new Array(numPages), (_, index) => {

                        return (
                            <Page
                                key={index}
                                pageNumber={index + 1}
                                width={900}
                            />
                        );
                    })}

                </Document>

            </Paper>

            {/* Blog Details */}

            <Card
                sx={{
                    mt: 4,
                }}
            >

                <CardContent>

                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 'bold' }}
                    >
                        {blog.title}
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={4}
                        sx={{
                            mt: 3,
                            flexWrap: "wrap",
                            rowGap: 2,
                        }}
                    >

                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ alignItems: "center" }}
                        >

                            <Category />

                            <Typography>

                                {blog.category}

                            </Typography>

                        </Stack>

                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ alignItems: "center" }}
                        >

                            <CalendarMonth />

                            <Typography>

                                {blog.publishDate}

                            </Typography>

                        </Stack>

                        <Chip
                            label={blog.status}
                            color={
                                blog.status === "PUBLISHED"
                                    ? "success"
                                    : blog.status === "DRAFT"
                                        ? "warning"
                                        : "default"
                            }
                        />

                    </Stack>

                    <Divider
                        sx={{
                            my: 4,
                        }}
                    />

                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ alignItems: "center" }}
                    >
                        <Avatar
                            src={blog.authorImageUrl}
                            sx={{
                                width: 70,
                                height: 70,
                            }}
                        />

                        <Stack>

                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >

                                Author

                            </Typography>

                            <Typography
                                variant="h6"
                            >

                                {blog.authorName}

                            </Typography>

                        </Stack>

                    </Stack>

                    <Divider
                        sx={{
                            my: 4,
                        }}
                    />

                    <Typography
                        variant="h6"
                        gutterBottom
                    >

                        Short Description

                    </Typography>

                    <Typography
                        color="text.secondary"
                    >

                        {blog.shortDescription}

                    </Typography>

                    <Divider
                        sx={{
                            my: 4,
                        }}
                    />

                    <Typography
                        variant="h6"
                        gutterBottom
                    >

                        Tags

                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ flexWrap: 'wrap', gap: 8 }}
                    >

                        {blog.tags?.map((tag) => (

                            <Chip
                                key={tag}
                                label={tag}
                                color="primary"
                                variant="outlined"
                            />

                        ))}

                    </Stack>

                </CardContent>

            </Card>

        </Box>

    );

};

export default ViewBlog;