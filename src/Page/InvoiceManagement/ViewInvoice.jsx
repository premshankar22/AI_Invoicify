import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Grid,
  Divider,
  IconButton,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";

const ViewInvoice = ({ invoiceData, products, open, onClose }) => {
  if (!invoiceData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      {/* Header Section */}
      <DialogTitle
        sx={{
          fontWeight: "bold",
          backgroundColor: "#1565C0",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <ReceiptLongIcon />
          Invoice Details - {invoiceData.invoice_id}
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        {/* Invoice Information */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}>
            Invoice Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Invoice ID:</strong> {invoiceData.invoice_id}</Typography>
              <Typography><strong>Customer ID:</strong> {invoiceData.customer_id}</Typography>
              <Typography><strong>Date:</strong> {invoiceData.invoice_date}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Grand Total:</strong> ₹{invoiceData.grand_total}</Typography>
              <Typography><strong>Payment Method:</strong> {invoiceData.payment_method}</Typography>
              <Typography><strong>Transaction ID:</strong> {invoiceData.transaction_id || "N/A"}</Typography>
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ my: 3 }} />

        {/* Products Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main", display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <ListAltIcon />
            Products
          </Typography>
          {products?.length > 0 ? (
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead sx={{ backgroundColor: "#1565C0" }}>
                  <TableRow>
                    {["Product ID", "Category", "Name", "Brand", "Quantity", "Unit Price", "Sub Total", "Net Amount"].map((header) => (
                      <TableCell key={header} sx={{ color: "#fff", fontWeight: "bold" }}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((prod, idx) => (
                    <TableRow key={idx} sx={{ "&:hover": { backgroundColor: "#f0f7ff" } }}>
                      <TableCell>{prod.product_id}</TableCell>
                      <TableCell>{prod.category}</TableCell>
                      <TableCell>{prod.product_name}</TableCell>
                      <TableCell>{prod.brand}</TableCell>
                      <TableCell>{prod.quantity}</TableCell>
                      <TableCell>₹{prod.unit_price}</TableCell>
                      <TableCell>₹{Number(prod.sub_total).toFixed(2)}</TableCell>
                      <TableCell>₹{Number(prod.net_amount).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No products found.</Typography>
          )}
        </Box>
        <Divider sx={{ my: 3 }} />

        {/* Shopping & Delivery Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main", display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <ShoppingCartIcon />
            Shopping & Delivery
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Bag Type:</strong> {invoiceData.bag_type || "N/A"}</Typography>
              <Typography><strong>Quantity:</strong> {invoiceData.bag_quantity || 0}</Typography>
              <Typography><strong>Price per Bag:</strong> ₹{invoiceData.bag_price || 0}</Typography>
              <Typography><strong>Total:</strong> ₹{invoiceData.bag_total || 0}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Delivery KM:</strong> {invoiceData.km || 0}</Typography>
              <Typography><strong>Delivery Charge:</strong> ₹{invoiceData.delivery_charge || 0}</Typography>
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ my: 3 }} />

        {/* Shipping Address */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main", textAlign: "center", mb: 2 }}>
            Shipping Address
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography><strong>Name:</strong> {invoiceData.shipping_customer_name || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography><strong>Phone:</strong> {invoiceData.shipping_customer_phone || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography><strong>Address:</strong> {invoiceData.shipping_address || "N/A"}</Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Footer Actions */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button onClick={onClose} variant="contained" color="primary" sx={{ px: 4, py: 1.5, fontSize: "1rem" }}>
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ViewInvoice;
