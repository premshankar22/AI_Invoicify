import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar, Paper } from "@mui/material";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Retrieve empId from localStorage after login
  const empId = localStorage.getItem("empId");
  console.log("Fetching user with empId:", empId);
  useEffect(() => {
    const empId = localStorage.getItem("empId");
    console.log("Fetching user with empId:", empId);
    
    if (!empId || empId.trim() === "") {
      console.error("No valid employee ID found. Please login first.");
      setLoading(false);
      return;
    }
    
    fetch(`http://localhost:5000/api/user/${empId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`User not found (HTTP ${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err.message);
        setLoading(false);
      });
  }, []);
  
  

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e1e2f",
        }}
      >
        <Typography variant="h5" color="#fff">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!empId) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e1e2f",
        }}
      >
        <Typography variant="h5" color="#fff">
          No employee ID found. Please login first.
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e1e2f",
        }}
      >
        <Typography variant="h5" color="#fff">
          User not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #1e1e2f, #3a3a5d)",
        padding: "20px",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: "40px",
          borderRadius: "20px",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          width: "90%",
          maxWidth: "600px",
          color: "#fff",
          boxShadow: "0px 8px 20px rgba(0,0,0,0.3)",
        }}
      >
        {user && user.image ? (
         <img 
         src={`http://localhost:5000/${user.image}`} 
          alt="Profile" 
       style={{ width: "150px", height: "150px" }}
       />
        ) : (
          <p>No profile image available</p>
        )}
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
          {user.name || "John Doe"}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "1.2rem", opacity: 0.9 }}>
          <strong>EMP ID:</strong> {user.empId || "N/A"}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "1.2rem", opacity: 0.9 }}>
          <strong>Phone:</strong> {user.phone || "N/A"}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "1.2rem", opacity: 0.9 }}>
          <strong>Username:</strong> {user.username || "N/A"}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ProfilePage;

