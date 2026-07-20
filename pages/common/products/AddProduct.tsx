import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import ProductService from "../../../services/ProductService";
import { ProductRequest } from "../../../services/ProductRequest";
import { PRODUCT_CATEGORIES } from "../../../services/ProductConstants";

const AddProduct = () => {

    const navigate = useNavigate();

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState("");

    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [description, setDescription] = useState("");
    const [inStock, setInStock] = useState(true);
    const [loading, setLoading] = useState(false);

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

    const handleSubmit = async () => {
        if (loading) return;

        if (!image) {
            alert("Please select a product image.");
            return;
        }

        if (!productName.trim()) {
            alert("Product Name is required.");
            return;
        }

        if (!category) {
            alert("Category is required.");
            return;
        }

        if (!price) {
            alert("Price is required.");
            return;
        }

        if (!stock) {
            alert("Stock is required.");
            return;
        }

        if (!description.trim()) {
            alert("Description is required.");
            return;
        }

        const product = {
            name: productName,
            description,
            category,
            price: Number(price),
            stock: Number(stock),
            status: inStock ? "In Stock" : "Out of Stock",
        };

        try {

            setLoading(true);

            const response = await ProductService.addProduct(product, image);

            const addedProduct = response.data.data;

            console.log(addedProduct.productId);
            console.log(addedProduct.imageUrl);

            alert(response.data.message);

            navigate("/admin/products");

        } catch (error: any) {

            console.error(error);

            alert(
                error?.response?.data?.message ||
                "Failed to add product."
            );

        } finally {

            setLoading(false);

        }
    };

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
                component="h1"
                variant="h4"
                sx={{ fontWeight: 700, mb: 3 }}
            >
                Add Product
            </Typography>

            <Card>

                <CardContent>

                    <Grid container spacing={4}>

                        {/* Image */}

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
                                    borderRadius: 3,
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
                                        alt="Preview"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />

                                ) : (

                                    <Typography color="text.secondary">
                                        No Image Selected
                                    </Typography>

                                )}

                            </Box>

                            <Button
                                fullWidth
                                variant="contained"
                                component="label"
                                startIcon={<CloudUpload />}
                            >
                                Upload Image

                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />

                            </Button>

                        </Grid>

                        {/* Product Details */}

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
                                            setProductName(
                                                e.target.value
                                            )
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
                                            onChange={
                                                handleCategoryChange
                                            }
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
                                        label="Price"
                                        type="number"
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(
                                                e.target.value
                                            )
                                        }
                                    />

                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>

                                    <TextField
                                        fullWidth
                                        label="Stock"
                                        type="number"
                                        value={stock}
                                        onChange={(e) =>
                                            setStock(
                                                e.target.value
                                            )
                                        }
                                    />

                                </Grid>

                                <Grid
                                    size={{ xs: 12, md: 6 }}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center"
                                    }}
                                >

                                    <Typography sx={{ mr: 2 }}>
                                        {inStock ? "In Stock" : "Out of Stock"}
                                    </Typography>

                                    <Switch
                                        checked={inStock}
                                        onChange={(e) =>
                                            setInStock(
                                                e.target.checked
                                            )
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
                                            setDescription(
                                                e.target.value
                                            )
                                        }
                                    />

                                </Grid>

                            </Grid>

                        </Grid>

                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Box
                        sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}
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
                            onClick={handleSubmit}
                        >
                            Save Product
                        </Button>

                    </Box>

                </CardContent>

            </Card>

        </Box>

    );
};

export default AddProduct;