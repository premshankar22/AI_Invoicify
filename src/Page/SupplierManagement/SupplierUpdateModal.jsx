// SupplierUpdateModal.jsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Rating,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SupplierUpdateModal = ({ open, supplier, handleCancel, handleSave }) => {
  // Local state for the update form; pre-populated with the supplier’s current details.
  const [updatedSupplier, setUpdatedSupplier] = useState(supplier);

  // When supplier prop changes, update the local state.
  useEffect(() => {
    setUpdatedSupplier(supplier);
  }, [supplier]);


   // Generic change handler for text and file inputs.
   const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setUpdatedSupplier((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      // Handle nested field updates (e.g. ratings.quality)
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        setUpdatedSupplier((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        }));
      } else {
        setUpdatedSupplier((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

 // updateSupplier: Sends a PUT request to update supplier details & rating.
 const updateSupplier = async (supplierData) => {
    if (!supplierData.supplier_id) {
      console.error("supplier_id is missing");
      return;
    }
  
    // Convert date_time to MySQL DATETIME format if needed.
    let dateTimeValue = supplierData.date_time;
    if (dateTimeValue && dateTimeValue.includes("T")) {
      dateTimeValue = dateTimeValue.replace("T", " ").substring(0, 19);
    }
  
    const formData = new FormData();
    formData.append("name", supplierData.name);
    formData.append("supplier_id", supplierData.supplier_id);
    formData.append("company", supplierData.company);
    formData.append("phone", supplierData.phone);
    formData.append("alt_phone", supplierData.alt_phone);
    formData.append("email", supplierData.email);
    formData.append("location", supplierData.location);
    formData.append("address", supplierData.address);
  
    if (Array.isArray(supplierData.product_category)) {
      formData.append("product_category", JSON.stringify(supplierData.product_category));
    } else {
      formData.append("product_category", supplierData.product_category);
    }
  
    formData.append("website", supplierData.website);
    formData.append("type", supplierData.type);
    formData.append("date_time", dateTimeValue); // Use converted date_time
    formData.append("gst_number", supplierData.gst_number);
    formData.append("notes", supplierData.notes);
  
    formData.append("status", supplierData.status);
    formData.append("quality", supplierData.ratings.quality);
    formData.append("delivery", supplierData.ratings.delivery);
    formData.append("satisfaction", supplierData.ratings.satisfaction);
  
    if (supplierData.image instanceof File) {
      formData.append("image", supplierData.image);
    } else if (supplierData.image) {
      formData.append("existingImage", supplierData.image);
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/suppliers/${supplierData.supplier_id}`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.error || "Unknown error during update");
      }
      const result = await response.json();
      console.log("Supplier updated successfully:", result);
      if (typeof handleSave === "function") handleSave(result);
    } catch (error) {
      console.error("Error during updateSupplier call:", error);
    }
  };
  
  // onSubmit handler that calls updateSupplier.
  const onSubmit = async (e) => {
    e.preventDefault();
  
    // Clone updatedSupplier so as not to mutate React state directly.
    const supplierData = { ...updatedSupplier };
  
    // Convert product_category from a comma-separated string to an array if needed.
    if (supplierData.product_category && typeof supplierData.product_category === "string") {
      supplierData.product_category = supplierData.product_category
        .split(",")
        .map((cat) => cat.trim());
    }
  
    // Ensure rating values are numbers.
    supplierData.ratings = {
      quality: Number(supplierData.ratings?.quality || 0),
      delivery: Number(supplierData.ratings?.delivery || 0),
      satisfaction: Number(supplierData.ratings?.satisfaction || 0),
    };
  
    // Call the updateSupplier function.
    await updateSupplier(supplierData);
  };
  
  if (!updatedSupplier) return null;

  return (
    <Modal open={open} onClose={handleCancel} aria-labelledby="update-supplier">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <IconButton
          sx={{ position: "absolute", right: 10, top: 10 }}
          onClick={handleCancel}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Update Supplier
        </Typography>
        <form onSubmit={onSubmit}>
          {/* Name */}
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={updatedSupplier.name || ""}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          {/* Supplier ID (read-only if desired) */}
          <TextField
            fullWidth
            label="Supplier ID"
            name="supplier_id"
            value={updatedSupplier.supplier_id || ""}
            onChange={handleChange}
            sx={{ mb: 2 }}
            // Uncomment the next line to make supplier_id read-only:
            // InputProps={{ readOnly: true }}
          />
          {/* Company */}
          <TextField
            fullWidth
            label="Company"
            name="company"
            value={updatedSupplier.company || ""}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          {/* Phone */}
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={updatedSupplier.phone || ""}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          {/* Alternate Phone */}
          <TextField
            fullWidth
            label="Alternate Phone"
            name="alt_phone"
            value={updatedSupplier.alt_phone || ""}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          {/* Email */}
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={updatedSupplier.email || ""}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          {/* Location */}
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={updatedSupplier.location || ""}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          {/* Address */}
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={updatedSupplier.address || ""}
            onChange={handleChange}
            sx={{ mb: 2 }}
            multiline
          />
          {/* Product Category (comma-separated) */}
          <TextField
            fullWidth
            label="Product Category (comma separated)"
            name="product_category"
            value={
              Array.isArray(updatedSupplier.product_category)
                ? updatedSupplier.product_category.join(", ")
                : updatedSupplier.product_category || ""
            }
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          {/* Website */}
          <TextField
            fullWidth
            label="Website"
            name="website"
            value={updatedSupplier.website || ""}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          {/* Type */}
          <TextField
            fullWidth
            label="Type"
            name="type"
            value={updatedSupplier.type || ""}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          {/* New Field: Status */}
          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={updatedSupplier.status || ""}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>

         {/* Ratings using Material-UI Rating component */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Quality Rating:
            </Typography>
            <Rating
              name="ratings.quality"
              value={
                updatedSupplier.ratings && updatedSupplier.ratings.quality
                  ? Number(updatedSupplier.ratings.quality)
                  : 0
              }
              onChange={(event, newValue) => {
                setUpdatedSupplier((prev) => ({
                  ...prev,
                  ratings: {
                    ...prev.ratings,
                    quality: newValue,
                  },
                }));
              }}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Delivery Rating:
            </Typography>
            <Rating
              name="ratings.delivery"
              value={
                updatedSupplier.ratings && updatedSupplier.ratings.delivery
                  ? Number(updatedSupplier.ratings.delivery)
                  : 0
              }
              onChange={(event, newValue) => {
                setUpdatedSupplier((prev) => ({
                  ...prev,
                  ratings: {
                    ...prev.ratings,
                    delivery: newValue,
                  },
                }));
              }}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Satisfaction Rating:
            </Typography>
            <Rating
              name="ratings.satisfaction"
              value={
                updatedSupplier.ratings && updatedSupplier.ratings.satisfaction
                  ? Number(updatedSupplier.ratings.satisfaction)
                  : 0
              }
              onChange={(event, newValue) => {
                setUpdatedSupplier((prev) => ({
                  ...prev,
                  ratings: {
                    ...prev.ratings,
                    satisfaction: newValue,
                  },
                }));
              }}
            />
          </Box>

          {/* Image */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Image:</Typography>
            {/* Show preview: if image is a File, create a preview URL, else assume it's a URL */}
            {updatedSupplier.image &&
              (typeof updatedSupplier.image === "object" ? (
                <img
                  src={URL.createObjectURL(updatedSupplier.image)}
                  alt="Preview"
                  style={{ width: "100%", maxHeight: "200px", objectFit: "contain", marginBottom: 10 }}
                />
              ) : (
                <img
                  src={updatedSupplier.image}
                  alt="Current"
                  style={{ width: "100%", maxHeight: "200px", objectFit: "contain", marginBottom: 10 }}
                />
              ))}
            <Button variant="outlined" component="label">
              Change Image
              <input type="file" name="image" hidden onChange={handleChange} />
            </Button>
          </Box>
          {/* Date Time */}
          <TextField
            fullWidth
            label="Date & Time"
            name="date_time"
            value={updatedSupplier.date_time || ""}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          {/* GST Number */}
          <TextField
            fullWidth
            label="GST Number"
            name="gst_number"
            value={updatedSupplier.gst_number || ""}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          {/* Notes */}
          <TextField
            fullWidth
            label="Notes/Remarks"
            name="notes"
            value={updatedSupplier.notes || ""}
            onChange={handleChange}
            sx={{ mb: 2 }}
            multiline
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button variant="outlined" onClick={handleCancel} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default SupplierUpdateModal;
