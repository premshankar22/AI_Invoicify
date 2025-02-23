import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AuthForm = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [formValues, setFormValues] = useState({
    empId: "",
    name: "",
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
    image: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormValues((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "login" ? "register" : "login"));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "register") {
      // Registration validation
      const { empId, name, username, phone, password, confirmPassword, image } = formValues;
      if (!empId || !name || !username || !phone || !password || !confirmPassword || !image) {
        setError("All fields are required for registration");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
  
      // Create FormData and call the registration API
      const formData = new FormData();
      formData.append("empId", empId);
      formData.append("name", name);
      formData.append("username", username);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
      formData.append("image", image);
  
      fetch("http://localhost:5000/api/register", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            onAuthSuccess({
              name,
              username,
              image: URL.createObjectURL(image),
            });
          }
        })
        .catch((err) => {
          console.error(err);
          setError("Registration failed");
        });
    } else {
      // Login mode: validate that both fields are provided.
      if (!formValues.username || !formValues.password) {
        setError("Username/EMP ID and Password are required");
        return;
      }
  
      // Fetch login data from the server.
      fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Use the same field for both Username or EMP ID.
          identifier: formValues.username,
          password: formValues.password,
        }),
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          // Store the employee ID in localStorage
          localStorage.setItem("empId", data.user.empId);
          // Pass the returned user data to the parent component.
          onAuthSuccess(data.user);
        }
      })
        .catch((err) => {
          console.error(err);
          setError("Login failed");
        });
    }
  };
  
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
        {mode === "login" ? "Login" : "Register"}
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <>
            <TextField
              label="Employee ID"
              name="empId"
              fullWidth
              margin="normal"
              value={formValues.empId}
              onChange={handleChange}
            />
            <TextField
              label="Name"
              name="name"
              fullWidth
              margin="normal"
              value={formValues.name}
              onChange={handleChange}
            />
          </>
        )}
        <TextField
          label="Username"
          name="username"
          fullWidth
          margin="normal"
          value={formValues.username}
          onChange={handleChange}
        />
        {mode === "register" && (
          <TextField
            label="Phone Number"
            name="phone"
            fullWidth
            margin="normal"
            value={formValues.phone}
            onChange={handleChange}
          />
        )}
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel htmlFor="password">
            {mode === "login" ? "Password" : "Create Password"}
          </InputLabel>
          <OutlinedInput
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formValues.password}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label={mode === "login" ? "Password" : "Create Password"}
          />
        </FormControl>
        {mode === "register" && (
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
            <OutlinedInput
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formValues.confirmPassword}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm Password"
            />
          </FormControl>
        )}
        {mode === "register" && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Upload Profile Image</Typography>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              style={{ marginTop: "8px" }}
            />
          </Box>
        )}
        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 3 }}>
          {mode === "login" ? "Login" : "Register"}
        </Button>
      </form>
      <Button onClick={toggleMode} fullWidth sx={{ mt: 2 }}>
        {mode === "login" ? "Don't have an account? Register" : "Already have an account? Login"}
      </Button>
    </Box>
  );
};

export default AuthForm;
