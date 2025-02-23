import React, { useState, useEffect } from "react";
import { Button, Menu, MenuItem, Tooltip, Stack, ListItemIcon, ListItemText,} from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import GridOnIcon from "@mui/icons-material/GridOn";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Export = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [expenses, setExpenses] = useState([]);

  // Fetch Expenses from API  
  useEffect(() => {
    fetch("http://localhost:5000/api/expenses")
      .then((res) => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Fetched expenses:", data);
        setExpenses(data);
      })
      .catch((err) => {
        console.error("Error fetching expenses:", err);
      });
  }, []);

  // Open Export Menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close Export Menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Filter expenses by selected date range
  const filteredExpenses = expenses.filter((expense) => {
    if (!startDate || !endDate) return true;
    const paymentDate = dayjs(expense.paymentDate);
    return paymentDate.isAfter(dayjs(startDate).subtract(1, "day")) && paymentDate.isBefore(dayjs(endDate).add(1, "day"));
  });

  // Export Data
  const handleExport = (format) => {
    if (filteredExpenses.length === 0) {
      alert("No data available for the selected range.");
      return;
    }

    if (format === "CSV") exportCSV();
    else if (format === "Excel") exportExcel();
    else if (format === "PDF") exportPDF();

    handleClose();
  };

  // Export as CSV
  const exportCSV = () => {
    const csvRows = [];
    const headers = Object.keys(filteredExpenses[0]).join(",");
    csvRows.push(headers);

    filteredExpenses.forEach((row) => {
      const values = Object.values(row).join(",");
      csvRows.push(values);
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "expenses.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export as Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredExpenses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    XLSX.writeFile(workbook, "expenses.xlsx");
  };

  // Export as PDF
  const exportPDF = () => {
    const doc = new jsPDF();
  
    // Add a title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Expense Report", 105, 15, null, null, "center");
  
    // Define table headers
    const headers = [
      ["Date", "Category", "Amount", "Payment Method", "Description"],
    ];
  
    // Format table data properly
    const tableData = filteredExpenses.map((expense) => [
      dayjs(expense.paymentDate).format("YYYY-MM-DD"),
      expense.category,
      `$${expense.amount.toFixed(2)}`, // Ensure currency formatting
      expense.paymentMethod,
      expense.description,
    ]);
  
    doc.autoTable({
      head: headers,
      body: tableData,
      startY: 25,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133], // Green header
        textColor: [255, 255, 255], // White text
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245], // Light grey rows
      },
      columnStyles: {
        0: { cellWidth: 30 }, // Date
        1: { cellWidth: 40 }, // Category
        2: { cellWidth: 25, halign: "right" }, // Amount
        3: { cellWidth: 40 }, // Payment Method
        4: { cellWidth: 50 }, // Description
      },
    });
  
    doc.save("expenses.pdf");
  };

  return (
    <Stack spacing={2} direction="row" alignItems="center">
      {/* Date Pickers for Range Selection */}
      <DatePicker
        label="Start Date"
        value={startDate}
        onChange={(newValue) => setStartDate(newValue)}
        format="YYYY-MM-DD"
      />
      <DatePicker
        label="End Date"
        value={endDate}
        onChange={(newValue) => setEndDate(newValue)}
        format="YYYY-MM-DD"
      />

      {/* Export Button with Tooltip */}
      <Tooltip title="Download Data" arrow>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudDownloadIcon />}
          onClick={handleClick}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            backgroundColor: "#0288d1",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px) scale(1.05)",
              backgroundColor: "#0277bd",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
            },
          }}
        >
          Export Data
        </Button>
      </Tooltip>

      {/* Dropdown for Format Selection */}
      <Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleClose}
  sx={{
    "& .MuiPaper-root": {
      borderRadius: "10px",
      boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
      backgroundColor: "#fff",
    },
  }}
>
  <MenuItem
    onClick={() => handleExport("CSV")}
    sx={{
      "&:hover": { backgroundColor: "#e3f2fd" },
    }}
  >
    <ListItemIcon>
      <TableChartIcon color="primary" />
    </ListItemIcon>
    <ListItemText primary="Export as CSV" />
  </MenuItem>

  <MenuItem
    onClick={() => handleExport("Excel")}
    sx={{
      "&:hover": { backgroundColor: "#e8f5e9" },
    }}
  >
    <ListItemIcon>
      <GridOnIcon color="success" />
    </ListItemIcon>
    <ListItemText primary="Export as Excel" />
  </MenuItem>

  <MenuItem
    onClick={() => handleExport("PDF")}
    sx={{
      "&:hover": { backgroundColor: "#ffebee" },
    }}
  >
    <ListItemIcon>
      <PictureAsPdfIcon color="error" />
    </ListItemIcon>
    <ListItemText primary="Export as PDF" />
  </MenuItem>
</Menu>
    </Stack>
  );
};

export default Export;
