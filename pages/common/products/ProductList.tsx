import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
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
import { useEffect, useState } from "react";
import ProductService from "../../../services/ProductService";
import { ProductResponse } from "../../../services/ProductResponse";

const ProductList = () => {

    const navigate = useNavigate();

    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [search, setSearch] = useState("");

    const fetchProducts = async () => {

        try {

            setLoading(true);

            const response =
                await ProductService.getAllProducts();

            setProducts(response.data.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchProducts();

    }, []);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (productId: string | number) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await ProductService.deleteProduct(productId.toString());

            await fetchProducts();

            alert("Product deleted successfully.");

        } catch (error: any) {

            console.error(error);

            alert(
                error?.response?.data?.message ||
                "Failed to delete product."
            );

        }

    };

    if (loading) {
        return (
            <Box
                sx={{
                    height: "70vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <CircularProgress />

                <Typography variant="h6" color="text.secondary">
                    Loading Products...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>

            <Card elevation={3}>
                <CardContent>

                    {/* Header */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                        flexWrap: 'wrap',
                        gap: 2,
                    }}>
                        <Typography variant="h5" component="h5" sx={{ fontWeight: 700 }}>
                            Product Management
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => navigate("add")}
                        >
                            Add Product
                        </Button>
                    </Box>

                    {/* Search */}

                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            placeholder="Search Product..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            {...({
                                SlotProps: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                }
                            } as any)}
                        />
                    </Box>

                    {/* Product Table */}

                    <TableContainer component={Paper}>
                        <Table>

                            <TableHead>

                                <TableRow>

                                    <TableCell><b>Image</b></TableCell>

                                    <TableCell><b>Name</b></TableCell>

                                    <TableCell><b>Category</b></TableCell>

                                    <TableCell><b>Price</b></TableCell>

                                    <TableCell><b>Stock</b></TableCell>

                                    <TableCell><b>Status</b></TableCell>

                                    <TableCell align="center">
                                        <b>Actions</b>
                                    </TableCell>

                                </TableRow>

                            </TableHead>

                            <TableBody>

                                {filteredProducts
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((product) => (

                                        <TableRow key={product.productId} hover>

                                            <TableCell>
                                                <Avatar
                                                    src={
                                                        product.imageUrl ||
                                                        "https://via.placeholder.com/50"
                                                    }
                                                    variant="rounded"
                                                    sx={{
                                                        width: 55,
                                                        height: 55,
                                                    }}
                                                />
                                            </TableCell>

                                            <TableCell>
                                                {product.name}
                                            </TableCell>

                                            <TableCell>
                                                {product.category}
                                            </TableCell>

                                            <TableCell>
                                                ₹ {product.price}
                                            </TableCell>

                                            <TableCell>
                                                {product.stock}
                                            </TableCell>

                                            <TableCell>

                                                <Chip
                                                    label={
                                                        product.status === "ACTIVE"
                                                            ? "In Stock"
                                                            : "Out of Stock"
                                                    }
                                                    color={
                                                        product.status === "ACTIVE"
                                                            ? "success"
                                                            : "error"
                                                    }
                                                    size="small"
                                                />

                                            </TableCell>

                                            <TableCell align="center">

                                                <IconButton
                                                    color="primary"
                                                    onClick={() => navigate(`view/${product.productId}`)}
                                                >
                                                    <Visibility />
                                                </IconButton>

                                                <IconButton
                                                    color="warning"
                                                    onClick={() => navigate(`edit/${product.productId}`)}
                                                >
                                                    <Edit />
                                                </IconButton>

                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDelete(product.productId.toString())}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>

                                        </TableRow>

                                    ))}

                            </TableBody>

                        </Table>

                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={filteredProducts.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={(event, newPage) =>
                            setPage(newPage)
                        }
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(
                                parseInt(event.target.value, 10)
                            );
                            setPage(0);
                        }}
                    />

                </CardContent>
            </Card>

        </Box>
    );
};

export default ProductList;
