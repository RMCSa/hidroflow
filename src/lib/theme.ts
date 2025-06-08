// src/lib/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#007bff",
    },
    secondary: {
      main: "#6c757d",
    },
    success: {
      main: "#28a745",
    },
    error: {
      main: "#dc3545",
    },
    warning: {
      main: "#ffc107",
    },
    info: {
      main: "#17a2b8",
    },
    background: {
      default: "#f0f2f5",
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
