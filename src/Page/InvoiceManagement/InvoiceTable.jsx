import React, {useState,  useEffect} from "react";
import { Table, TableBody, TableCell, TableContainer, Typography, TableHead, TableRow, Paper, IconButton, Button, TablePagination, } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ViewInvoice from "./ViewInvoice";


  const keyMap = {
    "invoice id": "id",
    "category": "category",
    "customer id": "customer_id",
  }

const InvoiceTable = ({ searchType, searchValue, categoryFilter, paymentFilter, sortBy }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

   // Fetch invoices from the backend API on component mount
   useEffect(() => {
    fetch("http://localhost:5000/api/invoices")
      .then((res) => res.json())
      .then((data) => {
        setInvoices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching invoices:", err);
        setLoading(false);
      });
  }, []);

   // When clicking on an Invoice ID, fetch full details from both tables
   const handleView = (invoice) => {
    fetch(`http://localhost:5000/api/invoices/${invoice.invoice_id}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedInvoice(data);
      })
      .catch((err) => console.error("Error fetching full invoice details:", err));
  };

  const handleDelete = (invoice) => {
    // Log the invoice to see its structure
    console.log("Deleting invoice:", invoice);
    
    // Use invoice.invoice_id if available, otherwise invoice.id
    const invoiceId = invoice.invoice_id || invoice.id;
    
    if (!invoiceId) {
      console.error("Invoice ID is missing");
      return;
    }
  
    if (window.confirm(`Are you sure you want to delete invoice ${invoiceId}?`)) {
      fetch(`http://localhost:5000/api/invoices/${invoiceId}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to delete invoice");
          }
          return res.json();
        })
        .then(() => {
          // Remove the deleted invoice from state
          setInvoices((prev) =>
            prev.filter((inv) => (inv.invoice_id || inv.id) !== invoiceId)
          );
        })
        .catch((err) => {
          console.error("Error deleting invoice:", err);
        });
    }
  };

  const handleClose = () => {
    setSelectedInvoice(null);
  };


  // Filtering logic based on searchType, searchValue, categoryFilter, paymentFilter
  const filteredInvoices = invoices.filter((inv) => {
    const searchKey = keyMap[searchType.toLowerCase()] || searchType;
    return (
      (categoryFilter === "All" || inv.category === categoryFilter) &&
      (paymentFilter === "All" || inv.paymentMethod === paymentFilter) &&
      (!searchValue ||
        (inv[searchKey] &&
          inv[searchKey].toString().toLowerCase().includes(searchValue.toLowerCase())))
    );
  });

  // Sorting logic
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (sortBy === "amount") return b.amount - a.amount;
    if (sortBy === "date") return new Date(b.date) - new Date(a.date);
    return 0;
  });

  // Pagination logic
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 3 }}>
        Loading invoices...
      </Typography>
    );
  }

  return (
    <Paper sx={{ marginTop: 2, borderRadius: 3, overflow: "hidden", boxShadow: 4 }}>
    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#1976d2" }}>
        <TableRow>
    {[
      "Invoice ID",
      "Customer ID",
      "Date",
      "Amount",
      "Payment Method",
      "Transaction ID",
      "Coupon Code",
      "Coupon Discount",
      "Final Total",
      "Actions",
    ].map((header) => (
      <TableCell key={header} sx={{ color: "#fff", fontWeight: "bold" }}>
        {header}
      </TableCell>
    ))}
  </TableRow>
        </TableHead>
        <TableBody>
        {sortedInvoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((invoice) => (
             <TableRow key={invoice.invoice_id} sx={{ transition: "0.3s ease-in-out", "&:hover": { backgroundColor: "#f0f7ff" } }}>
             <TableCell>
                  <Button onClick={() => handleView(invoice)} sx={{ textTransform: "none", fontWeight: "bold", color: "#1976d2" }}>
                    {invoice.invoice_id}
                  </Button>
                </TableCell>
                <TableCell>{invoice.customer_id}</TableCell>
        <TableCell>{invoice.invoice_date}</TableCell>
        <TableCell>₹{invoice.grand_total}</TableCell>
        <TableCell>{invoice.payment_method}</TableCell>
        <TableCell>{invoice.transaction_id}</TableCell>
        <TableCell>{invoice.coupon_code}</TableCell>
        <TableCell>{invoice.coupon_discount}</TableCell>
        <TableCell>₹{invoice.final_grand_total}</TableCell>
              <TableCell>
                <IconButton color="primary"><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(invoice)}><DeleteIcon /></IconButton>
                <Button variant="contained" size="small" startIcon={<VisibilityIcon />} onClick={() => handleView(invoice)} sx={{ marginLeft: 1 }}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      {/* Pagination */}
      <TablePagination
  component="div"
  count={sortedInvoices.length}
  page={page}
  onPageChange={handleChangePage}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={handleChangeRowsPerPage}
  rowsPerPageOptions={[3, 5, 10, 25, 50, 100]}
  sx={{
    "& .MuiTablePagination-root": { backgroundColor: "#f5f5f5" },
    "& .MuiSelect-select": { padding: "6px 10px" },
  }}
/>

      {/* ViewInvoice Modal */}
      {selectedInvoice && (
  <ViewInvoice
    invoiceData={selectedInvoice.invoice}
    products={selectedInvoice.products}
    open={!!selectedInvoice}
    onClose={handleClose}
  />
)}
        </Paper>
  );
};

export default InvoiceTable;
