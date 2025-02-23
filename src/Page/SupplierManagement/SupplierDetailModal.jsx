import React, {useState,  useEffect} from "react";
import { Modal, Box, Typography, List, ListItem, ListItemText, IconButton, Button} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OrderTable from "./OrderTable";
import SupplierUpdateModal from "./SupplierUpdateModal";

const SupplierDetailModal = ({ open, handleClose, supplier,  handleUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);


  useEffect(() => {
    if (supplier && supplier.supplier_id) {
      console.log("Fetching orders for Supplier ID:", supplier.supplier_id); // Debugging
      fetchOrderHistory(supplier.supplier_id);
    }
  }, [supplier]);  
  
  
  const fetchOrderHistory = async (supplierID) => {
    try {
      console.log("Fetching orders for Supplier ID:", supplierID); // Debugging
  
      const response = await fetch(`http://localhost:5000/api/orders/${supplierID}`);
  
      console.log("Response Status:", response.status); // Debugging
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Fetched Order Data:", data); // Debugging
  
      setOrderHistory(data);
    } catch (error) {
      console.error("Error fetching order history:", error);
      setOrderHistory([]);
    }
  };

  
   // Helper to extract the filename from the stored path
   const getFileName = (pathStr) => {
    return pathStr.split(/[\\/]/).pop();
  };

   // When Update is clicked, switch to edit mode.
   const handleUpdateClick = () => {
    setIsEditing(true);
  };

  // Called when update is cancelled (switch back to details view).
  const handleCancelUpdate = () => {
    setIsEditing(false);
  };

  // Called when the update form is saved.
  const handleSaveUpdate = (updatedSupplier) => {
    if (handleUpdate) {
      handleUpdate(updatedSupplier);
    }
    setIsEditing(false);
  };

  if (!supplier) return null;

  return (
    <>

  {isEditing ? (
        <SupplierUpdateModal
          open={open}
          supplier={supplier}
          handleCancel={handleCancelUpdate}
          handleSave={handleSaveUpdate}
        />
      ) : (
    <Modal open={open} onClose={handleClose} aria-labelledby="supplier-details">
      <Box sx={{
       position: "absolute",
       top: "50%",
       left: "50%",
       transform: "translate(-50%, -50%)",
       width: 600, // increased width
       maxHeight: "90vh", // allow the modal to grow and scroll if needed
       bgcolor: "background.paper",
       boxShadow: 24,
       p: 4,
       borderRadius: 2,
       overflowY: "auto"
      }}>
        <IconButton
          sx={{ position: "absolute", right: 10, top: 10 }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          {supplier.name} ({supplier.product_category})
        </Typography>

        <img
              src={
                supplier.image
                  ? `http://localhost:5000/images/${getFileName(supplier.image)}`
                  : 'http://localhost:5000/images/default.jpg'
              }
              alt={supplier.name}
              style={{  width: "300px",      // Set the desired width
                height: "200px",     // Set the desired height
                objectFit: "cover",  // Ensures the image covers the space without distortion
                borderRadius: 8,
                marginBottom: 10, }}
            />

        <List>
          <ListItem><ListItemText primary={`🆔 ID: ${supplier.supplier_id}`} /></ListItem>
          <ListItem><ListItemText primary={`🏢 Company: ${supplier.company}`} /></ListItem>
          <ListItem><ListItemText primary={`📞 Phone: ${supplier.phone}`} /></ListItem>
          <ListItem><ListItemText primary={`✉️ Email: ${supplier.email}`} /></ListItem>
          <ListItem><ListItemText primary={`🌍 Location: ${supplier.location}`} /></ListItem>
          <ListItem><ListItemText primary={`📍 Address: ${supplier.address}`} /></ListItem>
          <ListItem>
            <ListItemText
              primary={`📊 Status: `}
              secondary={
                <strong style={{ color: supplier.status === "Active" ? "green" : "red" }}>
                  {supplier.status}
                </strong>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText primary={`🏷️ Type: ${supplier.type}`} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={`⭐ Ratings`}
              secondary={`Quality: ${supplier.ratings.quality}, Delivery: ${supplier.ratings.delivery}, Satisfaction: ${supplier.ratings.satisfaction}`}
            />
          </ListItem>
          <ListItem><ListItemText primary={`🔄 Transactions: ${supplier.transactions}`} /></ListItem>
          <ListItem>
            <ListItemText
              primary="🔗 Website:"
              secondary={
                <a href={supplier.website} target="_blank" rel="noopener noreferrer">
                  {supplier.website}
                </a>
              }
            />
          </ListItem>
        </List>

         {/* Always render the OrderTable so it shows the "No Orders Found" message if empty */}
        <Box sx={{ height: '100%', overflow: 'auto' }}>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Order History
          </Typography>
          <OrderTable orders={orderHistory} />
        </Box>
        {/* Update Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleUpdateClick}>
                Update
              </Button>
        </Box>
      </Box>
    </Modal>
     )}
    </>
  );
};

export default SupplierDetailModal;
