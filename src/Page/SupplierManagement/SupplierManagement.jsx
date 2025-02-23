// SupplierManagement.js
import React, { useState, useEffect } from "react";
import { 
  Box, Typography, TextField, MenuItem, IconButton, Button, Paper 
} from "@mui/material";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";
import SupplierWholesalerDetail from "./SupplierWholesalerDetail";
import AddSupplierWholesaler from "./AddSupplierWholesaler";
import Section1 from "./Section1";
import Section2 from "./Section2";

const SupplierManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");
  const [openAdd, setOpenAdd] = useState(false);
  const [suppliers, setSuppliers] = useState([]);

  // Fetch supplier data
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/suppliers");
        if (!response.ok) {
          console.error("Error fetching suppliers");
          return;
        }
        const data = await response.json();
        const transformedData = data.map((supplier) => ({
          ...supplier,
          // Convert product_category to a displayable string
          category: Array.isArray(supplier.product_category)
            ? supplier.product_category.join(", ")
            : supplier.product_category || "N/A",
          transactions: supplier.transactions || 0,
          addedDate: supplier.date_time
            ? new Date(supplier.date_time).toLocaleDateString()
            : "N/A",
          pendingPayment: supplier.pendingPayment || 0,
          dueDate: supplier.dueDate || "N/A",
          issue: supplier.issue || "",
        }));
        setSuppliers(transformedData);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchSuppliers();
  }, []);

  // Derived states for sections:
  const pendingPayments = suppliers.filter((s) => s.pendingPayment > 0);
  const topSuppliers = suppliers.slice().sort((a, b) => b.transactions - a.transactions);
  const recentSuppliers = suppliers.slice().sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
  const supplierIssues = suppliers.filter((s) => s.issue && s.issue.trim() !== "");

  // Handlers for search bar
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setSearchFilter(event.target.value);
  };

  const searchOptions = [
    { value: "all", label: "All" },
    { value: "id", label: "Supplier & Wholesaler ID" },
    { value: "name", label: "Name" },
    { value: "category", label: "Product Category" },
  ];

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <Paper 
        sx={{ 
          padding: "20px", 
          borderRadius: 3, 
          maxWidth: "1350px", 
          margin: "0 auto", 
          boxShadow: "0px 2px 20px rgba(0,0,0,0.1)", 
          backgroundColor: "#ffffff"
        }}
      >
        <Typography 
          variant="h4" 
          textAlign="center" 
          sx={{ marginBottom: "30px", fontWeight: "bold" }}
        >
          Supplier &amp; Wholesaler Management
        </Typography>

        {/* Search Bar & Add Button Row */}
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            gap: 2,
            flexWrap: "wrap",
            marginBottom: "30px"
          }}
        >
          {/* Search Bar with Dropdown */}
          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              flexGrow: 1, 
              justifyContent: "center", 
              gap: 2 
            }}
          >
            <TextField
              select
              value={searchFilter}
              onChange={handleFilterChange}
              sx={{ minWidth: 180 }}
              size="small"
              label="Filter"
            >
              {searchOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ minWidth: 500 }}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>

          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            sx={{ whiteSpace: "nowrap", paddingX: 3, fontWeight: "bold", textTransform: "none" }}
            onClick={() => setOpenAdd(true)} 
          >
            Add Supplier &amp; Wholesaler
          </Button>
        </Box>

        {/* Conditionally render the AddSupplierWholesaler component */}
        {openAdd && (
          <AddSupplierWholesaler 
            open={openAdd} 
            handleClose={() => setOpenAdd(false)} 
          />
        )}
        
        <Section1 suppliers={suppliers} pendingPayments={pendingPayments} />
        {/* Render the Detail Component */}
        <Box sx={{ marginBottom: "10px" }}>
          <SupplierWholesalerDetail searchQuery={searchQuery} searchFilter={searchFilter} />
        </Box>

        {/* Render the Two Sections */}
        <Section2
          topSuppliers={topSuppliers}
          supplierIssues={supplierIssues}
          recentSuppliers={recentSuppliers}
          pendingPayments={pendingPayments}
        />
      </Paper>
    </Box>
  );
};

export default SupplierManagement;
