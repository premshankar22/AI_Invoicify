import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";

const ProductDetailModal = ({ open, onClose, product }) => {
   // Check early: if product is null, don't attempt to access its properties.
   if (!product) return null;

   // Helper: extract filename from stored path
  const getFileName = (pathStr) => {
    if (!pathStr) return "";
    return pathStr.split(/[\\/]/).pop();
  };

  // Build image URL:
  let imageSrc = "";
  if (product.image) {
    // Extract the filename from the path
    let filename = getFileName(product.image);
    // If filename doesn't include a period (i.e. no extension), append a default extension.
    if (filename && !/\.[a-zA-Z0-9]+$/.test(filename)) {
      filename += ".jpg"; // default to .jpg if missing extension
    }
    // If the image field already contains an absolute URL, use it; otherwise, construct the URL.
    imageSrc = product.image.startsWith("http")
      ? product.image
      : `http://127.0.0.1:5000/images/${filename}`;
  } else {
    // Fallback image; ensure 'default.jpg' exists in your uploads folder.
    imageSrc = "http://127.0.0.1:5000/images/default.jpg";
  }

  // Debug: log the computed image URL
  console.log("Product image URL:", imageSrc);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{product.product_name}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
        {imageSrc && (
            <Box display="flex" justifyContent="center" mb={2}>
              <img
                src={imageSrc}
                alt={product.product_name}
                style={{ width: "100%", maxWidth: "300px", borderRadius: "8px" }}
                onError={(e) => {
                  // In case the image fails to load, use fallback.
                  e.target.onerror = null;
                  e.target.src = "http://127.0.0.1:5000/images/default.jpg";
                }}
              />
            </Box>
          )}
          <Typography><strong>Product ID:</strong> {product.product_id}</Typography>
          <Typography><strong>Category:</strong> {product.category}</Typography>
          <Typography>
            <strong>Unit Price:</strong> {product.unit_price ? `$${product.unit_price}` : "-"}
          </Typography>
          <Typography>
            <strong>Wholesale Price:</strong> {product.wholesale_price ? `$${product.wholesale_price}` : "-"}
          </Typography>
          <Typography><strong>Quantity:</strong> {product.quantity || "-"}</Typography>
          <Typography>
            <strong>Stock Threshold:</strong> {product.stock_threshold || "-"}
          </Typography>
          <Typography>
            <strong>Date of Entry:</strong> {product.date_of_entry ? new Date(product.date_of_entry).toLocaleDateString() : "-"}
          </Typography>
          <Typography><strong>Tax:</strong> {product.tax || "-"}</Typography>
          <Typography><strong>Discount Type:</strong> {product.discount_type || "-"}</Typography>
          <Typography><strong>Discount Value:</strong> {product.discount_value || "-"}</Typography>
          <Typography><strong>Product Status:</strong> {product.product_status || "-"}</Typography>
          <Typography><strong>Warranty Info:</strong> {product.warranty_info || "-"}</Typography>
          <Typography><strong>Description:</strong> {product.description || "-"}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetailModal;
