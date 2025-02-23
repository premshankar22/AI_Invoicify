import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const categories = [
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

const BudgetForm = ({ onClose, onSave }) => {
  const [budgetAmount, setBudgetAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleSave = () => {
    const newBudget = {
      amount: budgetAmount,
      description: description,
      category: category,
    };

    onSave(newBudget); // Pass budget data to parent component
    onClose(); // Close the modal
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", color: "#1976d2" }}>
        Add Budget
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {/* Budget Amount Field */}
          <TextField
            label="Budget Amount"
            type="number"
            variant="outlined"
            fullWidth
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />

          {/* Category Dropdown */}
          <FormControl fullWidth variant="outlined">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
            >
              {categories.map((cat, index) => (
                <MenuItem key={index} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Description Field */}
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <Button onClick={onClose} variant="outlined" color="error">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Budget
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BudgetForm;
