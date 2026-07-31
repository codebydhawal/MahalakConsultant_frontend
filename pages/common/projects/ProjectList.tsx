import { useEffect, useState } from "react";
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
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import {
    Add,
    Delete,
    Edit,
    Search,
    Visibility,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ProjectService from "../../../services/ProjectService";
import { ProjectResponse } from "../../../services/project";
import { getDashboardBasePath } from "@/services/RouteUtils";

const ProjectList = () => {
    const navigate = useNavigate();
    const basepath = getDashboardBasePath();

    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setLoading(true);

            const response = await ProjectService.getAllProjects();

            setProjects(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (search.trim() === "") {
            loadProjects();
            return;
        }

        try {
            const response = await ProjectService.searchProjects(search);

            setProjects(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await ProjectService.deleteProject(deleteId);

            setDeleteId(null);

            loadProjects();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Card sx={{ p: 2 }}>
            <CardContent>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography sx={{ variant: "h4", fontWeight: "bold" }}>
                        Manage Projects
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate(`${basepath}/projects/add`)}
                    >
                        Add Project
                    </Button>
                </Box>

                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <TextField
                        fullWidth
                        label="Search Project"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Button
                        variant="contained"
                        startIcon={<Search />}
                        onClick={handleSearch}
                    >
                        Search
                    </Button>
                </Box>

                <TableContainer component={Paper}>

                    <Table>

                        <TableHead>

                            <TableRow>

                                <TableCell>Thumbnail</TableCell>

                                <TableCell>Title</TableCell>

                                <TableCell>Category</TableCell>

                                <TableCell>Client</TableCell>

                                <TableCell>Location</TableCell>

                                <TableCell>Completion</TableCell>

                                <TableCell>Views</TableCell>

                                <TableCell align="center">
                                    Actions
                                </TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>

                            {projects.length === 0 ? (

                                <TableRow>

                                    <TableCell colSpan={8} align="center">

                                        No Projects Found

                                    </TableCell>

                                </TableRow>

                            ) : (

                                projects.map((project) => (

                                    <TableRow key={project.projectId}>

                                        <TableCell>

                                            <img
                                                src={project.thumbnailUrl}
                                                alt={project.title}
                                                width={80}
                                                height={60}
                                                style={{
                                                    objectFit: "cover",
                                                    borderRadius: 6,
                                                }}
                                            />

                                        </TableCell>

                                        <TableCell>

                                            {project.title}

                                        </TableCell>

                                        <TableCell>

                                            {project.category}

                                        </TableCell>

                                        <TableCell>

                                            {project.clientName}

                                        </TableCell>

                                        <TableCell>

                                            {project.location}

                                        </TableCell>

                                        <TableCell>

                                            {project.completionDate}

                                        </TableCell>

                                        <TableCell>

                                            {project.views}

                                        </TableCell>

                                        <TableCell align="center">

                                            <IconButton
                                                color="primary"
                                                onClick={() =>
                                                   navigate(`${basepath}/projects/view/${project.projectId}`)
                                                }
                                            >
                                                <Visibility />
                                            </IconButton>

                                            <IconButton
                                                color="warning"
                                                onClick={() =>
                                                    navigate(`${basepath}/projects/edit/${project.projectId}`)
                                                }
                                            >
                                                <Edit />
                                            </IconButton>

                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    setDeleteId(project.projectId)
                                                }
                                            >
                                                <Delete />
                                            </IconButton>

                                        </TableCell>

                                    </TableRow>

                                ))

                            )}

                        </TableBody>

                    </Table>

                </TableContainer>

                <Dialog
                    open={deleteId !== null}
                    onClose={() => setDeleteId(null)}
                >
                    <DialogTitle>
                        Delete Project
                    </DialogTitle>

                    <DialogContent>

                        <DialogContentText>
                            Are you sure you want to delete this project?
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
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>

                    </DialogActions>

                </Dialog>

            </CardContent>
        </Card>
    );
};

export default ProjectList;