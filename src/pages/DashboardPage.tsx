// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuthStore } from "../store/useAuthStore";
import { plantService } from "../services/plantService";
import { Plant } from "../types";
import PlantCard from "../features/plant/PlantCard";
import { toast } from "react-hot-toast";

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openAddPlantDialog, setOpenAddPlantDialog] = useState(false);
  const [newPlantName, setNewPlantName] = useState("");
  const [newPlantLocation, setNewPlantLocation] = useState("");

  const handleOpenAddPlantDialog = () => {
    setOpenAddPlantDialog(true);
  };

  const handleCloseAddPlantDialog = () => {
    setOpenAddPlantDialog(false);
    // Limpar campos ao fechar, opcional
    setNewPlantName("");
    setNewPlantLocation("");
  };

  const fetchPlants = async () => {
    if (user) {
      setIsLoading(true);
      const userPlants = await plantService.getPlantsByUserId(user.id);
      setPlants(userPlants);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, [user]);

  const handleAddPlant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && newPlantName && newPlantLocation) {
      await plantService.addPlant(user.id, newPlantName, newPlantLocation);
      toast.success(`Planta "${newPlantName}" adicionada!`);
      setNewPlantName("");
      setNewPlantLocation("");
      handleCloseAddPlantDialog();
      fetchPlants(); // Re-fetch
    }
  };

  const handleDeletePlant = async (plantId: string) => {
    if (window.confirm("Tem certeza que deseja remover esta planta?")) {
      await plantService.deletePlant(plantId);
      toast.success("Planta removida.");
      fetchPlants();
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Suas Plantas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddPlantDialog}
        >
          Nova Planta
        </Button>
      </Box>

      <Dialog open={openAddPlantDialog} onClose={handleCloseAddPlantDialog} PaperProps={{ component: 'form', onSubmit: handleAddPlant }}>
        <DialogTitle>Adicionar Nova Planta</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}> {/* Adicionado pt para espaçamento do título */}
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Nome da Planta"
              type="text"
              fullWidth
              variant="outlined"
              value={newPlantName}
              onChange={(e) => setNewPlantName(e.target.value)}
              required
            />
            <TextField
              margin="dense"
              id="location"
              label="Localização"
              type="text"
              fullWidth
              variant="outlined"
              value={newPlantLocation}
              onChange={(e) => setNewPlantLocation(e.target.value)}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 2 }}>
          <Button onClick={handleCloseAddPlantDialog}>Cancelar</Button>
          <Button type="submit" variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>

      {plants.length > 0 ? (
        <Stack
          direction="row"
          spacing={3}
          sx={{ flexWrap: "wrap", alignItems: "stretch" }}
        >
          {plants.map((plant) => (
            <Box
              key={plant.id}
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 12px)", // 12px = theme.spacing(1.5) for spacing={3}
                  md: "calc(33.333% - 16px)", // 16px = theme.spacing(2) for spacing={3}
                },
                display: "flex", // to make PlantCard stretch if it has height 100%
              }}
            >
              <PlantCard
                plant={plant}
                onDelete={handleDeletePlant}
              />
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography sx={{ mt: 5, textAlign: "center" }}>
          Você ainda não cadastrou nenhuma planta. Clique em "Nova Planta" para
          começar.
        </Typography>
      )}
    </Box>
  );
};

export default DashboardPage;
