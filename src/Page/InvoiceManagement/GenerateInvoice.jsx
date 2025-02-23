// GenerateInvoice.jsx
import React, {useState} from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import jsPDF from "jspdf";
import "jspdf-autotable";

const GenerateInvoice = ({
  invoiceId,
  customerId,
  invoiceDate,
  products,
  grandTotal,
  bagType,
  bagQuantity,
  bagPrice,
  bagTotal,
  km,
  deliveryCharge,
  combinedTotal,
  couponCode,
  couponDiscount,
  finalGrandTotal,
  paymentStatus,
  paymentMethod,
  currencyType,
  transactionId,
  shippingAddress,
  onBack,
}) => {

    const [invoiceDetails, setInvoiceDetails] = useState({
        invoiceId: "",             
        customerId: "",
        invoiceDate: new Date().toISOString(),  // Ensure a valid date is set
        grandTotal: 0,
        bagType: "",
        bagQuantity: 0,
        bagPrice: 0,
        bagTotal: 0,
        km: 0,
        deliveryCharge: 0,
        combinedTotal: 0,
        couponCode: "",
        couponDiscount: 0,
        finalGrandTotal: 0,
        paymentStatus: "",
        paymentMethod: "",
        currencyType: "",
        transaction_id: "",
        shippingCustomerName: "",
        shippingCustomerPhone: "",
        shippingAddress: "",
      });

    const downloadInvoicePDF = () => {
        // Create a new jsPDF instance
        const doc = new jsPDF();
    
        // Title
        doc.setFontSize(18);
        doc.text("Invoice", 14, 22);
    
        // Invoice basic details
        doc.setFontSize(12);
        const invoiceDetails = [
          `Invoice ID: ${invoiceId}`,
          `Customer ID: ${customerId}`,
          `Invoice Date: ${invoiceDate}`,
          `Payment Status: ${paymentStatus}`,
          `Payment Method: ${paymentMethod}`,
          `Currency: ${currencyType}`,
          `Shipping Name: ${shippingAddress.customerName || "N/A"}`,
          `Shipping Phone: ${shippingAddress.customerPhone || "N/A"}`,
          `Shipping Address: ${shippingAddress.address || "N/A"}`,
        ];
    
        let currentY = 30;
        invoiceDetails.forEach((line) => {
          doc.text(line, 14, currentY);
          currentY += 7;
        });
    
        // Prepare table columns for product details
        const tableColumn = [
          "Product ID",
          "Category",
          "Name",
          "Brand",
          "Qty",
          "Unit",
          "Unit Price",
          "GST",
          "Disc Type",
          "Disc Value",
          "Sub Total",
          "Net Amount",
        ];
    
        // Prepare rows for each product
        const tableRows = products.map((prod) => [
          prod.productId,
          prod.category,
          prod.productName,
          prod.brand,
          prod.quantity.toString(),
          prod.unit,
          `₹${prod.unitPrice}`,
          prod.gst,
          prod.discountType,
          prod.discountType === "Fixed" ? `₹${prod.discountValue}` : `${prod.discountValue}%`,
          `₹${prod.subTotal.toFixed(2)}`,
          `₹${prod.netAmount.toFixed(2)}`,
        ]);
    
        // Use autoTable to add the products table, starting after invoice details
        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: currentY,
          theme: "grid",
          headStyles: { fillColor: [22, 160, 133] },
        });
    
        // After the table, add totals and coupon details
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.text(`Grand Total: ₹${grandTotal.toFixed(2)}`, 14, finalY);
        doc.text(`Bag Total: ₹${bagTotal.toFixed(2)}`, 14, finalY + 7);
        doc.text(`Combined Total: ₹${combinedTotal.toFixed(2)}`, 14, finalY + 14);
        doc.text(`Coupon Code: ${couponCode}`, 14, finalY + 21);
        doc.text(`Coupon Discount: ₹${couponDiscount.toFixed(2)}`, 14, finalY + 28);
        doc.text(`Final Grand Total: ₹${finalGrandTotal.toFixed(2)}`, 14, finalY + 35);
    
        // Download the PDF with a filename that includes the invoice ID
        doc.save(`invoice_${invoiceId}.pdf`);
      };


    // Define createInvoice to post invoiceData to your backend using fetch
    const createInvoice = async (invoiceData) => {
        const response = await fetch("http://localhost:5000/api/invoices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(invoiceData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Network response was not ok");
        }
        
        return await response.json();
      };
  
  const handleCreate = async () => {
    const invoiceData = {
        invoiceId: invoiceDetails.invoiceId, // e.g., set from your state or computed here
        customerId: invoiceDetails.customerId,
        invoiceDate: invoiceDetails.invoiceDate,
        grandTotal: invoiceDetails.grandTotal,
        bagType: invoiceDetails.bagType,
        bagQuantity: invoiceDetails.bagQuantity,
        bagPrice: invoiceDetails.bagPrice,
        bagTotal: invoiceDetails.bagTotal,
        km: invoiceDetails.km,
        deliveryCharge: invoiceDetails.deliveryCharge,
        combinedTotal: invoiceDetails.combinedTotal,
        couponCode: invoiceDetails.couponCode,
        couponDiscount: invoiceDetails.couponDiscount,
        finalGrandTotal: invoiceDetails.finalGrandTotal,
        paymentStatus: invoiceDetails.paymentStatus,
        paymentMethod: invoiceDetails.paymentMethod,
        currencyType: invoiceDetails.currencyType,
        transaction_id: invoiceDetails.transaction_id,
        shippingCustomerName: invoiceDetails.shippingCustomerName,
        shippingCustomerPhone: invoiceDetails.shippingCustomerPhone,
        shippingAddress: invoiceDetails.shippingAddress,
        products: products, // products state from your form
      };
  
    try {
      const result = await createInvoice(invoiceData);
      console.log("Invoice created:", result);
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };


  return (
    <Box
    sx={{
        p: 4,
        background: "linear-gradient(135deg, #ECE9E6, #FFFFFF)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        overflow:'auto'
      }}
    >
      <Card sx={{ borderRadius: 3, boxShadow: 6 }}>
        {/* Card Header */}
        <CardHeader
          title="Invoice Summary"
          titleTypographyProps={{
            variant: "h4",
            sx: { color: "#fff", fontWeight: 600 },
          }}
          sx={{
            backgroundColor: "#2C3E50",
            textAlign: "center",
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
          }}
        />
         
         <CardContent>
  {/* Invoice Header Section */}
  <Paper
    sx={{
      p: 3,
      mb: 3,
      borderRadius: 2,
      boxShadow: 3,
      background: "linear-gradient(45deg, #f5f7fa, #c3cfe2)",
    }}
  >
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Icon for Invoice ID (optional) */}
          {/* <ReceiptLongIcon sx={{ mr: 1, color: "primary.main" }} /> */}
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.primary" }}>
            Invoice ID:{" "}
            <Typography component="span" variant="body1" sx={{ ml: 1 }}>
              {invoiceId}
            </Typography>
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* <PersonIcon sx={{ mr: 1, color: "primary.main" }} /> */}
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.primary" }}>
            Customer ID:{" "}
            <Typography component="span" variant="body1" sx={{ ml: 1 }}>
              {customerId}
            </Typography>
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* <AccessTimeIcon sx={{ mr: 1, color: "primary.main" }} /> */}
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "text.primary" }}>
            Date & Time:{" "}
            <Typography component="span" variant="body1" sx={{ ml: 1 }}>
              {invoiceDate}
            </Typography>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  </Paper>
  <Divider sx={{ mb: 3 }} />

  {/* Product Details Section */}
  <Paper
    sx={{
      p: 3,
      mb: 3,
      borderRadius: 2,
      boxShadow: 3,
    }}
  >
    <Typography
      variant="h6"
      sx={{
        textAlign: "center",
        mb: 2,
        color: "primary.main",
        fontWeight: "bold",
      }}
    >
      Product Details
    </Typography>
    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
      <Table stickyHeader>
        <TableHead
          sx={{
            "& .MuiTableCell-root": {
              background: "linear-gradient(45deg, #16A085 30%, #4dabf5 90%)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1rem",
            },
          }}
        >
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell>Qty</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>GST</TableCell>
            <TableCell>Disc Type</TableCell>
            <TableCell>Disc Value</TableCell>
            <TableCell>Sub Total</TableCell>
            <TableCell>Net Amt</TableCell>
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
                    : `${prod.discountValue}%`}
                </TableCell>
                <TableCell>₹{prod.subTotal.toFixed(2)}</TableCell>
                <TableCell>₹{prod.netAmount.toFixed(2)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
    <Box sx={{ textAlign: "right", mt: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary" }}>
        Total Amount: ₹{grandTotal.toFixed(2)}
      </Typography>
    </Box>
  </Paper>
  <Divider sx={{ mb: 3 }} />

  {/* Shopping & Delivery Section */}
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
      sx={{ mb: 2, color: "primary.main", fontWeight: "bold" }}
    >
      Shopping & Delivery
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", color: "text.primary" }}
        >
          Bag Details:
        </Typography>
        <Typography variant="body2">Type: {bagType}</Typography>
        <Typography variant="body2">Quantity: {bagQuantity}</Typography>
        <Typography variant="body2">
          Price per Bag: ₹{bagPrice}
        </Typography>
        <Typography variant="body2">
          Total: ₹{bagTotal.toFixed(2)}
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", color: "text.primary" }}
        >
          Delivery Details:
        </Typography>
        <Typography variant="body2">KM: {km}</Typography>
        <Typography variant="body2">
          Charge: ₹{deliveryCharge.toFixed(2)}
        </Typography>
      </Grid>
    </Grid>
    <Box sx={{ textAlign: "right", mt: 2 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: "text.primary" }}
      >
        Total: ₹{combinedTotal.toFixed(2)}
      </Typography>
    </Box>
  </Paper>
  <Divider sx={{ mb: 3 }} />

  {/* Coupon Details Section */}
  <Paper
    sx={{
      p: 3,
      mb: 3,
      borderRadius: 2,
      boxShadow: 3,
    }}
  >
    <Typography
      variant="h6"
      sx={{
        mb: 2,
        color: "primary.main",
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      Coupon Details
    </Typography>
    <Typography variant="body1" sx={{ color: "text.primary" }}>
      Coupon Code: <strong>{couponCode || "N/A"}</strong>
    </Typography>
    <Typography variant="body1" sx={{ color: "text.primary" }}>
      Discount: <strong>₹{couponDiscount.toFixed(2)}</strong>
    </Typography>
    <Box sx={{ textAlign: "right", mt: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary" }}>
        Grand Total (After Coupon): ₹{finalGrandTotal.toFixed(2)}
      </Typography>
    </Box>
  </Paper>
  <Divider sx={{ mb: 3 }} />

  {/* Payment Information Section */}
  <Paper
    sx={{
      p: 3,
      mb: 3,
      borderRadius: 2,
      boxShadow: 3,
    }}
  >
    <Typography
      variant="h6"
      sx={{ mb: 2, color: "primary.main", fontWeight: "bold" }}
    >
      Payment Information
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="body1" sx={{ color: "text.primary" }}>
          Payment Status: <strong>{paymentStatus}</strong>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" sx={{ color: "text.primary" }}>
          Payment Method: <strong>{paymentMethod}</strong>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {paymentMethod === "Cash" ? (
          <Typography variant="body1" sx={{ color: "text.primary" }}>
            Currency: <strong>{currencyType}</strong>
          </Typography>
        ) : (
          <Typography variant="body1" sx={{ color: "text.primary" }}>
            Transaction ID: <strong>{transactionId}</strong>
          </Typography>
        )}
      </Grid>
    </Grid>
  </Paper>
  <Divider sx={{ mb: 3 }} />

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
    <Typography
      variant="h6"
      sx={{
        textAlign: "center",
        mb: 2,
        color: "primary.main",
        fontWeight: "bold",
      }}
    >
      Shipping Address
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="body1" sx={{ color: "text.primary" }}>
          Name: <strong>{shippingAddress.customerName || "N/A"}</strong>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" sx={{ color: "text.primary" }}>
          Phone: <strong>{shippingAddress.customerPhone || "N/A"}</strong>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" sx={{ color: "text.primary" }}>
          Address: <strong>{shippingAddress.address || "N/A"}</strong>
        </Typography>
      </Grid>
    </Grid>
  </Paper>
</CardContent>

        <CardActions
      sx={{
        justifyContent: "space-between",
        p: 2,
        backgroundColor: "#F7F7F7",
        borderTop: "1px solid #e0e0e0",
        "& .MuiButton-root": { transition: "all 0.3s ease" },
      }}
    >
      <Button
        variant="contained"
        color="error"
        onClick={onBack}
        startIcon={<ArrowBackIcon />}
        sx={{
          textTransform: "none",
          fontWeight: "bold",
          "&:hover": { backgroundColor: "#c62828" },
        }}
      >
        Back
      </Button>
      <Box>
        <Button
          variant="outlined"
          color="primary"
          onClick={downloadInvoicePDF}
          sx={{
            mr: 1,
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#e3f2fd" },
          }}
          startIcon={<PrintIcon />}
        >
          Download PDF
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleCreate}
          sx={{
            mr: 1,
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#e3f2fd" },
          }}
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#e3f2fd" },
          }}
          startIcon={<SendIcon />}
        >
          Send
        </Button>
      </Box>
    </CardActions>
      </Card>
    </Box>
  );
};

export default GenerateInvoice;
