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
import { ProductResponse } from "../services/ProductResponse";
import ProductService from "../services/ProductService";

export const Shop: React.FC = () => {
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
              ArchiVastu Shop
            </Typography>

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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 3,
              mt: 2,
            }}
          >
            {filteredProducts
              .slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
              .map((product) => (
                <Card
                  key={product.productId}
                  onClick={() => navigate(`view/${product.productId}`)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 3,
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 250,
                      overflow: "hidden",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Box
                      component="img"
                      src={
                        product.imageUrl ||
                        "https://via.placeholder.com/300"
                      }
                      alt={product.name}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>

                  <CardContent>
                    <Typography
                      sx={{
                        variant: "h6",
                        fontWeight: "bold",
                      }}
                      noWrap
                    >
                      {product.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {product.category}
                    </Typography>

                    <Typography
                      sx={{
                        variant: "h6",
                        color: "primary",
                        fontWeight: "bold",
                      }}
                    >
                      ₹ {product.price}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ mt: 1 }}
                    >
                      Stock: {product.stock}
                    </Typography>

                    <Chip
                      sx={{ mt: 2 }}
                      label={
                        product.stock > 0
                          ? "In Stock"
                          : "Out of Stock"
                      }
                      color={
                        product.stock > 0
                          ? "success"
                          : "error"
                      }
                      size="small"
                    />
                  </CardContent>
                </Card>
              ))}
          </Box>

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

