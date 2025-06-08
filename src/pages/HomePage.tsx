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

  const desenvolvedores = [
    { name: "Caio Damaceno", role: "Líder Técnico", avatar: "DV1" },
    { name: "Guilherme Rodrigues", role: "Líder Técnico", avatar: "DV2" },
    {
      name: "Rafael Moreira ",
      role: "Líder Técnico",
      avatar: "https://avatars.githubusercontent.com/u/125597354?v=4",
    },
    { name: "Victor Maritan", role: "Líder Técnico", avatar: "DV4" },
    { name: "Vitor Henrique ", role: "Líder Técnico", avatar: "DV5" },
  ];

  const featureCardStyles = (theme: any) => ({ // Adicionado theme para acesso
    p: 3,
    width: "100%",
    flexGrow: 1,
    borderLeft: 5,
    borderColor: "secondary.main", // Usando azul profundo para features
    boxShadow: `${theme.shadows[2]}, 0px 3px 8px rgba(25, 118, 210, 0.1)`, // Sombra azulada sutil
    transition: "box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out",
    "&:hover": {
      boxShadow: `${theme.shadows[6]}, 0px 6px 15px rgba(25, 118, 210, 0.2)`, // Sombra intensificada
      transform: "translateY(-4px)",
    },
    display: "flex", // Para alinhar ícone e texto verticalmente se necessário
    flexDirection: "column", // Conteúdo do card em coluna
  });

  return (
    <Box>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          textAlign: "center",
          borderRadius: (theme) => theme.shape.borderRadius, // Alinhar com o tema
          overflow: "hidden", // Para gradientes ou imagens de fundo no futuro
        }}
      >
        <WaterDropIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ 
            fontWeight: "bold",
            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' } // Fonte responsiva
          }}
        >
          Bem-vindo ao HidroFlow
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          sx={{ 
            mb: 3,
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' } // Fonte responsiva
          }}
        >
          Seu sistema inteligente de irrigação e monitoramento de plantas.
        </Typography>
        <Button
          component={Link}
          to={isAuthenticated ? "/dashboard" : "/login"}
          variant="contained"
          color="primary" // Mantendo primário para o botão principal da home
          size="large"
          sx={{ py: 1.5, px: 4, fontSize: "1.1rem" }}
        >
          {isAuthenticated ? "Acessar seu Dashboard" : "Comece a Usar"}
        </Button>
      </Paper>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        alignItems="stretch" 
      >
        <Paper sx={featureCardStyles}>
          <WavingHandIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} /> {/* Cor alterada */}
          <Typography variant="h5" gutterBottom>
            Fácil de Usar
          </Typography>
          <Typography>
            Com uma interface moderna e intuitiva, você pode cadastrar suas
            plantas e monitorar a saúde delas em tempo real sem complicações.
          </Typography>
        </Paper>
        <Paper sx={featureCardStyles}>
          <SpeedIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} /> {/* Cor alterada */}
          <Typography variant="h5" gutterBottom>
            Monitoramento em Tempo Real
          </Typography>
          <Typography>
            Acompanhe a umidade do solo, nível de água do reservatório e o
            status da bomba de irrigação de qualquer lugar, a qualquer hora.
          </Typography>
        </Paper>
        <Paper sx={featureCardStyles}>
          <DeveloperModeIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} /> {/* Cor alterada */}
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
      <Paper elevation={0} sx={{ p: 4, mt: 5, backgroundColor: "background.default" /* Usar cor de fundo do tema */ }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
          Sobre os Desenvolvedores
        </Typography>
        <Typography align="center" color="text.secondary" sx={{ mb: 4 }}>
          Projeto desenvolvido por estudantes da FATEC - Indaiatuba, unindo
          conhecimento acadêmico e paixão por tecnologia para criar soluções
          inovadoras e práticas para o dia a dia.
        </Typography>
        <Stack
          spacing={4}
          justifyContent="center"
          alignItems="center"
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap", // Permitir quebra de linha em telas menores
            width: "100%",
          }}
        >
          {desenvolvedores.map((dev, index) => (
            <Stack
              key={index}
              alignItems="center"
              sx={{
                textAlign: "center",
                width: { xs: "80%", sm: "40%", md: "auto" }, // Ajuste para melhor distribuição
                p: 2, // Espaçamento interno
              }}
            >
              <Avatar
                src={dev.avatar}
                sx={{
                  width: 80,
                  height: 80,
                  margin: "auto", 
                  mb: 2,
                  bgcolor: "secondary.main", // Usar cor secundária para avatares
                }}
              />
              <Typography variant="h6">{dev.name}</Typography>
              <Typography color="text.secondary">{dev.role}</Typography>
            </Stack>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
};

export default HomePage;
