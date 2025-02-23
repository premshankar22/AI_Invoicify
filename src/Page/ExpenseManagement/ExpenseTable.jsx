import React, { useState,  useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
  PaginationItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpenseDetailModal from "./ExpenseDetailModal";
import Tooltip from '@mui/material/Tooltip';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Helper function to parse amount string (e.g., "$1,200") to number
const parseAmount = (amountStr) =>
  parseFloat(amountStr.replace(/[^0-9.-]+/g, ""));

// Dummy expense data (fallback)
const dummyData = [
  {
    id: "EXP001",
    name: "Office Rent",
    category: "Rent/Lease",
    vendor: "Acme Realty",
    type: "Fixed",
    amount: "$1,200",
    date: "2025-01-10",
    status: "Approved",
  },
  {
    id: "EXP002",
    name: "Office Supplies",
    category: "Office Supplies",
    vendor: "Staples",
    type: "Variable",
    amount: "$350",
    date: "2025-01-12",
    status: "Pending",
  },
  {
    id: "EXP003",
    name: "Internet Services",
    category: "Maintenance",
    vendor: "Comcast",
    type: "Fixed",
    amount: "$150",
    date: "2025-01-15",
    status: "Approved",
  },
  // Additional dummy data
  {
    id: "EXP004",
    name: "Office Rent",
    category: "Rent/Lease",
    vendor: "Acme Realty",
    type: "Fixed",
    amount: "$1,200",
    date: "2025-01-10",
    status: "Approved",
  },
  {
    id: "EXP005",
    name: "Office Supplies",
    category: "Office Supplies",
    vendor: "Staples",
    type: "Variable",
    amount: "$350",
    date: "2025-01-12",
    status: "Pending",
  },
  {
    id: "EXP006",
    name: "Internet Services",
    category: "Maintenance",
    vendor: "Comcast",
    type: "Fixed",
    amount: "$150",
    date: "2025-01-15",
    status: "Approved",
  },
];
const ExpenseTable = ({
    globalSearchType,
    globalSearchQuery,
    globalSelectedCategory,
  }) => {
    // Use state for fetched expense data. Initialize with dummy data as fallback.
  const [expenseData, setExpenseData] = useState(dummyData);

   // Fetch data from backend on component mount
   useEffect(() => {
    fetch("http://localhost:5000/api/expenses")
      .then((res) => res.json())
      .then((data) => {
        // Map fetched data to the format used in the table
        // Assumes the database returns fields: expenseID, name, category, vendorName, expenseType, amount, paymentDate, status
        const mappedData = data.map((row) => ({
          ...row,
          id: row.expenseID, // Use expenseID as the unique id
          name: row.name,
          category: row.category,
          vendor: row.vendorName,
          type: row.expenseType,
          // Format the amount with a dollar sign
          amount: "₹" + parseFloat(row.amount).toFixed(2),
          date: row.paymentDate,
          status: row.status,
        }));
        setExpenseData(mappedData);
      })
      .catch((err) => console.error("Error fetching expenses:", err));
  }, []);


  // Filter state
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterVendor, setFilterVendor] = useState("");
  const [filterExpenseType, setFilterExpenseType] = useState("");
  const [filterAmountMin, setFilterAmountMin] = useState("");
  const [filterAmountMax, setFilterAmountMax] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Sort state
  const [sortBy, setSortBy] = useState("date_newest");

   // Pagination state
   const [page, setPage] = useState(1);
   const rowsPerPage = 5; // Customize as needed

    // State for Modal
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Combine all filters (both local and global) before sorting
  const filteredData = expenseData
    .filter((expense) => {
      // -- Local Filters --

      // Expense Category (from table controls)
      if (filterCategory && expense.category !== filterCategory) return false;
      // Date Range filter
      if (filterDateFrom && expense.date < filterDateFrom) return false;
      if (filterDateTo && expense.date > filterDateTo) return false;
      // Vendor Name (substring, case-insensitive)
      if (
        filterVendor &&
        !expense.vendor.toLowerCase().includes(filterVendor.toLowerCase())
      )
        return false;
      // Expense Type
      if (filterExpenseType && expense.type !== filterExpenseType) return false;
      // Amount Range
      const amountValue = parseAmount(expense.amount);
      if (filterAmountMin && amountValue < parseFloat(filterAmountMin))
        return false;
      if (filterAmountMax && amountValue > parseFloat(filterAmountMax))
        return false;
      // Status
      if (filterStatus && expense.status !== filterStatus) return false;

      // -- Global Search Filters (from ExpenseManagement) --

      if (globalSearchType) {
        // For text-based searches, only filter if there is a nonempty query.
        if (globalSearchType === "ExpenseID" && globalSearchQuery) {
          if (
            !expense.id.toLowerCase().includes(globalSearchQuery.toLowerCase())
          )
            return false;
        } else if (globalSearchType === "Expense Name" && globalSearchQuery) {
          if (
            !expense.name
              .toLowerCase()
              .includes(globalSearchQuery.toLowerCase())
          )
            return false;
        } else if (globalSearchType === "VendorName" && globalSearchQuery) {
          if (
            !expense.vendor
              .toLowerCase()
              .includes(globalSearchQuery.toLowerCase())
          )
            return false;
        } else if (globalSearchType === "Expense Type" && globalSearchQuery) {
          if (
            !expense.type
              .toLowerCase()
              .includes(globalSearchQuery.toLowerCase())
          )
            return false;
        } else if (globalSearchType === "Category" && globalSelectedCategory) {
          if (expense.category !== globalSelectedCategory) return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      // Sorting based on the chosen sort option
      if (sortBy === "date_newest") {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === "date_oldest") {
        return new Date(a.date) - new Date(b.date);
      } else if (sortBy === "amount_high") {
        return parseAmount(b.amount) - parseAmount(a.amount);
      } else if (sortBy === "amount_low") {
        return parseAmount(a.amount) - parseAmount(b.amount);
      } else if (sortBy === "name_atoz") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

     // Calculate pagination values
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

    // Reset current page if filters change and current page becomes invalid.
    useEffect(() => {
        if (page > totalPages) {
          setPage(1);
        }
      }, [totalPages, page]);

    
       // Handler to open modal when expense name is clicked
  const handleOpenModal = (expense) => {
    setSelectedExpense(expense);
    setModalOpen(true);
  };

  // Handler to close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedExpense(null);
  };

  const handleDeleteExpense = (expenseID) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      fetch(`http://localhost:5000/api/expenses/${expenseID}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Expense deleted:", data);
          // Update the state by filtering out the deleted expense
          setExpenseData((prevData) =>
            prevData.filter((expense) => expense.id !== expenseID)
          );
        })
        .catch((err) => console.error("Error deleting expense:", err));
    }
  };

  return (
    <Box>
      {/* Filter & Sort Controls */}
      <Paper
  sx={{
    p: 3,
    mb: 3,
    //background:
    //  "linear-gradient(135deg, rgba(25, 118, 210, 0.9), rgba(66, 165, 245, 0.9))",
    backgroundColor:'#e0e0e0',
    borderRadius: 3,
    boxShadow: "0px 8px 16px rgba(0,0,0,0.3)",
    fontFamily: "'Montserrat', sans-serif",
  }}
>
  <Grid container spacing={2}>
    {/* Expense Category */}
    <Grid item xs={12} sm={4} md={3}>
      <FormControl fullWidth size="small" sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
        <InputLabel>Category</InputLabel>
        <Select
          label="Category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          sx={{ "& .MuiSelect-select": { fontWeight: 500 } }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Rent/Lease">Rent/Lease</MenuItem>
          <MenuItem value="Maintenance">Maintenance</MenuItem>
          <MenuItem value="Office Supplies">Office Supplies</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    {/* Date Range From */}
    <Grid item xs={12} sm={4} md={3}>
      <TextField
        label="Date From"
        type="date"
        size="small"
        fullWidth
        InputLabelProps={{ shrink: true }}
        value={filterDateFrom}
        onChange={(e) => setFilterDateFrom(e.target.value)}
        sx={{
          backgroundColor: "#fff",
          borderRadius: 1,
          "& input": { fontWeight: 500 },
        }}
      />
    </Grid>

    {/* Date Range To */}
    <Grid item xs={12} sm={4} md={3}>
      <TextField
        label="Date To"
        type="date"
        size="small"
        fullWidth
        InputLabelProps={{ shrink: true }}
        value={filterDateTo}
        onChange={(e) => setFilterDateTo(e.target.value)}
        sx={{
          backgroundColor: "#fff",
          borderRadius: 1,
          "& input": { fontWeight: 500 },
        }}
      />
    </Grid>

    {/* Vendor Name */}
    <Grid item xs={12} sm={4} md={3}>
      <TextField
        label="Vendor Name"
        size="small"
        fullWidth
        value={filterVendor}
        onChange={(e) => setFilterVendor(e.target.value)}
        sx={{
          backgroundColor: "#fff",
          borderRadius: 1,
          "& input": { fontWeight: 500 },
        }}
      />
    </Grid>

    {/* Expense Type */}
    <Grid item xs={12} sm={4} md={3}>
      <FormControl fullWidth size="small" sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
        <InputLabel>Expense Type</InputLabel>
        <Select
          label="Expense Type"
          value={filterExpenseType}
          onChange={(e) => setFilterExpenseType(e.target.value)}
          sx={{ "& .MuiSelect-select": { fontWeight: 500 } }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Fixed">Fixed</MenuItem>
          <MenuItem value="Variable">Variable</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    {/* Amount Range: Min */}
    <Grid item xs={12} sm={4} md={3}>
      <TextField
        label="Min Amount"
        type="number"
        size="small"
        fullWidth
        value={filterAmountMin}
        onChange={(e) => setFilterAmountMin(e.target.value)}
        sx={{
          backgroundColor: "#fff",
          borderRadius: 1,
          "& input": { fontWeight: 500 },
        }}
      />
    </Grid>

    {/* Amount Range: Max */}
    <Grid item xs={12} sm={4} md={3}>
      <TextField
        label="Max Amount"
        type="number"
        size="small"
        fullWidth
        value={filterAmountMax}
        onChange={(e) => setFilterAmountMax(e.target.value)}
        sx={{
          backgroundColor: "#fff",
          borderRadius: 1,
          "& input": { fontWeight: 500 },
        }}
      />
    </Grid>

    {/* Status */}
    <Grid item xs={12} sm={4} md={3}>
      <FormControl fullWidth size="small" sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
        <InputLabel>Status</InputLabel>
        <Select
          label="Status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          sx={{ "& .MuiSelect-select": { fontWeight: 500 } }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Approved">Approved</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    {/* Sort By */}
    <Grid item xs={12} sm={4} md={3}>
      <FormControl fullWidth size="small" sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          label="Sort By"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          sx={{ "& .MuiSelect-select": { fontWeight: 500 } }}
        >
          <MenuItem value="date_newest">Date: Newest First</MenuItem>
          <MenuItem value="date_oldest">Date: Oldest First</MenuItem>
          <MenuItem value="amount_high">Amount: High to Low</MenuItem>
          <MenuItem value="amount_low">Amount: Low to High</MenuItem>
          <MenuItem value="name_atoz">Name: A to Z</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    {/* Reset Filters Button */}
    <Grid item xs={12} sm={4} md={3}>
      <Button
        fullWidth
        variant="outlined"
        size="small"
        onClick={() => {
          setFilterCategory("");
          setFilterDateFrom("");
          setFilterDateTo("");
          setFilterVendor("");
          setFilterExpenseType("");
          setFilterAmountMin("");
          setFilterAmountMax("");
          setFilterStatus("");
          setSortBy("date_newest");
        }}
        sx={{
          borderColor: "#fff",
          color: "#fff",
          fontWeight: "bold",
          letterSpacing: "0.05rem",
          //"&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
          backgroundColor:'#424242'
        }}
      >
        Reset Filters
      </Button>
    </Grid>
  </Grid>
</Paper>

        {/* Expense Table */}
<TableContainer
  component={Paper}
  sx={{
    marginTop: "20px",
    boxShadow: 3,
    borderRadius: 2,
    overflow: "hidden",
    fontFamily: "'Montserrat', sans-serif",
  }}
>
  <Table>
    <TableHead
      sx={{
        background: "linear-gradient(45deg, #1976d2, #42a5f5)",
      }}
    >
      <TableRow>
      <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.05rem" }}>
          Expense ID
        </TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.05rem" }}>
          Expense Name
        </TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.05rem" }}>
          Category
        </TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.05rem" }}>
          Vendor Name
        </TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.05rem" }}>
          Expense Type
        </TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.05rem" }}>
          Amount
        </TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.05rem" }}>
          Date
        </TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.05rem" }}>
          Status
        </TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1rem", letterSpacing: "0.05rem" }}>
          Actions
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {paginatedData.map((expense) => (
        <TableRow
          key={expense.id}
          hover
          sx={{
            "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.1)" },
            transition: "background-color 0.3s ease",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>{expense.id}</TableCell>
          <TableCell>
            <Button
              variant="text"
              color="primary"
              onClick={() => handleOpenModal(expense)}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "0.9rem",
                letterSpacing: "0.03rem",
              }}
            >
              {expense.name}
            </Button>
          </TableCell>
          <TableCell sx={{ fontSize: "0.9rem" }}>{expense.category}</TableCell>
          <TableCell sx={{ fontSize: "0.9rem" }}>{expense.vendor}</TableCell>
          <TableCell sx={{ fontSize: "0.9rem" }}>{expense.type}</TableCell>
          <TableCell sx={{ fontWeight: "bold", color: "#388e3c", fontSize: "0.9rem" }}>
          {expense.amount}
          </TableCell>
          <TableCell sx={{ fontSize: "0.9rem" }}>{expense.date}</TableCell>
          <TableCell>
  <Tooltip
    title={
      expense.status === "Approved"
        ? "Expense Approved"
        : "Expense Pending Approval"
    }
    arrow
  >
    <Box
      sx={{
        background: expense.status === "Approved"
          ? "linear-gradient(45deg, #4caf50, #81c784)"
          : "linear-gradient(45deg, #ff9800, #ffb74d)",
        color: "white",
        px: 2,
        py: 1,
        borderRadius: 2,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "0.9rem",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.3)",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      {expense.status}
    </Box>
  </Tooltip>
</TableCell>
          <TableCell align="right">
  <Tooltip title="Edit Expense" arrow>
    <IconButton
      size="small"
      color="primary"
      sx={{
        mr: 1,
        transition: 'transform 0.2s ease',
        "&:hover": { transform: 'scale(1.1)' },
      }}
    >
      <EditIcon />
    </IconButton>
  </Tooltip>
  
  <Tooltip title="Delete Expense" arrow>
    <IconButton
      size="small"
      color="error"
      onClick={() => handleDeleteExpense(expense.id)}
      sx={{
        transition: 'transform 0.2s ease',
        "&:hover": { transform: 'scale(1.1)' },
      }}
    >
      <DeleteIcon />
    </IconButton>
  </Tooltip>

  <Tooltip title="More Options" arrow>
    <IconButton
      size="small"
      color="secondary"
      sx={{
        ml: 1,
        transition: 'transform 0.2s ease',
        "&:hover": { transform: 'scale(1.1)' },
      }}
    >
      <MoreVertIcon />
    </IconButton>
  </Tooltip>
</TableCell>
        </TableRow>
      ))}
      {paginatedData.length === 0 && (
        <TableRow>
          <TableCell colSpan={9} align="center">
            No records found.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>

        {/* Pagination Controls */}
{totalPages > 1 && (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      mt: 3,
      fontFamily: "'Montserrat', sans-serif",
    }}
  >
    <Pagination
      count={totalPages}
      page={page}
      onChange={handleChangePage}
      color="primary"
      sx={{
        "& .MuiPaginationItem-root": {
          fontWeight: "bold",
          fontSize: "1.1rem",
          borderRadius: "50%",
          transition: "transform 0.3s ease, background-color 0.3s ease",
          mx: 0.5,
          px: 2,
          py: 1,
        },
        "& .MuiPaginationItem-root:hover": {
          transform: "scale(1.1)",
        },
      }}
      renderItem={(item) => (
        <PaginationItem
          components={{
            previous: ChevronLeftIcon,
            next: ChevronRightIcon,
          }}
          {...item}
          sx={{
            fontSize: "1.2rem",
            border: "1px solid transparent",
            "&.Mui-selected": {
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              borderColor: "transparent",
              color: "#fff",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
            },
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.2)",
            },
          }}
        />
      )}
    />
  </Box>
)}
      
      {/* Expense Detail Modal */}
      <ExpenseDetailModal
        open={modalOpen}
        expense={selectedExpense}
        onClose={handleCloseModal}
      />
    </Box>
  );
};

export default ExpenseTable;
