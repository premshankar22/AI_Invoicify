/*import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();  */

import React from "react";
import ReactDOM from "react-dom/client"; // Use 'react-dom/client' for React 18
import App from "./App";
import reportWebVitals from './reportWebVitals';
import ThemeProviderComponent from "./Page/ProductManagement/ThemeContext"; // Import ThemeProvider
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProviderComponent>
      {/* Wrap App in LocalizationProvider */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <App />
      </LocalizationProvider>
    </ThemeProviderComponent>
  </React.StrictMode>
);

reportWebVitals();

