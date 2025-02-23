import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Tooltip,
  Stack
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ExpensesSummaryCards from "./ExpensesSummaryCards";
import ExpenseTable from "./ExpenseTable";
import ExpenseForm from "./ExpenseForm";
import BudgetForm from "./BudgetForm";
import Export from "./Export";


const ExpenseManagement = () => {
  const [searchType, setSearchType] = useState("ExpenseID");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showExpenseForm, setShowExpenseForm] = useState(false); 
  const [showBudgetForm, setShowBudgetForm] = useState(false); 

  const categoryOptions = [
    "Rent/Lease",
    "Maintenance",
    "Salaries and Wages",
    "Office Supplies",
    "Digital Advertising",
    "Traditional Advertising",
    "Branding",
    "Local Transportation",
    "Business Travel",
    "Miscellaneous",
    "Emergency Expenses",
  ];

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
    // Reset the query when changing type
    setSearchQuery("");
    setSelectedCategory("");
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

   const handleAddExpense = () => {
    // Show the ExpenseForm when ADD Expenses is clicked
    setShowExpenseForm(true);
  };

  const handleCloseForm = () => {
    // Hide the ExpenseForm
    setShowExpenseForm(false);
  };

  const handleSubmitExpense = (newExpense) => {
    // TODO: Add logic to process the new expense (e.g., update state or send to API)
    console.log("New Expense Submitted:", newExpense);
    // Hide the form after submission
    setShowExpenseForm(false);
  };

  const handleAddBudget = () => {
    setShowBudgetForm(true);
  };

  const handleCloseBudgetForm = () => {
    setShowBudgetForm(false);
  };

  return (
    <Box
      sx={{
        p: 4,
        background: "linear-gradient(to right, #f7f8fa, #e7edf2)",
        minHeight: "100vh",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          letterSpacing: "0.05rem",
          color: "#1976d2",
          mb: 4,
        }}
      >
        Expense Management
      </Typography>

      {/* Render Expenses Summary Cards */}
      <ExpensesSummaryCards />

      {/* Row for Search Bar and Add Expenses Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
          backgroundColor: "#fff",
          borderRadius: 2,
          p: 2,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Search Bar Container */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flex: 1,
            maxWidth: "600px",
            backgroundColor: "#f1f3f5",
            p: 1,
            borderRadius: 1,
          }}
        >
          {/* Select for Search Type */}
          <FormControl
            variant="outlined"
            size="small"
            sx={{ minWidth: 150, backgroundColor: "#fff", borderRadius: 1 }}
          >
            <InputLabel>Search By</InputLabel>
            <Select
              value={searchType}
              onChange={handleSearchTypeChange}
              label="Search By"
              sx={{ "& .MuiSelect-select": { py: 1, fontWeight: 500 } }}
            >
              <MenuItem value="ExpenseID">ExpenseID</MenuItem>
              <MenuItem value="Expense Name">Expense Name</MenuItem>
              <MenuItem value="Category">Category</MenuItem>
              <MenuItem value="VendorName">Vendor Name</MenuItem>
              <MenuItem value="Expense Type">Expense Type</MenuItem>
            </Select>
          </FormControl>

          {/* Conditional Input: TextField or Category Dropdown */}
          {searchType === "Category" ? (
            <FormControl
              variant="outlined"
              size="small"
              sx={{ minWidth: 200, backgroundColor: "#fff", borderRadius: 1 }}
            >
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                displayEmpty
                sx={{ "& .MuiSelect-select": { py: 1, fontWeight: 500 } }}
              >
                <MenuItem value="">
                  <em>Select Category</em>
                </MenuItem>
                {categoryOptions.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchQueryChange}
              sx={{
                backgroundColor: "#fff",
                borderRadius: 1,
                flex: 1,
                "& .MuiOutlinedInput-root": { px: 1, fontWeight: 500 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#1976d2" }} />
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Box>

       <Box>
       <Stack direction="row" spacing={2}>  
         <Tooltip title="Click to add a new expense" arrow>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddExpense}
          sx={{
            ml: 3,
            textTransform: "none",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.3s",
            "&:hover": { transform: "scale(1.05)" },
          }}
        >
          ADD Expenses
        </Button>
        </Tooltip>
        <Tooltip title="Click to set a budget for expenses" arrow>
        <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleAddBudget}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              backgroundColor: "#388e3c",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.05)", backgroundColor: "#2e7d32" },
            }}
          >
            ADD Budget
          </Button>
          </Tooltip>
          </Stack>
       </Box>
      </Box>
      
       {/* Render the Export Button */}
       <Export />

      {/* Conditionally Render BudgetForm */}
      {showBudgetForm && <BudgetForm onClose={handleCloseBudgetForm} onSave={(budget) => console.log("New Budget:", budget)} />}

      {/* Conditionally Render ExpenseForm */}
      {showExpenseForm && (
        <ExpenseForm
          onClose={handleCloseForm}
          onSave={handleSubmitExpense}
        />
      )}


      {/* Render ExpenseTable with Global Search Props */}
      <ExpenseTable
        globalSearchType={searchType}
        globalSearchQuery={searchQuery}
        globalSelectedCategory={selectedCategory}
      />
    </Box>
  );
};

export default ExpenseManagement;