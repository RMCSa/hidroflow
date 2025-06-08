// src/pages/PlantPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  AlertTitle,
  Stack,
  Button,
  Divider,
  Skeleton,
} from "@mui/material";
import { useMqtt, MqttData } from "../hooks/useMqtt";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge"; // Componente visual

// Ícones
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WaterIcon from "@mui/icons-material/Water";
import GrassIcon from "@mui/icons-material/Grass";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import LanIcon from "@mui/icons-material/Lan";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { plantService } from "../services/plantService";
import { Plant } from "../types";

// Calibração (mesma do código original)
const MAX_HUMIDITY_RAW_VALUE = 4095;
const MAX_WATER_LEVEL_RAW_VALUE = 1125;

const PlantPage = () => {
  const { plantId } = useParams<{ plantId: string }>();
  const [plant, setPlant] = useState<Plant | undefined>(undefined);

  useEffect(() => {
    const fetchPlant = async () => {
      if (plantId) {
        const result = await plantService.getPlantById(plantId);
        setPlant(result);
      }
    };
    fetchPlant();
  }, [plantId]);

  const { mqttStatus, espStatus, lastData } = useMqtt(
    plant?.mqttTopicId || "default_topic"
  );

  const data: MqttData | null = useMemo(() => lastData, [lastData]);

  const isLoading = !data && espStatus !== "Offline";

  // Cálculos dos percentuais
  const waterLevelValue = data
    ? Math.min(
        100,
        Math.max(0, (data.water_level / MAX_WATER_LEVEL_RAW_VALUE) * 100)
      )
    : 0;
  const humidityValue = data
    ? Math.min(
        100,
        Math.max(0, 100 - (data.humidity / MAX_HUMIDITY_RAW_VALUE) * 100)
      )
    : 0;

  return (
    <Box>
      {/* Cabeçalho da Página */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        {plant ? (
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              {plant.name}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
              {plant.location}
            </Typography>
          </Box>
        ) : (
          <Box>
            <Skeleton variant="text" width={250} height={40} />
            <Skeleton variant="text" width={150} height={20} />
          </Box>
        )}
        <Button
          component={RouterLink}
          to="/dashboard"
          startIcon={<ArrowBackIcon />}
        >
          Dashboard
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Seção de Status de Conexão */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
        <Alert
          severity={
            mqttStatus === "Conectado"
              ? "success"
              : mqttStatus === "Conectando..."
              ? "info"
              : "error"
          }
          icon={<LanIcon />}
          sx={{ flex: 1 }}
        >
          <AlertTitle>Broker MQTT</AlertTitle>
          {mqttStatus}
        </Alert>
        <Alert
          severity={espStatus === "Online" ? "success" : "warning"}
          icon={espStatus === "Online" ? <WifiIcon /> : <WifiOffIcon />}
          sx={{ flex: 1 }}
        >
          <AlertTitle>Dispositivo (ESP32)</AlertTitle>
          {espStatus}
        </Alert>
      </Stack>

      {/* Seção de Medidores e Status da Bomba */}
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          alignItems="center"
          justifyContent="space-around"
        >
          {/* Medidor de Nível de Água */}
          <Stack alignItems="center" spacing={1}>
            {isLoading ? (
              <Skeleton variant="circular" width={160} height={160} />
            ) : (
              <Gauge
                width={160}
                height={160}
                value={waterLevelValue}
                startAngle={-110}
                endAngle={110}
                text={`${waterLevelValue.toFixed(0)}%`}
                sx={{
                  [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 30,
                    fontWeight: "bold",
                  },
                  [`& .${gaugeClasses.valueArc}`]: { fill: "#0288d1" },
                }}
              />
            )}
            <Typography
              variant="h6"
              component="div"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <WaterIcon /> Nível de Água
            </Typography>
          </Stack>

          {/* Medidor de Umidade do Solo */}
          <Stack alignItems="center" spacing={1}>
            {isLoading ? (
              <Skeleton variant="circular" width={160} height={160} />
            ) : (
              <Gauge
                width={160}
                height={160}
                value={humidityValue}
                startAngle={-110}
                endAngle={110}
                text={`${humidityValue.toFixed(0)}%`}
                sx={{
                  [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 30,
                    fontWeight: "bold",
                  },
                  [`& .${gaugeClasses.valueArc}`]: { fill: "#388e3c" },
                }}
              />
            )}
            <Typography
              variant="h6"
              component="div"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <GrassIcon /> Umidade do Solo
            </Typography>
            {!isLoading && (
              <Typography variant="body2" color="text.secondary">
                Estado: {data?.humidity_state}
              </Typography>
            )}
          </Stack>

          {/* Status da Bomba */}
          <Stack alignItems="center" spacing={2} sx={{ minWidth: 180 }}>
            <Typography variant="h6" component="div" color="text.secondary">
              Bomba d'Água
            </Typography>
            {isLoading ? (
              <>
                <Skeleton variant="circular" width={60} height={60} />
                <Skeleton variant="text" width={100} height={30} />
              </>
            ) : (
              <>
                <PowerSettingsNewIcon
                  sx={{
                    fontSize: 60,
                    color:
                      data?.pump_state === "Ativada"
                        ? "success.main"
                        : "error.main",
                  }}
                />
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color={
                    data?.pump_state === "Ativada"
                      ? "success.main"
                      : "error.main"
                  }
                >
                  {data?.pump_state}
                </Typography>
              </>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Fallback para quando não há dados */}
      {isLoading && (
        <Box sx={{ textAlign: "center", my: 5 }}>
          <CircularProgress />
          <Typography>
            Aguardando a primeira transmissão de dados do dispositivo...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PlantPage;
