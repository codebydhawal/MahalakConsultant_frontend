import { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import ProjectService from "../../../services/ProjectService";
import { getDashboardBasePath } from "../../../services/RouteUtils";
import { ProjectResponse } from "../../../services/project";

const ViewProject = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const basePath = getDashboardBasePath();

    const [project, setProject] = useState<ProjectResponse | null>(null);

    const [loading, setLoading] = useState(true);

    const [documentHtml, setDocumentHtml] = useState("");

    useEffect(() => {

        loadProject();

    }, [id]);

    const loadProject = async () => {

        if (!id) {
            setLoading(false);
            return;
        }

        try {

            const projectResponse = await ProjectService.getProjectById(id);

            setProject(projectResponse.data.data);

            const documentResponse =
                await ProjectService.getProjectDocumentContent(id);

            setDocumentHtml(documentResponse.data.html);

        } catch (err) {

            console.error(err);

        } finally {

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

    if (!project) {

        return (
            <Typography sx={{ align: "center", mt: 5 }}>
                Project not found.
            </Typography>
        );

    }

    return (

        <Box
            sx={{
                maxWidth: 1500,
                mx: "auto",
                px: 4,
                py: 5,
            }}
        >
            <Grid container spacing={8}>

                {/* Left Image */}

                <Grid size={{ xs: 12, md: 7 }}>

                    <Box
                        component="img"
                        src={project.thumbnailUrl}
                        alt={project.title}
                        sx={{
                            width: "100%",
                            height: 700,
                            objectFit: "cover",
                            borderRadius: 2,
                        }}
                    />

                </Grid>

                {/* Right Details */}

                <Grid size={{ xs: 12, md: 5 }}>

                    <Typography
                        sx={{
                            letterSpacing: 4,
                            color: "#B87B34",
                            textTransform: "uppercase",
                            fontSize: 12,
                            mb: 3,
                        }}
                    >
                        {project.category}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: {
                                xs: 40,
                                md: 60,
                            },
                            fontWeight: 700,
                            lineHeight: 1,
                            mb: 4,
                            fontFamily: "Playfair Display",
                        }}
                    >
                        {project.title}
                    </Typography>

                    <Typography
                        sx={{
                            color: "#777",
                            lineHeight: 2,
                            fontSize: 18,
                        }}
                    >
                        {project.shortDescription}
                    </Typography>

                    <Divider sx={{ my: 5 }} />

                    {/* <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            mb: 4,
                        }}
                    >
                        Specification
                    </Typography> */}

                    <Box
                        sx={{
                            "& img": {
                                maxWidth: "100%",
                                height: "auto",
                            },
                            "& p": {
                                fontSize: 16,
                                lineHeight: 2,
                                mb: 2,
                            },
                            "& h1, & h2, & h3": {
                                mt: 4,
                                mb: 2,
                                fontWeight: 700,
                            },
                            "& ul, & ol": {
                                pl: 4,
                            },
                            "& table": {
                                width: "100%",
                                borderCollapse: "collapse",
                            },
                            "& td, & th": {
                                border: "1px solid #ddd",
                                padding: "8px",
                            },
                        }}
                        dangerouslySetInnerHTML={{
                            __html: documentHtml,
                        }}
                    />

                </Grid>

            </Grid>

            <Stack sx={{ spacing: 3, mt: 2 }}>

                <Typography>
                    <b>Client :</b> {project.clientName}
                </Typography>

                <Typography>
                    <b>Location :</b> {project.location}
                </Typography>

                <Typography>
                    <b>Project Area :</b> {project.projectArea}
                </Typography>

                <Typography>
                    <b>Completion :</b> {project.completionDate}
                </Typography>

            </Stack>

            <Stack
                direction="row"
                sx={{ mt: 1, pt: 4, justifyContent: "flex-end" }}>
                <Box >

                    {/* sx={{ mt: 1 }} */}
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate(`${basePath}/projects`)
                        }
                    >
                        Back
                    </Button>

                </Box>
            </Stack>

        </Box>

    );

};

export default ViewProject;