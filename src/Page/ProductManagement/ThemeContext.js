import React, { createContext, useState, useMemo, } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export const ThemeContext = createContext();

const ThemeProviderComponent = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Define Material-UI theme styles
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: darkMode ? "#64b5f6" : "#1976d2", // Light Blue for Dark Mode
          },
          background: {
            default: darkMode ? "#1A1D2A" : "#f5f5f5", // Professional Dark Navy Blue
            paper: darkMode ? "#252836" : "#ffffff", // Dark Grayish Blue for Cards
          },
          text: {
            primary: darkMode ? "#E3E3E3" : "#000000", // Soft White Text for Dark Mode
            secondary: darkMode ? "#B0BEC5" : "#555555", // Light Gray for Muted Text
          },
        },
        typography: {
          fontFamily: "'Poppins', sans-serif",
          body1: {
            color: darkMode ? "#B0BEC5" : "#4f4f4f",
          },
        },
      }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProviderComponent;
