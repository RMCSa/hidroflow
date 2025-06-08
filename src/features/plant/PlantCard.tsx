// src/features/plant/PlantCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DeleteIcon from "@mui/icons-material/Delete";
import SpaIcon from "@mui/icons-material/Spa"; // Ícone para planta
import CircleIcon from "@mui/icons-material/Circle"; // Para status online/offline
import { Plant } from "../../types";
import { useMqtt } from "../../hooks/useMqtt";

interface PlantCardProps {
  plant: Plant;
  onDelete: (plantId: string) => void;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, onDelete }) => {
  const { espStatus, lastData } = useMqtt(plant.mqttTopicId || plant.id); // Usa mqttTopicId ou id como fallback

  const getStatusColor = () => {
    if (espStatus === "Online") return "success.main";
    if (espStatus === "Offline") return "error.main";
    return "text.disabled"; // Cinza para "Aguardando Dados..."
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 6, // Aumenta a sombra no hover
          transform: "translateY(-4px)", // Leve elevação
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <SpaIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            {plant.name}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <LocationOnIcon sx={{ mr: 0.5, fontSize: "1rem", color: "text.secondary" }} />
          <Typography color="text.secondary" variant="body2">
            {plant.location}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1, mt: 2 }}>
          <CircleIcon sx={{ fontSize: "0.8rem", mr: 0.5, color: getStatusColor() }} />
          <Typography variant="caption" color="text.secondary">
            Dispositivo: {espStatus}
          </Typography>
        </Box>

        {lastData?.humidity_state && espStatus === "Online" && (
          <Chip
            label={`Umidade: ${lastData.humidity_state}`}
            size="small"
            variant="outlined"
            sx={{
              mb: 1,
              borderColor: lastData.humidity_state === "Seco" ? "warning.main" :
                           lastData.humidity_state === "Úmido" ? "info.main" :
                           "default",
              color: lastData.humidity_state === "Seco" ? "warning.main" :
                     lastData.humidity_state === "Úmido" ? "info.main" :
                     "default",
            }}
          />
        )}

        <Typography variant="body2" sx={{ mt: espStatus !== "Online" || !lastData?.humidity_state ? 2 : 0 }}>
          Clique para monitorar todos os dados desta planta.
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", pt: 0 }}>
        <Button size="small" component={Link} to={`/plant/${plant.id}`}>
          Monitorar
        </Button>
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(plant.id)}
          aria-label={`Remover planta ${plant.name}`}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default PlantCard;
