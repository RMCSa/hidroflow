// src/features/plant/PlantCard.tsx
import React, { useState } from "react"; // Adicionado useState
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DeleteIcon from "@mui/icons-material/Delete";
import SpaIcon from "@mui/icons-material/Spa";
import CircleIcon from "@mui/icons-material/Circle";
import WaterIcon from "@mui/icons-material/Water";
import { Plant } from "../../types";
import { useMqtt } from "../../hooks/useMqtt";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import ConfirmationModal from "../../components/ConfirmationModal"; // Importado o Modal

// Calibrações
const MAX_WATER_LEVEL_RAW_VALUE = 1125;
const MAX_HUMIDITY_RAW_VALUE = 4095;

interface PlantCardProps {
  plant: Plant;
  onDelete: (plantId: string) => Promise<void> | void; // Ajustado para refletir que pode ser async
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, onDelete }) => {
  const navigate = useNavigate();
  const { espStatus, lastData } = useMqtt(plant.mqttTopicId || plant.id);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusColor = () => {
    if (espStatus === "Online") return "success.main";
    if (espStatus === "Offline") return "error.main";
    return "text.disabled";
  };

  const waterLevelPercent = lastData?.water_level
    ? Math.min(
        100,
        Math.max(0, (lastData.water_level / MAX_WATER_LEVEL_RAW_VALUE) * 100)
      )
    : null;

  const humidityPercent = lastData?.humidity
    ? Math.min(
        100,
        Math.max(0, 100 - (lastData.humidity / MAX_HUMIDITY_RAW_VALUE) * 100)
      )
    : null;

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setOpenDeleteConfirm(true); // Abre o modal de confirmação
  };

  const handleConfirmDeletePlant = async () => {
    setIsDeleting(true);
    try {
      await onDelete(plant.id); // A prop onDelete já lida com toasts e re-fetch
      // O modal será fechado no finally ou externamente se onDelete for bem sucedido
    } catch (error) {
      // Se onDelete não tratar erros com toast, poderia ser feito aqui.
      // Mas geralmente a função passada em onDelete já faz isso.
      console.error("Erro ao deletar planta (PlantCard):", error);
    } finally {
      setIsDeleting(false);
      setOpenDeleteConfirm(false); // Garante que o modal feche
    }
  };

  const gaugeSize = 80;
  const gaugeTextSize = 18;

  return (
    <>
      {" "}
      {/* Fragmento para permitir o Modal como irmão do Card */}
      <Card
        onClick={() => navigate(`/plant/${plant.id}`)}
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: isMobile ? "21rem" : "23rem",
          borderLeft: 5,
          borderColor: "success.main",
          boxShadow: `${theme.shadows[2]}, 0px 3px 8px rgba(76, 175, 80, 0.15)`,
          transition: "box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out",
          textDecoration: "none",
          position: "relative",
          cursor: "pointer",
          "&:hover": {
            boxShadow: `${theme.shadows[6]}, 0px 6px 15px rgba(76, 175, 80, 0.25)`,
            transform: "translateY(-4px)",
          },
        })}
      >
        <IconButton
          size="small"
          color="error"
          onClick={handleDeleteClick} // Agora abre o modal
          aria-label={`Remover planta ${plant.name}`}
          sx={(theme) => ({
            position: "absolute",
            top: theme.spacing(0.5),
            right: theme.spacing(0.5),
            zIndex: 2,
            backgroundColor: "rgba(255,255,255,0.5)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.8)",
            },
          })}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>

        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: (theme) => theme.spacing(1.5),
            paddingTop: (theme) => theme.spacing(2),
            mb: 1
          }}
        >
          {/* Seção Nome e Localização */}
          <Box sx={{ pr: (theme) => theme.spacing(3) }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <SpaIcon
                sx={{ mr: 1, color: "success.main", fontSize: "1.75rem" }}
              />
              <Typography
                variant="h6"
                component="div"
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
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                ml: "calc(1rem + 18px)",
              }}
            >
              <LocationOnIcon
                sx={{ mr: 0.5, fontSize: "0.875rem", color: "text.secondary" }}
              />
              <Typography
                color="text.secondary"
                variant="caption"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {plant.location}
              </Typography>
            </Box>
          </Box>

          {/* Seção de Gauges */}
          {espStatus === "Online" &&
            (waterLevelPercent !== null || humidityPercent !== null) && (
              <Stack
                direction="row"
                spacing={1}
                justifyContent="space-evenly"
                alignItems="center"
                sx={{ width: "100%", mt: 1 }}
              >
                {waterLevelPercent !== null && (
                  <Stack alignItems="center" spacing={0.5}>
                    <Gauge
                      width={gaugeSize}
                      height={gaugeSize}
                      value={waterLevelPercent}
                      startAngle={-90}
                      endAngle={90}
                      text={`${waterLevelPercent.toFixed(0)}%`}
                      sx={(theme) => ({
                        [`& .${gaugeClasses.valueText}`]: {
                          fontSize: gaugeTextSize,
                          fontWeight: "medium",
                          transform: "translate(0px, 10px)",
                        },
                        [`& .${gaugeClasses.valueArc}`]: {
                          fill: theme.palette.info.main,
                        },
                        [`& .${gaugeClasses.referenceArc}`]: {
                          fill: theme.palette.grey[200],
                        },
                      })}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ lineHeight: 1 }}
                    >
                      Reservatório
                    </Typography>
                  </Stack>
                )}
                {humidityPercent !== null && (
                  <Stack alignItems="center" spacing={0.5}>
                    <Gauge
                      width={gaugeSize}
                      height={gaugeSize}
                      value={humidityPercent}
                      startAngle={-90}
                      endAngle={90}
                      text={`${humidityPercent.toFixed(0)}%`}
                      sx={(theme) => ({
                        [`& .${gaugeClasses.valueText}`]: {
                          fontSize: gaugeTextSize,
                          fontWeight: "medium",
                          transform: "translate(0px, 10px)",
                        },
                        [`& .${gaugeClasses.valueArc}`]: {
                          fill: theme.palette.success.main,
                        },
                        [`& .${gaugeClasses.referenceArc}`]: {
                          fill: theme.palette.grey[200],
                        },
                      })}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ lineHeight: 1 }}
                    >
                      Umidade
                    </Typography>
                  </Stack>
                )}
              </Stack>
            )}
        </CardContent>

        {/* Status do Dispositivo posicionado absolutamente */}
        <Box
          sx={(theme) => ({
            position: "absolute",
            bottom: theme.spacing(0.5),
            right: theme.spacing(1),
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.5)",
            padding: theme.spacing(0.25, 0.5),
            borderRadius: (theme.shape.borderRadius as number) / 2,
          })}
        >
          <CircleIcon
            sx={{ fontSize: "0.6rem", mr: 0.5, color: getStatusColor() }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ lineHeight: 1 }}
          >
            {espStatus}
          </Typography>
        </Box>
      </Card>
      <ConfirmationModal
        open={openDeleteConfirm}
        onClose={() => {
          if (!isDeleting) {
            setOpenDeleteConfirm(false);
          }
        }}
        title="Confirmar Remoção"
        message={
          <Typography>
            Tem certeza que deseja remover a planta{" "}
            <strong>{plant.name}</strong>? Esta ação não poderá ser desfeita.
          </Typography>
        }
        actionLabel="Remover"
        onAction={handleConfirmDeletePlant}
        actionButtonColor="error"
        isLoading={isDeleting}
        icon={<DeleteIcon sx={{ fontSize: 36 }} />} // Ícone para o modal
      />
    </>
  );
};

export default PlantCard;
