import { useState, ChangeEvent } from "react";
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
    SelectChangeEvent,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { CloudUpload, Save, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
    PROJECT_CATEGORIES,
    ProjectCategory,
} from "../../../services/project";
import ProjectEditor from "../../../components/ProjectEditor";
import ProjectService from "../../../services/ProjectService";
import { ProjectRequest } from "../../../services/project";
import { generateProjectDocument } from "../../../services/DocxGenerator";
import { getDashboardBasePath } from "../../../services/RouteUtils";

const AddProject = () => {
    const navigate = useNavigate();
    const basePath = getDashboardBasePath();

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<ProjectCategory | "">("");
    const [clientName, setClientName] = useState("");
    const [location, setLocation] = useState("");
    const [completionDate, setCompletionDate] = useState("");
    const [projectArea, setProjectArea] = useState("");
    const [shortDescription, setShortDescription] = useState("");

    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [htmlContent, setHtmlContent] = useState("");

    const [jsonContent, setJsonContent] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setThumbnail(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleCategory = (event: SelectChangeEvent) => {
        setCategory(event.target.value as ProjectCategory);
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            if (!title.trim()) {
                alert("Project title is required");
                return;
            }

            if (!category) {
                alert("Please select category");
                return;
            }

            if (!thumbnail) {
                alert("Please upload thumbnail");
                return;
            }

            if (!jsonContent) {
                alert("Please write project documentation.");
                return;
            }

            if (!shortDescription.trim()) {
                alert("Short description is required.");
                return;
            }

            const document = await generateProjectDocument({
                title,
                json: jsonContent,
            });

            const request: ProjectRequest = {
                title,
                category,
                shortDescription,
                clientName,
                location,
                completionDate,
                projectArea,
            };

            await ProjectService.addProject(
                request,
                thumbnail,
                document
            );

            alert("Project added successfully");

            navigate(`${basePath}/projects`);

        } catch (err) {
            console.error(err);
            alert("Unable to save project");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ maxWidth: 1200, mx: "auto", mt: 4 }}>
            <CardContent>

                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Add Project
                </Typography>

                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Create a new project portfolio entry.
                </Typography>

                <Divider sx={{ mb: 4 }} />

                <Grid container spacing={3}>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            label="Project Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth required>
                            <InputLabel>Category</InputLabel>

                            <Select
                                value={category}
                                label="Category"
                                onChange={handleCategory}
                            >
                                {PROJECT_CATEGORIES.map((item) => (
                                    <MenuItem key={item} value={item}>
                                        {item}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Client Name"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography sx={{ mb: 1, fontWeight: 500 }}>
                            Completion Date
                        </Typography>

                        <TextField
                            fullWidth
                            type="date"
                            value={completionDate}
                            onChange={(e) => setCompletionDate(e.target.value)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Project Area"
                            value={projectArea}
                            onChange={(e) => setProjectArea(e.target.value)}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            fullWidth
                            required
                            multiline
                            minRows={4}
                            label="Short Description"
                            value={shortDescription}
                            onChange={(e) => setShortDescription(e.target.value)}
                        />
                    </Grid>

                    <Grid size={12}>
                        <Typography sx={{ fontWeight: 600, mb: 1 }}>
                            Thumbnail Image
                        </Typography>

                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUpload />}
                        >
                            Upload Thumbnail

                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={handleImage}
                            />
                        </Button>

                        {preview && (
                            <Box sx={{ mt: 2 }}>
                                <img
                                    src={preview}
                                    alt="preview"
                                    style={{
                                        width: 260,
                                        height: 180,
                                        objectFit: "cover",
                                        borderRadius: 8,
                                        border: "1px solid #ddd",
                                    }}
                                />
                            </Box>
                        )}
                    </Grid>

                    <Grid size={12}>
                        <Typography sx={{ variant: "h6", mb: 2 }}>
                            Project Documentation
                        </Typography>

                        <ProjectEditor
                            html={htmlContent}
                            json={jsonContent}
                            onChange={(html, json) => {
                                setHtmlContent(html);
                                setJsonContent(json);
                            }}
                        />
                    </Grid>

                </Grid>

                <Divider sx={{ my: 4 }} />

                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ justifyContent: "flex-end" }}
                >
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => navigate(`${basePath}/projects`)}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Project"}
                    </Button>
                </Stack>

            </CardContent>
        </Card>
    );
};

export default AddProject;