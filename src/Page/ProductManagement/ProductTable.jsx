import React, { useState, useRef, useEffect, useContext } from "react";
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, 
  Typography, CircularProgress, TextField, MenuItem, Select, Box, Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";
import { ThemeContext } from "./ThemeContext";
import ProductDetailModal from "./ProductDetailModal";
import UpdateProduct from "./UpdateProduct";
 
// Define full list of product categories
const productCategories = [
  "Grocery", "Electronic", "Mobile", "Accessories", "Cloths",
  "Furniture", "Sports", "Home", "Kitchen"
];

const ProductTable = ({
  initialProducts = [],
  fetchMoreProducts = () => Promise.resolve([]), // default function
  showToast,
}) => {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPrice, setFilterPrice] = useState([0, 10000]); // Min and max price
  const [favoriteProducts, setFavoriteProducts] = useState(new Set());
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUpdateProduct, setShowUpdateProduct] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const observer = useRef(null);

   // Update products state whenever initialProducts prop changes
   useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);


   // Fetch products from API on mount
   useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) {
          console.error("Error fetching products");
          return;
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Error deleting product");
      }
  
      // Remove the deleted product from the state
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.product_id !== productId)
      );
  
      showToast("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      showToast("Error deleting product", "error");
    }
  };
  

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const lastRowRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loading) {
        setLoading(true);
        fetchMoreProducts()
          .then((newProducts) => {
            if (newProducts && Array.isArray(newProducts) && newProducts.length > 0) {
                setProducts((prev) => [...prev, ...newProducts]);
                showToast();
              }
          })
          .catch((err) => console.error("Error fetching more products:", err))
          .finally(() => setLoading(false));
      }
    });

    if (node) observer.current.observe(node);
  };

  const getPriceValue = (price) => {
    if (typeof price === "number") return price; // Handle number format
    if (typeof price === "string") return parseFloat(price.replace(/[$,]/g, "")); // Remove $ and commas
    return 0; // Default fallback
  };

     // Use correct property names for sorting and filtering:
  const filteredAndSortedProducts = products
  .filter((product) =>
    (!filterCategory || product.category === filterCategory) &&
    (!filterStatus || product.product_status === filterStatus) &&
    (getPriceValue(product.unit_price) >= filterPrice[0] &&
     getPriceValue(product.unit_price) <= filterPrice[1]) &&
    (!showFavorites || favoriteProducts.has(product.product_id))
  )
  .sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return (a.product_name || "").localeCompare(b.product_name || "");
      case "name-desc":
        return (b.product_name || "").localeCompare(a.product_name || "");
      case "quantity-asc":
        return (a.quantity || 0) - (b.quantity || 0);
      case "quantity-desc":
        return (b.quantity || 0) - (a.quantity || 0);
      case "price-asc":
        return getPriceValue(a.unit_price) - getPriceValue(b.unit_price);
      case "price-desc":
        return getPriceValue(b.unit_price) - getPriceValue(a.unit_price);
      case "date-asc":
        return new Date(a.date_of_entry) - new Date(b.date_of_entry);
      case "date-desc":
        return new Date(b.date_of_entry) - new Date(a.date_of_entry);
      case "category-asc":
        return (a.category || "").localeCompare(b.category || "");
      case "category-desc":
        return (b.category || "").localeCompare(a.category || "");
      default:
        return 0;
    }
  });


  const toggleFavorite = (productId) => {
    setFavoriteProducts((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  // Function to handle Edit button click
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowUpdateProduct(true);
  };

  // If showUpdateProduct is true, render UpdateProduct instead
  if (showUpdateProduct) {
    return <UpdateProduct product={selectedProduct} onBack={() => setShowUpdateProduct(false)} />;
  }
  


  return (
    <>

<Box display="flex" justifyContent="space-between" mb={2} gap={2} flexWrap="wrap">
  {/* Sort By Dropdown */}
  <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} displayEmpty sx={{ minWidth: "200px" }}>
    <MenuItem value="">Sort By</MenuItem>
    <MenuItem value="name-asc">Name (A-Z)</MenuItem>
    <MenuItem value="name-desc">Name (Z-A)</MenuItem>
    <MenuItem value="quantity-asc">Quantity (Low to High)</MenuItem>
    <MenuItem value="quantity-desc">Quantity (High to Low)</MenuItem>
    <MenuItem value="price-asc">Price (Low to High)</MenuItem>
    <MenuItem value="price-desc">Price (High to Low)</MenuItem>
    <MenuItem value="date-asc">Date (Oldest First)</MenuItem>
    <MenuItem value="date-desc">Date (Newest First)</MenuItem>
    <MenuItem value="category-asc">Category (A-Z)</MenuItem>
    <MenuItem value="category-desc">Category (Z-A)</MenuItem>
  </Select>

 {/* Filter by Category: Loop through productCategories */}
 <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} displayEmpty sx={{ minWidth: "150px" }}>
          <MenuItem value="">All Categories</MenuItem>
          {productCategories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>

  {/* Filter by Status */}
  <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} displayEmpty sx={{ minWidth: "150px" }}>
    <MenuItem value="">All Statuses</MenuItem>
    <MenuItem value="Available">Available</MenuItem>
    <MenuItem value="OutOfStock">Out of Stock</MenuItem>
    <MenuItem value="Discontinued">Discontinued</MenuItem>
  </Select>

  {/* Toggle Favorite Filter */}
  <Button
  variant="contained"
  color="secondary"
  onClick={() => setShowFavorites((prev) => !prev)}
>
  {showFavorites ? "Show All Products" : "Show Favorites"}
</Button>

  {/* Filter by Price Range */}
  <Box display="flex" alignItems="center" gap={1}>
    <Typography>Price:</Typography>
    <TextField
      type="number"
      value={filterPrice[0]}
      onChange={(e) => setFilterPrice([Number(e.target.value), filterPrice[1]])}
      sx={{ width: "80px" }}
    />
    <Typography>-</Typography>
    <TextField
      type="number"
      value={filterPrice[1]}
      onChange={(e) => setFilterPrice([filterPrice[0], Number(e.target.value)])}
      sx={{ width: "80px" }}
    />
  </Box>
</Box>
     {/* Table Product  */}
    <TableContainer component={Paper} sx={{ 
       mt: 3,
       borderRadius: "10px",
       maxHeight: "500px",
       overflowY: "auto",
       bgcolor: darkMode ? "#1A1D2A" : "#ffffff",
       color: darkMode ? "#E3E3E3" : "#000000",
       boxShadow: 3,
       transition: "all 0.3s ease-in-out",
       // 🔥 Reduced Width
       width: "85%", 
       maxWidth: "1500px",
    
    // Centering
    margin: "auto",
    }}>
      <Table>
      <TableHead sx={{ bgcolor: darkMode ? "#252836" : "#E3F2FD" }}>
      <TableRow>
    <TableCell sx={{ color: darkMode ? "#E3E3E3" : "#0D47A1", fontWeight: "bold", }}>ADD Favorites</TableCell>
    <TableCell sx={{ color: darkMode ? "#E3E3E3" : "#0D47A1", }}>Product ID</TableCell>
    <TableCell sx={{ color: darkMode ? "#E3E3E3" : "#0D47A1", }}>Name</TableCell>
    <TableCell sx={{ color: darkMode ? "#E3E3E3" : "#0D47A1", }}>Category</TableCell>
    <TableCell sx={{ color: darkMode ? "#E3E3E3" : "#0D47A1", }}>Price</TableCell>
    <TableCell sx={{ color: darkMode ? "#E3E3E3" : "#0D47A1" ,}}>Wholesale Price</TableCell>
    <TableCell sx={{ color: darkMode ? "#E3E3E3" : "#0D47A1" ,}}>Quantity</TableCell>
    <TableCell sx={{ color: darkMode ? "#E3E3E3" : "#0D47A1", }}>Stock</TableCell>
    <TableCell sx={{ color: darkMode ? "#E3E3E3" : "#0D47A1", }}>Last Refill Date</TableCell>
    <TableCell sx={{ color: darkMode ? "#E3E3E3" : "#0D47A1", }}>Actions</TableCell>
  </TableRow>
</TableHead>


        <TableBody>
        {filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map((product, index) => (
                <TableRow key={product.product_id || `product-${index}`} ref={index === filteredAndSortedProducts.length - 1 ? lastRowRef : null}>
        
        {/* Favorite Button */}
      <TableCell>
        <IconButton onClick={() => toggleFavorite(product.product_id)} color={favoriteProducts.has(product.product_id) ? "error" : "default"}>
          {favoriteProducts.has(product.product_id) ? "❤️" : "🤍"}
        </IconButton>
      </TableCell>

        <TableCell>{product.product_id}</TableCell>
        <TableCell sx={{ cursor: "pointer", color: "blue", textDecoration: "underline", "&:hover": { color: "darkblue" }, }} onClick={() => handleOpenModal(product)}>{product.product_name}</TableCell>
        <TableCell>{product.category}</TableCell>
        <TableCell>₹{product.unit_price ? product.unit_price : "-"}</TableCell>
        <TableCell>₹{product.wholesale_price ? product.wholesale_price : "-"}</TableCell>
        <TableCell>{product.quantity ? product.quantity : "-"}</TableCell>
        <TableCell>
               {Number(product.stock_threshold) < 10 ? (
             <>
                <WarningIcon sx={{ color: "red", verticalAlign: "middle", mr: 1 }} />
                <Typography variant="body2" color="error" display="inline">
                Low Stock ({product.stock_threshold} left)
                 </Typography>
              </>
             ) : (
              product.stock_threshold
            )}
       </TableCell>
        <TableCell>{product.lastRefillDate}</TableCell>
        <TableCell>
          <IconButton color="primary" onClick={() => handleEditProduct(product)}><EditIcon /></IconButton>
          <IconButton color="error"  onClick={() => handleDeleteProduct(product.product_id)}><DeleteIcon /></IconButton>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={9} align="center">
        <Typography variant="body1" color="textSecondary">
          No products found
        </Typography>
      </TableCell>
    </TableRow>
  )}
</TableBody>
      </Table>
      {/* Loading Spinner */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
          <CircularProgress size={30} />
        </div>
      )}
    </TableContainer>
    <ProductDetailModal open={isModalOpen} onClose={handleCloseModal} product={selectedProduct} />
    </>
  );
};

export default ProductTable;