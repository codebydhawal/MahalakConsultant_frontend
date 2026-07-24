import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import {
    ArrowBack,
    Edit,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ProductService from "../services/ProductService";
import { ProductResponse } from "../services/ProductResponse";
import { getDashboardBasePath } from "../services/RouteUtils";

const ProductDetails = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const basePath = getDashboardBasePath();

    const [product, setProduct] = useState<ProductResponse | null>(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchProduct = async () => {

            if (!id) return;

            try {

                setLoading(true);

                const response =
                    await ProductService.getProductById(id);

                const productData = response.data.data;

                console.log("Fetched product data:", productData);

                setProduct(productData);

                setSelectedImage(productData.imageUrl);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        fetchProduct();

    }, [id]);

    if (loading) {
        return (
            <Box
                sx={{
                    height: "70vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!product) {
        return (
            <Box
                sx={{
                    height: "70vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography color="error" variant="h6">
                    Product not found.
                </Typography>
            </Box>
        );
    }

    return (

        <Box sx={{ p: 3 }}>

            <Button
                startIcon={<ArrowBack />}
                sx={{ mb: 2 }}
                onClick={() => navigate(`${basePath}/products`)}
            >
                Back
            </Button>

            <Typography
                variant="h4"
                sx={{ fontWeight: 700, mb: 3 }}
            >
                Product Details
            </Typography>

            <Grid container spacing={4}>

                <Grid size={{ xs: 12, md: 5 }}>

                    <Card>

                        <CardContent>

                            <Box
                                component="img"
                                src={selectedImage}
                                alt={product.name}
                                sx={{
                                    width: "100%",
                                    height: 420,
                                    objectFit: "cover",
                                    borderRadius: 2,
                                    mb: 2,
                                }}
                            />

                            <Stack
                                component="div"
                                direction="row"
                                spacing={2}
                                sx={{ justifyContent: "center" }}
                            >

                            </Stack>

                        </CardContent>

                    </Card>

                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>

                    <Card>

                        <CardContent>

                            <Typography
                                variant="h4"
                                sx={{ fontWeight: 700 }}
                            >
                                {product.name}
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{ mt: 1 }}
                            >
                                {product.description}
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                Category : {product.category}
                            </Typography>

                            <Typography
                                variant="h4"
                                color="primary"
                                sx={{ mt: 3, fontWeight: 700 }}
                            >
                                ₹ {product.price}
                            </Typography>

                            <Typography
                                sx={{ mt: 2 }}
                            >
                                Stock : {product.stock}
                            </Typography>

                            <Chip
                                sx={{ mt: 2 }}
                                color={
                                    product.status === "ACTIVE"
                                        ? "success"
                                        : "error"
                                }
                                label={
                                    product.status === "ACTIVE"
                                        ? "In Stock"
                                        : "Out of Stock"
                                }
                            />

                            <Divider sx={{ my: 3 }} />

                            <Typography
                                variant="h6"
                                gutterBottom
                            >
                                Description
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                {product.description}
                            </Typography>

                            <Divider sx={{ my: 3 }} />

                            <Typography
                                variant="h6"
                                gutterBottom
                            >
                                Specifications
                            </Typography>

                            <Grid container spacing={2}>

                                {/* <Grid size={6}>
                                    <Paper sx={{ p: 2 }}>
                                        <Typography sx={{ fontWeight: 600 }}>
                                            SKU
                                        </Typography>
                                        <Typography>
                                            {product.sku}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid size={6}>
                                    <Paper sx={{ p: 2 }}>
                                        <Typography sx={{ fontWeight: 600 }}>
                                            Material
                                        </Typography>
                                        <Typography>
                                            {product.material}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid size={6}>
                                    <Paper sx={{ p: 2 }}>
                                        <Typography sx={{ fontWeight: 600 }}>
                                            Color
                                        </Typography>
                                        <Typography>
                                            {product.color}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid size={6}>
                                    <Paper sx={{ p: 2 }}>
                                        <Typography sx={{ fontWeight: 600 }}>
                                            Size
                                        </Typography>
                                        <Typography>
                                            {product.size}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid size={6}>
                                    <Paper sx={{ p: 2 }}>
                                        <Typography sx={{ fontWeight: 600 }}>
                                            Weight
                                        </Typography>
                                        <Typography>
                                            {product.weight}
                                        </Typography>
                                    </Paper>
                                </Grid> */}

                                {/* <Grid size={6}>
                                    <Paper sx={{ p: 2 }}>
                                        <Typography sx={{ fontWeight: 600 }}>
                                            Created
                                        </Typography>
                                        <Typography>
                                            {new Date(product.createdAt).toLocaleString()}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Paper sx={{ p: 2 }}>
                                        <Typography sx={{ fontWeight: 600 }}>
                                            Updated
                                        </Typography>
                                        <Typography>
                                            {new Date(product.updatedAt).toLocaleString()}
                                        </Typography>
                                    </Paper>
                                </Grid> */}

                            </Grid>

                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{ mt: 4, justifyContent: "flex-end" }}
                            >

                                <Button
                                    variant="outlined"
                                    onClick={() => navigate(`${basePath}/products`)}
                                >
                                    Back
                                </Button>

                            </Stack>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>

        </Box>

    );
};

export default ProductDetails;

