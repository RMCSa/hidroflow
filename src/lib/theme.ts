// src/lib/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#007bff",
    },
    secondary: {
      main: "#1976D2", // Azul Profundo
    },
    success: {
      main: "#4CAF50", 
    },
    error: {
      main: "#dc3545",
    },
    warning: {
      main: "#ffc107",
    },
    info: {
      main: "#673AB7", 
    },
    background: {
      default: "#F8F9FA",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: ["Open Sans", "Roboto", "sans-serif"].join(","),
    h1: {
      fontFamily: "Roboto, sans-serif",
      fontWeight: 700,
    },
    h4: {
      fontFamily: "Roboto, sans-serif",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
