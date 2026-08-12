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
    ShoppingCart,
    Bolt,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ProductService from "../services/ProductService";
import { ProductResponse } from "../services/ProductResponse";
import { getDashboardBasePath } from "../services/RouteUtils";
import { useDispatch } from "react-redux";
import CartService from "../services/CartService";
import { CartRequest } from "../services/CartRequest";

import {
    setCart,
    setCartLoading,
    setCartError,
} from "@/slices/cartSlice";

const ProductDetails = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
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

    // const addToCart = async () => {
    //     if (!product) return;

    //     try {
    //         dispatch(setCartLoading(true));

    //         const request: CartRequest = {
    //             productId: product.productId,
    //             quantity,
    //         };

    //         const response = await CartService.addToCart(request);

    //         dispatch(setCart(response.data.data));
    //     } catch (error) {
    //         console.error(error);
    //         dispatch(setCartError("Unable to add product to cart."));
    //     }
    // };

    const addToCart = async (): Promise<boolean> => {
        if (!product) return false;

        try {
            dispatch(setCartLoading(true));

            const request: CartRequest = {
                productId: product.productId,
                quantity,
            };

            const response = await CartService.addToCart(request);

            dispatch(setCart(response.data.data));

            return true;

        } catch (error) {
            console.error(error);
            dispatch(setCartError("Unable to add product to cart."));

            return false;

        } finally {
            dispatch(setCartLoading(false));
        }
    };

    const handleAddToCart = async () => {

        const token = localStorage.getItem("token");

        // Guest user
        if (!token) {
            navigate("/login", {
                state: {
                    redirectTo: "/cart",
                },
            });

            return;
        }

        // Logged-in user
        const success = await addToCart();

        if (success) {
            navigate("/cart");
        }
    };

    const handleBuyNow = async () => {

        const token = localStorage.getItem("token");

        // Guest user
        if (!token) {

            if (!product) return;

            localStorage.setItem(
                "pendingBuyNow",
                JSON.stringify({
                    productId: product.productId,
                    quantity: quantity,
                })
            );

            navigate("/login", {
                state: {
                    redirectTo: "/cart/checkout",
                },
            });

            return;
        }

        // Logged-in user
        const success = await addToCart();

        if (success) {
            navigate("/cart/checkout");
        }
    };

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
                onClick={() => navigate(`/products`)}
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

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="h6" gutterBottom>
                                Quantity
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{ mt: 2, mb: 3, alignItems: "center" }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        setQuantity((q) => Math.max(1, q - 1))
                                    }
                                >
                                    -
                                </Button>

                                <Typography variant="h6">
                                    {quantity}
                                </Typography>

                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        setQuantity((q) =>
                                            Math.min(product.stock, q + 1)
                                        )
                                    }
                                >
                                    +
                                </Button>
                            </Stack>
                            <div className="mt-8 flex gap-4">
                                <div className="mt-8 flex gap-4">
                                    <Button
                                        variant="outlined"
                                        startIcon={<ShoppingCart />}
                                        sx={actionButtonStyle}
                                        onClick={handleAddToCart}
                                    >
                                        Add To Cart
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        startIcon={<Bolt />}
                                        sx={actionButtonStyle}
                                        onClick={handleBuyNow}
                                    >
                                        Buy Now
                                    </Button>
                                </div>
                            </div>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>

        </Box>

    );
};

export default ProductDetails;

const actionButtonStyle = {
    borderColor: "#c96a10",
    color: "#c96a10",
    backgroundColor: "#fff",
    borderRadius: "14px",
    px: 4,
    py: 1.5,
    textTransform: "none",
    fontWeight: 600,
    transition: "all 0.3s ease",

    "&:hover": {
        backgroundColor: "#c96a10",
        color: "#fff",
        borderColor: "#c96a10",
    },
};