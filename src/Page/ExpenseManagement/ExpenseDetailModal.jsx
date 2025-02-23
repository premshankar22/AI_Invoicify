import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

const ExpenseDetailModal = ({ open, expense, onClose }) => {
  if (!expense) return null; // Safety check

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Expense Details - {expense.expenseID || expense.id}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2, "& > *": { mb: 1 } }}>
          <Typography variant="body1">
            <strong>Expense ID:</strong> {expense.expenseID || expense.id}
          </Typography>
          <Typography variant="body1">
            <strong>Name:</strong> {expense.name}
          </Typography>
          <Typography variant="body1">
            <strong>Amount:</strong> {expense.amount}
          </Typography>
          <Typography variant="body1">
            <strong>Category:</strong> {expense.category}
          </Typography>
          <Typography variant="body1">
            <strong>Payment Date:</strong> {expense.paymentDate || expense.date}
          </Typography>
          <Typography variant="body1">
            <strong>Description:</strong> {expense.description}
          </Typography>
          <Typography variant="body1">
            <strong>Paid To:</strong> {expense.paidTo}
          </Typography>
          <Typography variant="body1">
            <strong>Payment Method:</strong> {expense.paymentMethod}
          </Typography>
          <Typography variant="body1">
            <strong>Status:</strong> {expense.status}
          </Typography>
          <Typography variant="body1">
            <strong>Files:</strong>{" "}
            {expense.files && expense.files.length
              ? Array.isArray(expense.files)
                ? expense.files.join(", ")
                : expense.files
              : "None"}
          </Typography>
          <Typography variant="body1">
            <strong>Vendor Name:</strong>{" "}
            {expense.vendorName || expense.vendor || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Currency Type:</strong> {expense.currencyType}
          </Typography>
          <Typography variant="body1">
            <strong>Due Date:</strong> {expense.dueDate}
          </Typography>
          <Typography variant="body1">
            <strong>Expense Type:</strong>{" "}
            {expense.expenseType || expense.type}
          </Typography>
          <Typography variant="body1">
            <strong>Tax Info:</strong> {expense.taxInfo}
          </Typography>
          <Typography variant="body1">
            <strong>Transaction ID:</strong>{" "}
            {expense.transactionID ? expense.transactionID : "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Notes:</strong> {expense.notes}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpenseDetailModal;
