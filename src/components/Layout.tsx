// src/components/Layout.tsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-hot-toast";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Você foi desconectado com sucesso!");
    navigate("/");
    handleMenuClose(); // Fecha o menu após o logout
  };

  const handleDashboardNavigation = () => {
    navigate("/dashboard");
    handleMenuClose();
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" color="default" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar>
            <WaterDropIcon color="primary" sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
            >
              HidroFlow
            </Typography>

            {isMobile ? (
              <IconButton component={Link} to="/" color="inherit" aria-label="Home">
                <HomeIcon />
              </IconButton>
            ) : (
              <Button component={Link} to="/" color="inherit">
                Home
              </Button>
            )}

            {isAuthenticated && !isMobile && (
              <Button component={Link} to="/dashboard" color="inherit">
                Dashboard
              </Button>
            )}

            {isAuthenticated ? (
              <>
                {isMobile ? (
                  <>
                    <IconButton
                      color="inherit"
                      onClick={handleMenuOpen}
                      aria-label="Menu do Usuário"
                    >
                      <AccountCircleIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={openMenu}
                      onClose={handleMenuClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem disabled>Olá, {user?.name}</MenuItem>
                      <MenuItem onClick={handleDashboardNavigation}>
                        <DashboardIcon sx={{ mr: 1 }} /> Dashboard
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                        <LogoutIcon sx={{ mr: 1 }} /> Sair
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Typography sx={{ mx: 2 }}>Olá, {user?.name}</Typography>
                    <Button variant="outlined" onClick={handleLogout}>
                      Sair
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                {isMobile ? (
                  <IconButton
                    component={Link}
                    to="/login"
                    color="inherit"
                    aria-label="Login"
                  >
                    <LoginIcon />
                  </IconButton>
                ) : (
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    color="primary"
                  >
                    Login / Registrar
                  </Button>
                )}
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Container
        component="main"
        maxWidth="lg"
        sx={{ flexGrow: 1, mt: 4, mb: 4 }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
