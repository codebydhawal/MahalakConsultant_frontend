import { useEffect, useState } from "react";
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
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import {
    ArrowBack,
    CloudUpload,
    Save,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import ProductService from "../../../services/ProductService";
import { ProductRequest } from "../../../services/ProductRequest";
import { ProductResponse } from "../../../services/ProductResponse";
import { PRODUCT_CATEGORIES } from "../../../services/ProductConstants";

const EditProduct = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState("");

    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [description, setDescription] = useState("");
    const [inStock, setInStock] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const fetchProduct = async () => {

            if (!id) return;

            try {

                setLoading(true);

                const response =
                    await ProductService.getProductById(id);

                const product: ProductResponse =
                    response.data.data;

                setPreview(product.imageUrl);
                setProductName(product.name);
                setCategory(product.category);
                setPrice(product.price.toString());
                setStock(product.stock.toString());
                setDescription(product.description);
                setInStock(product.status === "ACTIVE");

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        fetchProduct();

    }, [id]);

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        if (!e.target.files?.length) return;

        const file = e.target.files[0];

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleCategoryChange = (
        event: SelectChangeEvent
    ) => {
        setCategory(event.target.value);
    };

    const handleUpdate = async () => {

        if (!id) return;

        try {

            setLoading(true);

            const product: ProductRequest = {

                name: productName,
                description,
                category,
                price: Number(price),
                stock: Number(stock),
                status: inStock
                    ? "ACTIVE"
                    : "INACTIVE",

            };

            await ProductService.updateProduct(
                id,
                product,
                image
            );

            alert("Product updated successfully.");

            navigate("/admin/products");

        } catch (error: any) {

            console.error(error);

            alert(
                error?.response?.data?.message ||
                "Failed to update product."
            );

        } finally {

            setLoading(false);

        }

    };

    if (loading && !productName) {
        return (
            <Box
                sx={{
                    height: "70vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                Loading Product...
            </Box>
        );
    }

    return (

        <Box sx={{ p: 3 }}>

            <Button
                startIcon={<ArrowBack />}
                sx={{ mb: 2 }}
                onClick={() => navigate(-1)}
            >
                Back
            </Button>

            <Typography
                variant="h4"
                sx={{ fontWeight: 700, mb: 3 }}
            >
                Edit Product
            </Typography>

            <Card>

                <CardContent>

                    <Grid container spacing={4}>

                        <Grid size={{ xs: 12, md: 4 }}>

                            <Typography
                                variant="h6"
                                gutterBottom
                            >
                                Product Image
                            </Typography>

                            <Box
                                sx={{
                                    border: "2px dashed #ccc",
                                    borderRadius: 2,
                                    height: 320,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    overflow: "hidden",
                                    mb: 2,
                                }}
                            >

                                {preview ? (

                                    <img
                                        src={preview}
                                        alt="Product"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />

                                ) : (

                                    <Typography>
                                        No Image
                                    </Typography>

                                )}

                            </Box>

                            <Button
                                variant="contained"
                                component="label"
                                fullWidth
                                startIcon={<CloudUpload />}
                            >

                                Change Image

                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />

                            </Button>

                        </Grid>

                        <Grid size={{ xs: 12, md: 8 }}>

                            <Typography
                                variant="h6"
                                gutterBottom
                            >
                                Product Information
                            </Typography>

                            <Grid container spacing={2}>

                                <Grid size={{ xs: 12 }}>

                                    <TextField
                                        fullWidth
                                        label="Product Name"
                                        value={productName}
                                        onChange={(e) =>
                                            setProductName(e.target.value)
                                        }
                                    />

                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>

                                    <FormControl fullWidth>

                                        <InputLabel>
                                            Category
                                        </InputLabel>

                                        <Select
                                            value={category}
                                            label="Category"
                                            onChange={handleCategoryChange}
                                        >

                                            {PRODUCT_CATEGORIES.map(category => (
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

                                <Grid size={{ xs: 12, md: 6 }}>

                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Price"
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(e.target.value)
                                        }
                                    />

                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>

                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Stock"
                                        value={stock}
                                        onChange={(e) =>
                                            setStock(e.target.value)
                                        }
                                    />

                                </Grid>

                                <Grid
                                    size={{ xs: 12, md: 6 }}
                                    sx={{ display: "flex", alignItems: "center" }}
                                >

                                    <Typography component="span" sx={{ mr: 2 }}>
                                        {inStock ? "In Stock" : "Out of Stock"}
                                    </Typography>

                                    <Switch
                                        checked={inStock}
                                        onChange={(e) =>
                                            setInStock(e.target.checked)
                                        }
                                    />

                                </Grid>

                                <Grid size={{ xs: 12 }}>

                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        label="Description"
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                    />

                                </Grid>

                            </Grid>

                        </Grid>

                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                        }}
                    >

                        <Button
                            variant="outlined"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<Save />}
                            onClick={handleUpdate}
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Product"}
                        </Button>

                    </Box>

                </CardContent>

            </Card>

        </Box>

    );
};

export default EditProduct;