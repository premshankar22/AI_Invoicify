import React, { useState } from "react";
import { Box, Typography, TextField, MenuItem, Button, Select} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import OverView from "./OverView";
import InvoiceTable from "./InvoiceTable";
import InvoiceForm from "./InvoiceForm";

const categories = ["All", "Grocery", "Electronics", "Mobile", "Accessories", "Clothing", "Furniture", "Sports", "Home", "Kitchen"];
const paymentMethods = ["All", "CASH", "UPI", "BANK", "CARD"];

const InvoiceManagement = () => {
  const [searchType, setSearchType] = useState("Invoice ID");
  const [searchValue, setSearchValue] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [sortBy, setSortBy] = useState(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  if (showInvoiceForm) {
    return <InvoiceForm onClose={() => setShowInvoiceForm(false)} />;
  }

  return (
    <Box sx={{ padding: "20px" }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Invoice Management
      </Typography>

      {/* Search & Button Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        {/* Search Bar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            select
            size="small"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            sx={{ minWidth: 140 }}
          >
            {["Invoice ID", "Category", "Customer ID"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            placeholder={`Search by ${searchType}...`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: <SearchIcon color="action" />,
            }}
          />
        </Box>

        {/* Create Invoice Button */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            color: "#fff",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#1259a3" },
          }}
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setShowInvoiceForm(true)}
        >
          Create Invoice
        </Button>
      </Box>


      {/* Filters */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        {/* Category Filter */}
        <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} sx={{ minWidth: 150 }}>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>

        {/* Payment Method Filter */}
        <Select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} sx={{ minWidth: 150 }}>
          {paymentMethods.map((method) => (
            <MenuItem key={method} value={method}>
              {method}
            </MenuItem>
          ))}
        </Select>

        {/* Sorting Buttons */}
        <Box>
          <Button variant="contained" onClick={() => setSortBy("amount")} sx={{ mr: 1 }}>
            Sort by Amount
          </Button>
          <Button variant="contained" onClick={() => setSortBy("date")}>Sort by Date</Button>
        </Box>
      </Box>

      {/* Render Overview component */}
      <OverView />

      {/* Render Invoice Table component */}
      <InvoiceTable
        searchType={searchType}
        searchValue={searchValue}
        categoryFilter={categoryFilter}
        paymentFilter={paymentFilter}
        sortBy={sortBy}
      />

    </Box>
  );
};

export default InvoiceManagement;
