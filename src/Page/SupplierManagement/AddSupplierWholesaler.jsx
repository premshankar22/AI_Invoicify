import React, { useState, useEffect } from "react";
import { 
  Modal, Box, Typography, TextField, Button, IconButton,Chip , FormControl, MenuItem, InputLabel, OutlinedInput, Select
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import io from "socket.io-client";

// Available categories for selection
const categoriesList = [
    "Grocery",
    "Electronic",
    "Mobile",
    "Accessories",
    "Cloths",
    "Furniture",
    "Sports",
    "Home",
    "Kitchen"
  ];

const AddSupplierWholesaler = ({ open, handleClose }) => {
    const [supplierData, setSupplierData] = useState({
        name: "", supplier_id: "", company: "", phone: "", alt_phone: "",
        email: "", location: "", address: "", product_category: [],
        website: "", type: "", image: null, date_time: "", gst_number: "",
        notes: ""
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
  
     // Establish socket connection inside useEffect with cleanup
   useEffect(() => {
    const socket = io("http://localhost:5000");

    return () => {
      socket.disconnect();
    };
  }, []);


    // Generate a unique Supplier ID based on the selected type
  const generateSupplierId = (type) => {
    let prefix = "";
    if (type === "Supplier") {
      prefix = "SUP";
    } else if (type === "Wholesaler") {
      prefix = "WHO";
    } else {
      prefix = "SUP";
    }
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${randomNum}`;
  };

  const generateGSTNumber = () => `GST-${Math.floor(100000 + Math.random() * 900000)}-${Date.now()}`;


 // Auto-fill Date & Time when modal opens
 useEffect(() => {
  if (open) {
    setSupplierData((prevData) => ({
      ...prevData,
      date_time: new Date().toLocaleString(),
      gst_number: generateGSTNumber(),
      supplier_id: generateSupplierId(prevData.type || "Supplier"),
    }));
  }
}, [open]);


 // General change handler for text fields and select fields
 const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      // When Type is selected, automatically generate a new supplier ID.
      const newSupplierId = generateSupplierId(value);
      setSupplierData((prevData) => ({
        ...prevData,
        type: value,
        supplier_id: newSupplierId,
      }));
    } else {
      setSupplierData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handler for multiple category selection
  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    setSupplierData((prevData) => ({
      ...prevData,
      product_category: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  // Handler for image file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSupplierData((prevData) => ({
        ...prevData,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove the selected image and its preview
  const handleRemoveImage = () => {
    setSupplierData((prevData) => ({
      ...prevData,
      image: null,
    }));
    setImagePreview(null);
  };

  // Validation function
  const validateForm = () => {
    let newErrors = {};
  
    if (!supplierData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(supplierData.name)) {
      newErrors.name = "Only letters allowed.";
    }
  
    if (!supplierData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^(?:\d{10}|0\d{10})$/.test(supplierData.phone)) {
      newErrors.phone = "Phone number must be 10 digits or 11 digits starting with 0.";
    }
  
    if (!supplierData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplierData.email)) {
      newErrors.email = "Invalid email format.";
    }
  
    if (!supplierData.type) {
      newErrors.type = "Type selection is required.";
    }
  
    if (supplierData.product_category.length === 0) {
      newErrors.product_category = "At least one category must be selected.";
    }
  
    if (supplierData.alt_phone && !/^(?:\d{10}|0\d{10})$/.test(supplierData.alt_phone)) {
      newErrors.alt_phone = "Alternate phone number must be 10 digits or 11 digits starting with 0.";
    }
  
    console.log("Validation errors:", newErrors); // Log the errors to see which ones exist.
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


   // Submit handler (using fetch, no axios)
   const handleSubmit = async () => {
    console.log("handleSubmit triggered");
    if (!validateForm()) {
      console.log("Validation failed. Submission aborted.");
      return;
    }

    // Format date_time as "YYYY-MM-DD HH:MM:SS"
    const formattedDateTime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Prepare form data for multipart/form-data
    const formData = new FormData();
    formData.append("name", supplierData.name);
    formData.append("supplier_id", supplierData.supplier_id);
    formData.append("company", supplierData.company);
    formData.append("phone", supplierData.phone);
    formData.append("alt_phone", supplierData.alt_phone);
    formData.append("email", supplierData.email);
    formData.append("location", supplierData.location);
    formData.append("address", supplierData.address);
    // Send product_category as a JSON string
    formData.append(
      "product_category",
      JSON.stringify(supplierData.product_category)
    );
    formData.append("website", supplierData.website);
    formData.append("type", supplierData.type);
    formData.append("date_time", formattedDateTime);
    formData.append("gst_number", supplierData.gst_number);
    formData.append("notes", supplierData.notes);
    if (supplierData.image) {
      formData.append("image", supplierData.image);
    }

    console.log("Submitting form data:", supplierData);

    try {
      const response = await fetch(
        "http://localhost:5000/api/suppliers",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      if (response.ok) {
        console.log("Supplier added successfully:", result);
        // Optionally reset the form or close the modal here.
        handleClose();
      } else {
        console.error("Error submitting supplier:", result.error);
      }
    } catch (error) {
      console.error("Error while submitting the form:", error);
    }
  };


  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="add-supplier-wholesaler">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: "90vh",
          overflowY: "auto"
        }}
      >
        <IconButton
          sx={{ position: "absolute", right: 10, top: 10 }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" sx={{ mb: 2 }}>
        Add Supplier &amp; Wholesaler
        </Typography>
        
        {/* Type Field */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="type-label">Type</InputLabel>
          <Select
            labelId="type-label"
            name="type"
            value={supplierData.type}
            onChange={handleChange}
            label="Type"
          >
            <MenuItem value="Supplier">Supplier</MenuItem>
            <MenuItem value="Wholesaler">Wholesaler</MenuItem>
          </Select>
        </FormControl>
        {/* Date & Time Field (read-only) */}
        <TextField
          fullWidth
          label="Date & Time"
          name="date_time"
          value={supplierData.date_time}
          InputProps={{
            readOnly: true,
          }}
          sx={{ mb: 2 }}
        />
        <TextField 
          fullWidth
          label="Name"
          name="name"
          value={supplierData.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField 
          fullWidth
          label="Supplier ID"
          name="supplier_id"
          value={supplierData.supplier_id}
          onChange={handleChange}
          sx={{ mb: 2 }}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField 
          fullWidth
          label="Company"
          name="company"
          value={supplierData.company}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField 
          fullWidth
          label="Phone"
          name="phone"
          value={supplierData.phone}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField 
          fullWidth
          label="Email"
          name="email"
          value={supplierData.email}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField 
          fullWidth
          label="Location"
          name="location"
          value={supplierData.location}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField 
          fullWidth
          label="Address"
          name="address"
          value={supplierData.address}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField fullWidth label="GST Number" name="gst_number"
            value={supplierData.gst_number} onChange={handleChange} sx={{ mb: 2 }} />

         {/* Multiple Category Selection */}
         <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="product-category-label">Product Category</InputLabel>
          <Select
            labelId="product-category-label"
            multiple
            value={supplierData.product_category}
            onChange={handleCategoryChange}
            input={<OutlinedInput label="Product Category" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {categoriesList.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField 
          fullWidth
          label="Website"
          name="website"
          value={supplierData.website}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
         <TextField fullWidth label="Notes/Remarks" name="notes"
          value={supplierData.notes} onChange={handleChange} sx={{ mb: 2 }} multiline rows={3} />
        
        {/* Image Upload, Preview and Remove */}
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" component="label">
            Upload Image
            <input 
              type="file" 
              hidden 
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          {imagePreview && (
            <Box sx={{ mt: 2, position: "relative" }}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ width: "100%", maxHeight: "200px", objectFit: "contain" }} 
              />
              <Button 
                variant="contained" 
                color="error" 
                onClick={handleRemoveImage} 
                sx={{ mt: 1 }}
              >
                Remove Image
              </Button>
            </Box>
          )}
        </Box>

        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default AddSupplierWholesaler;
