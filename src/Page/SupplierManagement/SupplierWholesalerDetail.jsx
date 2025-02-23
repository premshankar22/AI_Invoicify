import React, {useRef, useState, useEffect} from "react";
import { 
  Box, Typography, Card, CardContent, CardMedia, ListItemText, IconButton, MenuItem, FormControl, InputLabel, Select
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material"; 
import SupplierDetailModal from "./SupplierDetailModal";

const SupplierWholesalerDetail = ({ searchQuery, searchFilter }) => {
    const scrollRef = useRef(null);
    const [showButtons, setShowButtons] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [suppliers, setSuppliers] = useState([]);

     // New filter & sort state
  const [statusFilter, setStatusFilter] = useState(""); // "" means no filtering (all)
  const [ratingFilter, setRatingFilter] = useState(""); // "" or a threshold value (e.g., "4")
  const [dateAddedFilter, setDateAddedFilter] = useState(""); // "", "today", "thisWeek", "thisMonth"
  const [sortBy, setSortBy] = useState("name"); // Sorting: "name", "transactions", "rating", "dateAdded"

     // Fetch the suppliers data from the backend API.
     useEffect(() => {
      const fetchSuppliers = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/suppliers");
          if (!response.ok) {
            console.error("Error fetching suppliers");
            return;
          }
          const data = await response.json();
          // Transform each supplier to include a ratings object.
          const transformedData = data.map((supplier) => ({
            ...supplier,
            ratings: {
              quality: supplier.quality !== null && supplier.quality !== undefined ? supplier.quality : 0,
              delivery: supplier.delivery !== null && supplier.delivery !== undefined ? supplier.delivery : 0,
              satisfaction: supplier.satisfaction !== null && supplier.satisfaction !== undefined ? supplier.satisfaction : 0,
            },
          }));
          setSuppliers(transformedData);
        } catch (error) {
          console.error("Error fetching suppliers:", error);
        }
      };
    
      fetchSuppliers();
    }, []);

    useEffect(() => {
      console.log("Fetched suppliers:", suppliers);
    }, [suppliers]);

    
    useEffect(() => {
      if (scrollRef.current) {
        setShowButtons(scrollRef.current.scrollWidth > scrollRef.current.clientWidth);
      }
    }, [suppliers]);


    // Optional: Update on window resize.
  useEffect(() => {
    const handleResize = () => {
      if (scrollRef.current) {
        setShowButtons(scrollRef.current.scrollWidth > scrollRef.current.clientWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  const handleCardClick = (supplier) => {
    setSelectedSupplier(supplier);
    setOpenModal(true);
  };

     // Combined filtering logic:
  const filteredSuppliers = suppliers.filter((supplier) => {
    // 1. Basic search filtering (if searchQuery is provided)
    let lowerQuery = searchQuery ? searchQuery.toLowerCase() : "";
    const productCategoryString = Array.isArray(supplier.product_category)
      ? supplier.product_category.join(" ")
      : supplier.product_category;
    let matchesSearch = true;
    if (searchQuery) {
      switch (searchFilter) {
        case "id":
          matchesSearch = supplier.supplier_id.toLowerCase().includes(lowerQuery);
          break;
        case "name":
          matchesSearch = supplier.name.toLowerCase().includes(lowerQuery);
          break;
        case "category":
          matchesSearch = productCategoryString.toLowerCase().includes(lowerQuery);
          break;
        case "type":
          matchesSearch = supplier.type.toLowerCase().includes(lowerQuery);
          break;
        default:
          matchesSearch =
            supplier.supplier_id.toLowerCase().includes(lowerQuery) ||
            supplier.name.toLowerCase().includes(lowerQuery) ||
            productCategoryString.toLowerCase().includes(lowerQuery) ||
            supplier.type.toLowerCase().includes(lowerQuery);
      }
    }

    // 2. Status Filter
    const matchesStatus = statusFilter ? supplier.status === statusFilter : true;

    // 3. Rating Filter: Compute average rating.
    let matchesRating = true;
    if (ratingFilter) {
      const avgRating =
        (supplier.ratings.quality +
          supplier.ratings.delivery +
          supplier.ratings.satisfaction) /
        3;
      matchesRating = avgRating >= parseFloat(ratingFilter);
    }

    // 4. Date Added Filter: Assumes supplier.date_time exists.
    let matchesDate = true;
    if (dateAddedFilter && supplier.date_time) {
      const addedDate = new Date(supplier.date_time);
      const now = new Date();
      if (dateAddedFilter === "today") {
        matchesDate = addedDate.toDateString() === now.toDateString();
      } else if (dateAddedFilter === "thisWeek") {
        const firstDayOfWeek = new Date(now);
        firstDayOfWeek.setDate(now.getDate() - now.getDay());
        matchesDate = addedDate >= firstDayOfWeek;
      } else if (dateAddedFilter === "thisMonth") {
        matchesDate =
          addedDate.getMonth() === now.getMonth() &&
          addedDate.getFullYear() === now.getFullYear();
      }
    }

    return matchesSearch && matchesStatus && matchesRating && matchesDate;
  });

  // Sorting options
  const sortedSuppliers = filteredSuppliers.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "transactions":
        return (b.transactions || 0) - (a.transactions || 0);
      case "rating":
        const aRating =
          (a.ratings.quality + a.ratings.delivery + a.ratings.satisfaction) / 3;
        const bRating =
          (b.ratings.quality + b.ratings.delivery + b.ratings.satisfaction) / 3;
        return bRating - aRating;
      case "dateAdded":
        // Using supplier.date_time (ensure it's a valid date string)
        return new Date(b.date_time) - new Date(a.date_time);
      default:
        return 0;
    }
  });

    

    // Get only the filename from the stored path
   const getFileName = (pathStr) => {
  return pathStr.split(/[\\/]/).pop();
  };


  return (
    <Box sx={{ marginTop: 3, position: "relative" }}>
      <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold" }}>
        📌 Supplier & Wholesaler
      </Typography>


       {/* Filter and Sort Controls */}
<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
    flexWrap: "wrap",
    padding: 2,
    backgroundColor: "#f7f7f7", // light background for contrast
    borderRadius: 2,
    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)"
  }}
>
  {/* Status Filter */}
  <FormControl size="medium" sx={{ minWidth: 200 }}>
    <InputLabel>Status</InputLabel>
    <Select
      value={statusFilter}
      label="Status"
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <MenuItem value="">All</MenuItem>
      <MenuItem value="Active">Active</MenuItem>
      <MenuItem value="Inactive">Inactive</MenuItem>
    </Select>
  </FormControl>

  {/* Minimum Rating Filter */}
  <FormControl size="medium" sx={{ minWidth: 200 }}>
    <InputLabel>Min Rating</InputLabel>
    <Select
      value={ratingFilter}
      label="Min Rating"
      onChange={(e) => setRatingFilter(e.target.value)}
    >
      <MenuItem value="">All</MenuItem>
      <MenuItem value="4">4+</MenuItem>
      <MenuItem value="3">3+</MenuItem>
      <MenuItem value="2">2+</MenuItem>
    </Select>
  </FormControl>

  {/* Date Added Filter */}
  <FormControl size="medium" sx={{ minWidth: 200 }}>
    <InputLabel>Date Added</InputLabel>
    <Select
      value={dateAddedFilter}
      label="Date Added"
      onChange={(e) => setDateAddedFilter(e.target.value)}
    >
      <MenuItem value="">All</MenuItem>
      <MenuItem value="today">Today</MenuItem>
      <MenuItem value="thisWeek">This Week</MenuItem>
      <MenuItem value="thisMonth">This Month</MenuItem>
    </Select>
  </FormControl>

  {/* Sorting Options */}
  <FormControl size="medium" sx={{ minWidth: 200 }}>
    <InputLabel>Sort By</InputLabel>
    <Select
      value={sortBy}
      label="Sort By"
      onChange={(e) => setSortBy(e.target.value)}
    >
      <MenuItem value="name">Name</MenuItem>
      <MenuItem value="transactions">Transactions</MenuItem>
      <MenuItem value="rating">Rating</MenuItem>
      <MenuItem value="dateAdded">Date Added</MenuItem>
    </Select>
  </FormControl>
</Box>


       {/* Left Scroll Button */}
       {showButtons && (
        <IconButton 
          onClick={scrollLeft} 
          sx={{
            position: "absolute", 
            left: 0, 
            top: "50%", 
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "#f5f5f5",
            "&:hover": { backgroundColor: "#ddd" },
            marginLeft: "10px"
          }}
        >
          <ChevronLeft fontSize="large" />
        </IconButton>
      )}

      {/* Flexbox container to display cards in a row */}
      <Box  ref={scrollRef} 
        sx={{ 
          display: "flex", 
          gap: 3, 
          overflowX: "auto", 
          paddingBottom: 2,
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}>

        {sortedSuppliers.map((supplier) => (
          <Card
            key={supplier.supplier_id}
            sx={{
              minWidth: 300, 
              maxWidth: 380,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: 2,
              padding: 2,
              display: "flex",
              flexDirection: "column",
            }}
            onClick={() => handleCardClick(supplier)}
          >
            {/* Supplier Image */}
            <CardMedia
              component="img"
              height="150"
              image={
                supplier.image
                  ? `http://localhost:5000/images/${getFileName(supplier.image)}`
                  : 'http://localhost:5000/images/default.jpg'
              }
              alt={supplier.name}
              sx={{ objectFit: "cover", borderRadius: "8px" }}
            />

            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {supplier.name} ({supplier.product_category})
              </Typography>
              
              <ListItemText
                secondary={
                  <>
                    🏢 Company: {supplier.company} <br />
                    📞 Phone: {supplier.phone} <br />
                    ✉️ Email: {supplier.email} <br />
                    🔗 Website: <a href={supplier.website} target="_blank" rel="noopener noreferrer">{supplier.website}</a> <br />
                   📊 Status: <strong style={{ color: supplier.status === "Active" ? "green" : "red" }}>{supplier.status}</strong> <br />
                  </>
                }
              />
            </CardContent>
          </Card>
        ))}
      </Box>

       {/* Right Scroll Button */}
       {showButtons && (
        <IconButton 
          onClick={scrollRight} 
          sx={{
            position: "absolute", 
            right: 0, 
            top: "50%", 
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "#f5f5f5",
            "&:hover": { backgroundColor: "#ddd" },
            marginRight: "10px"
          }}
        >
          <ChevronRight fontSize="large" />
        </IconButton>
      )}

       <SupplierDetailModal open={openModal} handleClose={() => setOpenModal(false)} supplier={selectedSupplier} />
    </Box>
  );
};

export default SupplierWholesalerDetail;