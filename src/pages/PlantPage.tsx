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
  Chip,
} from "@mui/material";
import { useMqtt, MqttData } from "../hooks/useMqtt";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";

// Ícones
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WaterIcon from "@mui/icons-material/Water";
import GrassIcon from "@mui/icons-material/Grass";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import LanIcon from "@mui/icons-material/Lan";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BarChartIcon from "@mui/icons-material/BarChart";
import OpacityIcon from "@mui/icons-material/Opacity";
import NaturePeopleIcon from "@mui/icons-material/NaturePeople"; // Ícone corrigido
import EventRepeatIcon from "@mui/icons-material/EventRepeat";

import { plantService } from "../services/plantService";
import { Plant } from "../types";

// Calibração
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

  const mockMetrics = [
    {
      icon: <BarChartIcon color="secondary" />,
      label: "Média Umidade (7d)",
      value: "68%",
      chipColor: "info" as "info" | "success" | "warning" | "default",
    },
    {
      icon: <OpacityIcon color="secondary" />,
      label: "Irrigação (Mês)",
      value: "15.2 L",
      chipColor: "default" as "info" | "success" | "warning" | "default",
    },
    {
      icon: <NaturePeopleIcon color="secondary" />, // Ícone corrigido
      label: "Qualidade do Solo",
      value: "Boa",
      chipColor: "success" as "info" | "success" | "warning" | "default",
    },
    {
      icon: <EventRepeatIcon color="secondary" />,
      label: "Próx. Verificação",
      value: "2 dias",
      chipColor: "default" as "info" | "success" | "warning" | "default",
    },
  ];

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
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: "bold",
                color: "text.primary",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {plant.name}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
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
          variant="outlined"
          color="secondary"
        >
          Dashboard
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Seção de Status de Conexão */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <Alert
          variant="filled"
          severity={
            mqttStatus === "Conectado"
              ? "success"
              : mqttStatus === "Conectando..."
              ? "info"
              : "error"
          }
          iconMapping={{
            success: <LanIcon fontSize="inherit" />,
            info: <LanIcon fontSize="inherit" />,
            error: <LanIcon fontSize="inherit" />,
          }}
          sx={(theme) => ({
            flex: 1,
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[1],
            alignContent: "center",
            justifyContent: "center",
          })}
        >
          <AlertTitle>Broker MQTT</AlertTitle>
          {mqttStatus}
        </Alert>
        <Alert
          variant="filled"
          severity={espStatus === "Online" ? "success" : "warning"}
          iconMapping={{
            success: <WifiIcon fontSize="inherit" />,
            warning: <WifiOffIcon fontSize="inherit" />,
          }}
          sx={(theme) => ({
            flex: 1,
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[1],
            alignContent: "center",
            justifyContent: "center",
          })}
        >
          <AlertTitle>Dispositivo (ESP32)</AlertTitle>
          {espStatus}
        </Alert>
      </Stack>

      {/* Fallback para quando não há dados */}
      {isLoading && (
        <Box sx={{ textAlign: "center", my: 5 }}>
          <CircularProgress />
          <Typography>
            Aguardando a primeira transmissão de dados do dispositivo...
          </Typography>
        </Box>
      )}

      {/* Seção de Medidores e Status da Bomba */}
      <Paper
        variant="outlined"
        sx={(theme) => ({
          p: { xs: 2, sm: 3 },
          borderRadius: theme.shape.borderRadius,
          mb: 4,
        })}
      >
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
                sx={(theme) => ({
                  [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 30,
                    fontWeight: "bold",
                  },
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: theme.palette.info.main,
                  },
                })}
              />
            )}
            <Typography
              variant="h6"
              component="div"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <WaterIcon sx={{ color: "info.main" }} /> Nível de Água
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
                sx={(theme) => ({
                  [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 30,
                    fontWeight: "bold",
                  },
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: theme.palette.success.main,
                  },
                })}
              />
            )}
            <Typography
              variant="h6"
              component="div"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <GrassIcon sx={{ color: "success.main" }} /> Umidade do Solo
            </Typography>
            {!isLoading && (
              <Typography variant="body2" color="text.secondary">
                Estado: {data?.humidity_state}
              </Typography>
            )}
          </Stack>

          {/* Status da Bomba */}
          <Stack alignItems="center" spacing={2} sx={{ minWidth: 180 }}>
            <Typography
              variant="h6"
              component="div"
              color="text.primary"
              fontWeight="bold"
            >
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

      {/* Seção de Métricas Adicionais */}
      <Paper
        variant="outlined"
        sx={(theme) => ({
          p: { xs: 2, sm: 3 },
          borderRadius: theme.shape.borderRadius,
          mb: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        })}
      >
        <Typography
          variant="h6"
          component="div"
          fontWeight="bold"
          sx={{ mb: 2.5 }}
        >
          Simulação de Métricas Adicionais
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          useFlexGap
          flexWrap="wrap"
          justifyContent="flex-start"
          width={"100%"}
          flex={1}
        >
          {mockMetrics.map((metric, index) => (
            <Paper
              key={index}
              variant="elevation"
              elevation={2}
              sx={(theme) => ({
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                borderRadius: theme.shape.borderRadius,
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: {
                  xs: "calc(100% - 0px)",
                  sm: `calc(50% - ${theme.spacing(1)})`,
                  md: `calc(25% - ${theme.spacing(1.5)})`,
                },
                minWidth: { xs: "100%", sm: "180px" },
              })}
            >
              {metric.icon}
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mt: 1, mb: 0.5, fontWeight: "medium" }}
              >
                {metric.label}
              </Typography>
              <Chip
                label={metric.value}
                color={metric.chipColor}
                size="small"
                variant="filled"
              />
            </Paper>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
};

export default PlantPage;
