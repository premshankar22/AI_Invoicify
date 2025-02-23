import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { AccessTime, WbSunny } from "@mui/icons-material";

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({ temperature: "--°C", condition: "Loading..." });

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weather data using WeatherStack
  useEffect(() => {
    // Replace 'YOUR_VALID_API_KEY' with a valid API key from WeatherStack
    fetch("http://api.weatherstack.com/current?access_key=741497884d9f4b35a02173930252002=India")
      .then((res) => res.json())
      .then((data) => {
        // Check if data is valid
        if (!data || data.error || !data.current) {
          throw new Error(data && data.error && data.error.info ? data.error.info : "No weather data available");
        }
        setWeather({
          temperature: `${data.current.temp_c}°C`,
          condition: data.current.condition.text,
        });
      })
      .catch((err) => {
        console.error("Weather API error:", err);
        setWeather({ temperature: "N/A", condition: "Unavailable" });
      });
  }, []);

  // Format time and date
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  }).format(currentTime);

  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(currentTime);

  return (
    <Box
      sx={{
        height: "10vh",
        width: "100%",
        bgcolor: "#1565c0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        position: "relative",
      }}
    >
      {/* Title - Perfectly Centered */}
      <Typography
        variant="h5"
        fontWeight="bold"
        color="white"
        sx={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        AI-Invoicify
      </Typography>

      {/* Widgets - Positioned on the Right */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", marginLeft: "auto" }}>
        {/* Time Widget */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <IconButton sx={{ color: "white", padding: 0 }}>
            <AccessTime />
          </IconButton>
          <Typography variant="body1" sx={{ color: "white" }}>
            {time}
          </Typography>
        </Box>

        {/* Date Widget */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="body2" sx={{ color: "white" }}>
            {date}
          </Typography>
        </Box>

        {/* Weather Widget */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <IconButton sx={{ color: "white", padding: 0 }}>
            <WbSunny />
          </IconButton>
          <Typography variant="body1" sx={{ color: "white" }}>
            {`${weather.temperature} - ${weather.condition}`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
