// src/pages/LoginPage.tsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email);
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "E-mail ou senha inválidos."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(name, email);
      toast.success("Cadastro realizado! Bem-vindo(a)!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível realizar o cadastro."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setEmail("");
    setName("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start", // Alinhar ao topo para melhor visualização com mt
        mt: { xs: 4, sm: 8 }, // Margem superior responsiva
        p: 2, // Padding para evitar que o Paper cole nas bordas em telas pequenas
      }}
    >
      <Paper 
        elevation={0} // Remover elevação padrão, usaremos boxShadow
        sx={(theme) => ({ 
          p: { xs: 3, sm: 4 }, 
          width: "100%", 
          maxWidth: 420, // Aumentar um pouco o maxWidth
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[3], // Sombra mais suave do tema
          border: `1px solid ${theme.palette.divider}`, // Borda sutil
        })}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          centered
          textColor="secondary" 
          indicatorColor="secondary" 
          sx={{ mb: 3 }}
        >
          <Tab label="Login" />
          <Tab label="Registrar" />
        </Tabs>
        {tabIndex === 0 && (
          <Box component="form" onSubmit={handleLogin} noValidate>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              align="center"
              sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}
            >
              Acessar sua Conta
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email-login"
              label="Endereço de E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary" 
              sx={{ mt: 3, mb: 2, py: 1.2 }}
              disabled={isLoading || !email}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
            </Button>
          </Box>
        )}
        {tabIndex === 1 && (
          <Box component="form" onSubmit={handleRegister} noValidate>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              align="center"
              sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}
            >
              Criar uma Conta
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name-register"
              label="Nome Completo"
              name="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email-register"
              label="Endereço de E-mail"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary" 
              sx={{ mt: 3, mb: 2, py: 1.2 }} 
              disabled={isLoading || !name || !email}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Registrar"}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default LoginPage;
