import React, { useState, useEffect,  useMemo } from 'react';
import { TextField, InputAdornment, Box, MenuItem, Select, FormControl, InputLabel, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash.debounce';

const SearchBar = ({ onSearch }) => {
    const [searchType, setSearchType] = useState("Product ID");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

     // Create a stable debounced function using useMemo
  const debouncedSearch = useMemo(() => 
    debounce((query, type) => {
      setLoading(true);
      onSearch(query, type);
      // Simulate a delay for loading state
      setTimeout(() => setLoading(false), 500);
    }, 500),
    [onSearch]
  );

  useEffect(() => {
    // Always trigger the search (even if searchQuery is empty) to fetch "all" data.
    debouncedSearch(searchQuery, searchType);
    // Cleanup: cancel any pending debounced calls on unmount or dependency change.
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, searchType, debouncedSearch]);


    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: '20px', maxWidth: '900px', mx: 'auto' }}>
            
            {/* Search Filter Dropdown */}
            <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Search By</InputLabel>
                <Select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    variant="outlined"
                >
                    <MenuItem value="Product ID">Product ID</MenuItem>
                    <MenuItem value="Product Name">Product Name</MenuItem>
                    <MenuItem value="Brand">Brand</MenuItem>
                    <MenuItem value="Product Category">Product Category</MenuItem>
                    <MenuItem value="Supplier ID">Supplier ID</MenuItem>
                    <MenuItem value="Supplier Name">Supplier Name</MenuItem>
                    <MenuItem value="Expense ID">Expense ID</MenuItem>
                    <MenuItem value="Expense Category">Expense Category</MenuItem>
                    <MenuItem value="Invoice ID">Invoice ID</MenuItem>
                </Select>
            </FormControl>

            {/* Search Input */}
            <TextField
                variant="outlined"
                placeholder={`Search ${searchType}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '30px',
                        backgroundColor: '#ffffff',
                        '&:hover': { backgroundColor: '#f1f1f1' },
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    endAdornment: loading ? <CircularProgress size={20} /> : null,
                }}
            />
        </Box>
    );
};

export default SearchBar;
