// src/pages/HomePage.tsx
import React from "react";
import { Box, Typography, Button, Paper, Avatar, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import SpeedIcon from "@mui/icons-material/Speed";
import WaterDropIcon from "@mui/icons-material/WaterDrop";

const HomePage = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: "center" }}>
        <WaterDropIcon sx={{ fontSize: 60, color: "primary.main" }} />
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Bem-vindo ao HidroFlow
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
          Seu sistema inteligente de irrigação e monitoramento de plantas.
        </Typography>
        <Button
          component={Link}
          to={isAuthenticated ? "/dashboard" : "/login"}
          variant="contained"
          size="large"
        >
          {isAuthenticated ? "Acessar seu Dashboard" : "Comece a Usar"}
        </Button>
      </Paper>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        alignItems="stretch" // Para que os Papers tenham a mesma altura se possível
      >
        <Paper sx={{ p: 3, width: "100%", flexGrow: 1 }}>
          <WavingHandIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h5" gutterBottom>
            Fácil de Usar
          </Typography>
          <Typography>
            Com uma interface moderna e intuitiva, você pode cadastrar suas
            plantas e monitorar a saúde delas em tempo real sem complicações.
          </Typography>
        </Paper>
        <Paper sx={{ p: 3, width: "100%", flexGrow: 1 }}>
          <SpeedIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h5" gutterBottom>
            Monitoramento em Tempo Real
          </Typography>
          <Typography>
            Acompanhe a umidade do solo, nível de água do reservatório e o
            status da bomba de irrigação de qualquer lugar, a qualquer hora.
          </Typography>
        </Paper>
        <Paper sx={{ p: 3, width: "100%", flexGrow: 1 }}>
          <DeveloperModeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h5" gutterBottom>
            Tecnologia IoT
          </Typography>
          <Typography>
            Construído com ESP32 e comunicação MQTT, o HidroFlow une hardware e
            software para oferecer uma solução de automação robusta e confiável.
          </Typography>
        </Paper>
      </Stack>

      {/* Seção Sobre Nós */}
      <Paper elevation={0} sx={{ p: 4, mt: 5, backgroundColor: "grey.100" }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Sobre os Desenvolvedores
        </Typography>
        <Typography align="center" color="text.secondary" sx={{ mb: 4 }}>
          Somos apaixonados por tecnologia e inovação, aplicando nosso
          conhecimento para criar soluções que resolvem problemas do dia a dia.
        </Typography>
        <Stack
          spacing={4}
          justifyContent="center"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Stack
            alignItems="center"
            sx={{
              textAlign: "center",
              width: { xs: "80%", sm: "60%", md: "40%" }, // Ajustar conforme necessário
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                margin: "auto", // Ainda útil para centralizar o Avatar em si se o Stack pai não o fizer perfeitamente
                mb: 2,
                bgcolor: "primary.main",
              }}
            >
              DV
            </Avatar>
            <Typography variant="h6">Desenvolvedor</Typography>
            <Typography color="text.secondary">Líder Técnico</Typography>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default HomePage;
