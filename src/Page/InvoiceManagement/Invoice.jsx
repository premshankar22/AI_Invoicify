import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  MenuItem,
  Select,
  IconButton,
  TextField,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GenerateInvoice from "./GenerateInvoice.jsx";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PaymentIcon from "@mui/icons-material/Payment";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Invoice = ({ products, grandTotal, onBack }) => {
   // State for conditional rendering
  const [showInvoice, setShowInvoice] = useState(false);

  // Generate Invoice ID and Customer ID only once
  const [invoiceId] = useState("INV-" + new Date().getTime());
  const [customerId] = useState("CUST-" + Math.floor(Math.random() * 1000));
  const invoiceDate = new Date().toLocaleString();

  // Shopping Bag state
  const [bagType, setBagType] = useState("Medium");
  const [bagQuantity, setBagQuantity] = useState(0);
  const bagPrice = bagType === "Medium" ? 10 : 15;
  const bagTotal = bagQuantity * bagPrice;

  // Delivery Charge state (in kilometers)
  const [km, setKm] = useState(0);
  const deliveryCharge = km * 30;

  // Coupon Code state and mapping
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const couponMapping = {
    SAVE10: 10,
    OFF20: 20,
    DISCOUNT30: 30,
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (couponMapping[code]) {
      setCouponDiscount(couponMapping[code]);
    } else {
      setCouponDiscount(0);
      alert("Invalid coupon code");
    }
  };
  
 // Calculate totals
 const combinedTotal = bagTotal + deliveryCharge;
 const finalGrandTotal = Math.max(grandTotal - couponDiscount, 0);

    // Payment Details state
    const [paymentStatus, setPaymentStatus] = useState("UnPaid");
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [currencyType, setCurrencyType] = useState("INR");
    const [transactionId, setTransactionId] = useState("");

    // Shipping Address state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");

  // Bundle shipping address details (this object always reflects the latest state)
  const shippingAddress = { customerName, customerPhone, address };

  // When "Next" is clicked, simply set showInvoice to true
  const handleNext = () => {
    setShowInvoice(true);
  };

  // If showInvoice is true, render the GenerateInvoice component with all the details
  if (showInvoice) {
    return (
      <GenerateInvoice
        invoiceId={invoiceId}
        customerId={customerId}
        invoiceDate={invoiceDate}
        products={products}
        grandTotal={grandTotal}
        bagType={bagType}
        bagQuantity={bagQuantity}
        bagPrice={bagPrice}
        bagTotal={bagTotal}
        km={km}
        deliveryCharge={deliveryCharge}
        combinedTotal={combinedTotal}
        couponCode={couponCode}
        couponDiscount={couponDiscount}
        finalGrandTotal={finalGrandTotal}
        paymentStatus={paymentStatus}
        paymentMethod={paymentMethod}
        currencyType={currencyType}
        transactionId={transactionId}
        shippingAddress={shippingAddress}
        onBack={() => setShowInvoice(false)}
      />
    );
  }


  return (
    <Box sx={{ p: 3 }}>
      {/* Invoice Header */}
      <Typography variant="h4" gutterBottom textAlign="center">
        Invoice
      </Typography>
      <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        boxShadow: 3,
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        {/* Invoice ID */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ReceiptLongIcon sx={{ color: "primary.main", fontSize: 24 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.primary" }}>
            Invoice ID: {invoiceId}
          </Typography>
        </Box>
        {/* Customer ID */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PersonIcon sx={{ color: "primary.main", fontSize: 24 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.primary" }}>
            Customer ID: {customerId}
          </Typography>
        </Box>
        {/* Date & Time */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccessTimeIcon sx={{ color: "primary.main", fontSize: 24 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.primary" }}>
            Date & Time: {invoiceDate}
          </Typography>
        </Box>
      </Box>
    </Paper>

    <Paper
  sx={{
    p: 3,
    mb: 3,
    borderRadius: 2,
    boxShadow: 3,
    backgroundColor: "#fff",
  }}
>
  <TableContainer sx={{ maxHeight: 450, overflowY: "auto" }}>
    <Table stickyHeader>
      <TableHead
        sx={{
          "& .MuiTableCell-root": {
            background:
              "linear-gradient(45deg, #1769aa 30%, #4dabf5 90%)",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1rem",
          },
        }}
      >
        <TableRow>
          <TableCell>Product ID</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Product Name</TableCell>
          <TableCell>Brand</TableCell>
          <TableCell>Quantity</TableCell>
          <TableCell>Unit</TableCell>
          <TableCell>Unit Price</TableCell>
          <TableCell>GST</TableCell>
          <TableCell>Discount Type</TableCell>
          <TableCell>Discount Value</TableCell>
          <TableCell>Sub Total</TableCell>
          <TableCell>Net Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.length === 0 ? (
          <TableRow>
            <TableCell colSpan={12} align="center">
              No Products Added
            </TableCell>
          </TableRow>
        ) : (
          products.map((prod, idx) => (
            <TableRow key={idx}>
              <TableCell>{prod.productId}</TableCell>
              <TableCell>{prod.category}</TableCell>
              <TableCell>{prod.productName}</TableCell>
              <TableCell>{prod.brand}</TableCell>
              <TableCell>{prod.quantity}</TableCell>
              <TableCell>{prod.unit}</TableCell>
              <TableCell>₹{prod.unitPrice}</TableCell>
              <TableCell>{prod.gst}</TableCell>
              <TableCell>{prod.discountType}</TableCell>
              <TableCell>
                {prod.discountType === "Fixed"
                  ? `₹${prod.discountValue}`
                  : prod.discountType === "Percentage"
                  ? `${prod.discountValue}%`
                  : prod.discountValue}
              </TableCell>
              <TableCell>₹{prod.subTotal.toFixed(2)}</TableCell>
              <TableCell>₹{prod.netAmount.toFixed(2)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>
  {/* Grand Total */}
  <Box
    sx={{
      mt: 2,
      textAlign: "right",
      fontWeight: "bold",
      fontSize: "1.8rem",
      color: "#fff",
      background: "linear-gradient(45deg, #ff8a00, #e52b50)",
      p: 2,
      borderRadius: 2,
      boxShadow: 3,
      textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
    }}
  >
    Grand Total: ₹{grandTotal.toFixed(2)}
  </Box>
</Paper>
<Paper
  sx={{
    p: 3,
    mb: 3,
    borderRadius: 2,
    boxShadow: 3,
    backgroundColor: "#f9f9f9",
  }}
>
  <Typography
    variant="h6"
    gutterBottom
    sx={{ color: "primary.main", fontWeight: "bold" }}
  >
    Shopping & Delivery
  </Typography>
  <Box
    sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 3,
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    {/* Shopping Bag Controls */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography sx={{ fontWeight: "bold", color: "text.primary" }}>
        Bag Type:
      </Typography>
      <Select
        value={bagType}
        size="small"
        onChange={(e) => setBagType(e.target.value)}
        sx={{
          minWidth: 100,
          "& .MuiSelect-select": { color: "text.primary" },
          border: "1px solid #ccc",
          borderRadius: 1,
        }}
      >
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="Large">Large</MenuItem>
      </Select>
      <IconButton
        onClick={() => setBagQuantity((prev) => (prev > 0 ? prev - 1 : 0))}
        size="small"
        sx={{ border: "1px solid #ccc", borderRadius: 1 }}
      >
        -
      </IconButton>
      <Typography
        sx={{ fontWeight: "bold", minWidth: 30, textAlign: "center" }}
      >
        {bagQuantity}
      </Typography>
      <IconButton
        onClick={() => setBagQuantity((prev) => prev + 1)}
        size="small"
        sx={{ border: "1px solid #ccc", borderRadius: 1 }}
      >
        +
      </IconButton>
    </Box>

    {/* Delivery Charge Controls */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography sx={{ fontWeight: "bold", color: "text.primary" }}>
        Delivery KM:
      </Typography>
      <IconButton
        onClick={() => setKm((prev) => (prev > 0 ? prev - 1 : 0))}
        size="small"
        sx={{ border: "1px solid #ccc", borderRadius: 1 }}
      >
        -
      </IconButton>
      <Typography
        sx={{ fontWeight: "bold", minWidth: 30, textAlign: "center" }}
      >
        {km}
      </Typography>
      <IconButton
        onClick={() => setKm((prev) => prev + 1)}
        size="small"
        sx={{ border: "1px solid #ccc", borderRadius: 1 }}
      >
        +
      </IconButton>
    </Box>
  </Box>
  <Box
    sx={{
      textAlign: "right",
      mt: 3,
      fontWeight: "bold",
      fontSize: "1.8rem",
      color: "#fff",
      background: "linear-gradient(45deg, #00b09b, #96c93d)",
      p: 2,
      borderRadius: 2,
      boxShadow: 2,
      textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
    }}
  >
    <Typography>
      Combined Total (Bag + Delivery): ₹{(bagTotal + deliveryCharge).toFixed(2)}
    </Typography>
  </Box>
</Paper>

<Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#ffffff",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <LocalOfferIcon sx={{ color: "primary.main", fontSize: 28, mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
          Coupon Code
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mt: 1,
        }}
      >
        <TextField
          label="Enter Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocalOfferIcon sx={{ color: "primary.main" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiInputLabel-root": { color: "text.secondary" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "primary.main" },
              "&:hover fieldset": { borderColor: "primary.dark" },
              "&.Mui-focused fieldset": { borderColor: "primary.dark" },
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleApplyCoupon}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
          }}
        >
          APPLY
        </Button>
        <Typography sx={{ color: "text.secondary", fontWeight: "bold" }}>
          Discount: ₹{couponDiscount.toFixed(2)}
        </Typography>
      </Box>
      <Box sx={{ textAlign: "right", mt: 3 }}>
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            color: "text.primary",
          }}
        >
          Grand Total (Before Coupon): ₹{grandTotal.toFixed(2)}
        </Typography>
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "1.4rem",
            color: "primary.main",
            mt: 1,
          }}
        >
          Grand Total (After Coupon): ₹{finalGrandTotal.toFixed(2)}
        </Typography>
      </Box>
    </Paper>

    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#fff",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <PaymentIcon sx={{ color: "primary.main", mr: 1, fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
          Payment Details
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel sx={{ color: "text.secondary" }}>Payment Status</InputLabel>
          <Select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            label="Payment Status"
            sx={{
              "& .MuiSelect-select": { color: "text.primary" },
              "& fieldset": { borderColor: "primary.main" },
            }}
          >
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="UnPaid">UnPaid</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel sx={{ color: "text.secondary" }}>Payment Method</InputLabel>
          <Select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            label="Payment Method"
            sx={{
              "& .MuiSelect-select": { color: "text.primary" },
              "& fieldset": { borderColor: "primary.main" },
            }}
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="Bank">Bank</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
          </Select>
        </FormControl>

        {paymentMethod === "Cash" ? (
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel sx={{ color: "text.secondary" }}>Currency Type</InputLabel>
            <Select
              value={currencyType}
              onChange={(e) => setCurrencyType(e.target.value)}
              label="Currency Type"
              sx={{
                "& .MuiSelect-select": { color: "text.primary" },
                "& fieldset": { borderColor: "primary.main" },
              }}
            >
              <MenuItem value="INR">INR</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
            </Select>
          </FormControl>
        ) : (
          <TextField
            label="Transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            size="small"
            sx={{
              minWidth: 140,
              "& .MuiInputLabel-root": { color: "text.secondary" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "primary.main" },
                "&:hover fieldset": { borderColor: "primary.dark" },
                "&.Mui-focused fieldset": { borderColor: "primary.dark" },
              },
            }}
          />
        )}
      </Box>
    </Paper>

      {/* Shipping Address Section */}
      <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <LocationOnIcon sx={{ color: "primary.main", mr: 1, fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
          Shipping Address
        </Typography>
      </Box>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Customer Name"
            fullWidth
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiInputLabel-root": { color: "text.secondary" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "primary.main" },
                "&:hover fieldset": { borderColor: "primary.dark" },
                "&.Mui-focused fieldset": { borderColor: "primary.dark" },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Customer Phone No"
            fullWidth
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiInputLabel-root": { color: "text.secondary" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "primary.main" },
                "&:hover fieldset": { borderColor: "primary.dark" },
                "&.Mui-focused fieldset": { borderColor: "primary.dark" },
              },
            }}
          />
        </Grid>
      </Grid>
      <TextField
        label="Enter Shipping Address"
        multiline
        rows={3}
        fullWidth
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon sx={{ color: "text.secondary" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mt: 2,
          "& .MuiInputLabel-root": { color: "text.secondary" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "primary.main" },
            "&:hover fieldset": { borderColor: "primary.dark" },
            "&.Mui-focused fieldset": { borderColor: "primary.dark" },
          },
        }}
      />
    </Paper>

      {/* Navigation Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" color="primary" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" color="primary" endIcon={<ArrowForwardIcon />} onClick={handleNext}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Invoice;
