import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, Select, InputLabel, Grid, FormControl, Typography, RadioGroup, Radio, FormControlLabel, FormHelperText } from '@mui/material';

const categories = [
  "Rent/Lease", "Maintenance", "Salaries and Wages", "Office Supplies", "Digital Advertising",
  "Traditional Advertising", "Branding", "Local Transportation", "Business Travel", "Miscellaneous",
  "Emergency Expenses",
];
const paymentMethods = ["Cash", "Credit Card", "UPI", "Bank"];
const currencies = ["USD", "EUR", "INR", "GBP", "AUD", "CAD", "JPY", "CNY", "MXN", "SGD", "CHF", "SEK", "NZD", "BRL"];
const expenseTypes = ["Fixed", "Variable", "One-Time", "Recurring"];
const taxInformationOptions = ["GST", "VAT", "Sales Tax", "No Tax"];

const ExpenseForm = ({ onClose, onSave, initialData }) => {
    const [errors, setErrors] = useState({});
    const [expense, setExpense] = useState({
        expenseID: '', 
        name: '',
        amount: '',
        category: '',
        paymentDate: '',
        description: '',
        paidTo: '',
        paymentMethod: '',
        status: '',
        files: [],
        vendorName: '', 
        currencyType: 'USD',
        dueDate: '', 
        expenseType: '', 
        taxInfo: '', 
        transactionID: '', 
        notes: '' 
      });

 // Generate a unique Expense ID
 const generateExpenseID = () => {
    return `EXP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  useEffect(() => {
    if (initialData) {
        setExpense((prev) => ({
            ...initialData,
            expenseID: initialData.expenseID || prev.expenseID, // Preserve ID if exists
        }));
    } else {
        setExpense((prev) => ({
            ...prev,
            expenseID: generateExpenseID(),
        }));
    }
}, [initialData]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).filter((newFile) => 
        !expense.files.some((existingFile) => existingFile.name === newFile.name)
    );
    setExpense((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles],
    }));
};


const handleRemoveFile = (index) => {
  setExpense((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
  }));
};



  const validateForm = () => {
    let newErrors = {};
    if (!expense.amount || isNaN(expense.amount)) {
      newErrors.amount = 'Amount is required and must be a number';
    }
    if (!expense.paidTo) {
      newErrors.paidTo = 'Paid To is required';
    }
    if (!expense.status) {
      newErrors.status = 'Status is required';
    }
    if (!expense.category) {
      newErrors.category = 'Category is required';
    }
    if (!expense.currencyType) {
      newErrors.currencyType = 'Currency is required';
    }
    if (!expense.files.length) {
      newErrors.files = 'At least one file is required';
    }
    if (!expense.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }  
   if (!expense.name) {
    newErrors.name = 'Expense Name is required';
    }
   if (!expense.paymentDate) {
    newErrors.paymentDate = 'Payment Date is required';
   }
  if (!expense.dueDate) {
    newErrors.dueDate = 'Due Date is required';
  }
  if (expense.dueDate && expense.paymentDate && new Date(expense.dueDate) < new Date(expense.paymentDate)) {
    newErrors.dueDate = 'Due Date cannot be earlier than Payment Date';
}
if (!expense.expenseType) {
  newErrors.expenseType = 'Expense Type is required';
}
if (!expense.taxInfo) {
  newErrors.taxInfo = 'Tax Information is required';
}
// Only require Transaction ID if Payment Method is not "Cash"
if (expense.paymentMethod !== "Cash" && !expense.transactionID) {
  newErrors.transactionID = 'Payment Reference/Transaction ID is required';
}
setErrors(newErrors);
return Object.keys(newErrors).length === 0;
};


  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    const formData = new FormData();
    formData.append("expenseID", expense.expenseID);
    formData.append("name", expense.name);
    formData.append("amount", expense.amount);
    formData.append("category", expense.category);
    formData.append("paymentDate", expense.paymentDate);
    formData.append("description", expense.description);
    formData.append("paidTo", expense.paidTo);
    formData.append("paymentMethod", expense.paymentMethod);
    formData.append("status", expense.status);
    formData.append("vendorName", expense.vendorName);
    formData.append("currencyType", expense.currencyType);
    formData.append("dueDate", expense.dueDate);
    formData.append("expenseType", expense.expenseType);
    formData.append("taxInfo", expense.taxInfo);
    // Append transactionID only if applicable
    if(expense.paymentMethod !== "Cash") {
      formData.append("transactionID", expense.transactionID);
    }
    formData.append("notes", expense.notes);
  
    // Append files to FormData
    expense.files.forEach((file) => {
      formData.append("files", file);
    });
  
    // Send the form data to the backend
    fetch("http://localhost:5000/api/expenses", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Expense saved:", data);
        if (data.message === "Expense added successfully") {
          onSave(expense);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  
    // Reset the form
    setExpense({
      expenseID: generateExpenseID(),
      name: '',
      amount: '',
      category: '',
      paymentDate: '',
      description: '',
      paidTo: '',
      paymentMethod: '',
      status: '',
      files: [],
      vendorName: '',
      currencyType: 'USD',
      dueDate: '',
      expenseType: '',
      taxInfo: '',
      transactionID: '',
      notes: ''
    });
    onClose();
  };

  return (
    <Box sx={{ maxWidth: "700px", margin: "0 auto", padding: "16px" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Add New Expense
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Expense ID"
          name="expenseID"
          value={expense.expenseID}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          disabled
        />
        
        {/* Row 1: Expense Name and Payment Date */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Expense Name"
              name="name"
              value={expense.name}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              required
              error={Boolean(errors.name)}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Payment Date"
              name="paymentDate"
              type="date"
              value={expense.paymentDate || ""}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
              required
              error={Boolean(errors.paymentDate)}
              helperText={errors.paymentDate}
            />
          </Grid>
        </Grid>

        <TextField
          label="Description"
          name="description"
          value={expense.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        {/* Row 2: Amount and Paid To */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={expense.amount}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              required
              error={Boolean(errors.amount)}
              helperText={errors.amount}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Paid To"
              name="paidTo"
              value={expense.paidTo}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              required
              error={Boolean(errors.paidTo)}
              helperText={errors.paidTo}
            />
          </Grid>
        </Grid>

        <TextField
          label="Vendor Name"
          name="vendorName"
          value={expense.vendorName}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />

        {/* Payment Method */}
        <FormControl fullWidth sx={{ mb: 2 }} error={Boolean(errors.paymentMethod)}>
          <InputLabel>Payment Method</InputLabel>
          <Select
            name="paymentMethod"
            value={expense.paymentMethod}
            onChange={handleChange}
            required
          >
            {paymentMethods.map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </Select>
          {errors.paymentMethod && <FormHelperText>{errors.paymentMethod}</FormHelperText>}
        </FormControl>

        {/* Conditionally render Transaction ID field if Payment Method is not "Cash" */}
        {expense.paymentMethod !== "Cash" && (
          <TextField
            label="Payment Reference/Transaction ID"
            name="transactionID"
            value={expense.transactionID}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            required
            error={Boolean(errors.transactionID)}
            helperText={errors.transactionID}
          />
        )}

        {/* Currency */}
        <FormControl fullWidth sx={{ mb: 2 }} error={Boolean(errors.currencyType)}>
          <InputLabel>Currency</InputLabel>
          <Select
            name="currencyType"
            value={expense.currencyType || 'USD'}
            onChange={handleChange}
          >
            {currencies.map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </Select>
          {errors.currencyType && <FormHelperText>{errors.currencyType}</FormHelperText>}
        </FormControl>

        <FormControl component="fieldset" sx={{ mb: 2 }} error={Boolean(errors.status)}>
          <RadioGroup
            row
            name="status"
            value={expense.status}
            onChange={handleChange}
            required
          >
            <FormControlLabel value="Paid" control={<Radio />} label="Paid" />
            <FormControlLabel value="Pending" control={<Radio />} label="Pending" />
          </RadioGroup>
          {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }} error={Boolean(errors.category)}>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={expense.category}
            onChange={handleChange}
            required
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
          {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
        </FormControl>

        <TextField
          label="Due Date"
          name="dueDate"
          type="date"
          value={expense.dueDate}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
          error={Boolean(errors.dueDate)}
          helperText={errors.dueDate}
        />

        {/* New Expense Type */}
        {/* Expense Type */}
        <FormControl fullWidth sx={{ mb: 2 }} error={Boolean(errors.expenseType)}>
          <InputLabel>Expense Type</InputLabel>
          <Select
            name="expenseType"
            value={expense.expenseType}
            onChange={handleChange}
            required
          >
            {expenseTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
          {errors.expenseType && <FormHelperText>{errors.expenseType}</FormHelperText>}
        </FormControl>
        
        {/* New Tax Information */}
        <FormControl fullWidth sx={{ mb: 2 }} error={Boolean(errors.taxInfo)}>
          <InputLabel>Tax Information</InputLabel>
          <Select
            name="taxInfo"
            value={expense.taxInfo}
            onChange={handleChange}
            required
          >
            {taxInformationOptions.map((taxOption) => (
              <MenuItem key={taxOption} value={taxOption}>
                {taxOption}
              </MenuItem>
            ))}
          </Select>
          {errors.taxInfo && <FormHelperText>{errors.taxInfo}</FormHelperText>}
        </FormControl>
        
        {/* New Notes/Comments */}
        <TextField
          label="Notes/Comments"
          name="notes"
          value={expense.notes}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" component="label" sx={{ mb: 2 }}>
          Upload Attachments
          <input type="file" hidden multiple onChange={handleFileChange} /> {/* multiple attribute added */}
        </Button>
        {errors.files && (
          <FormHelperText error sx={{ mb: 2 }}>
            {errors.files}
          </FormHelperText>
        )}
        {expense.files.length > 0 && (
    <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2">Uploaded Files:</Typography>
        {expense.files.map((file, index) => (
           <Box key={index} display="flex" alignItems="center">
            <Typography variant="body2">{file.name}</Typography>
            <Button size="small" onClick={() => handleRemoveFile(index)}>Remove</Button>
            </Box>
        ))}
    </Box>
    )}

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ExpenseForm;