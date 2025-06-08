// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper, // Adicionado para a mensagem de "nenhuma planta"
  TextField,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // Ícone para mensagem
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
    setNewPlantName("");
    setNewPlantLocation("");
  };

  const fetchPlants = async () => {
    if (user) {
      setIsLoading(true);
      try {
        const userPlants = await plantService.getPlantsByUserId(user.id);
        setPlants(userPlants);
      } catch (error) {
        toast.error("Erro ao buscar plantas.");
        console.error("Erro ao buscar plantas:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchPlants();
  }, [user]);

  const handleAddPlant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && newPlantName && newPlantLocation) {
      const toastId = toast.loading("Salvando planta...");
      try {
        await plantService.addPlant(user.id, newPlantName, newPlantLocation);
        toast.success(`Planta "${newPlantName}" adicionada!`, { id: toastId });
        setNewPlantName("");
        setNewPlantLocation("");
        handleCloseAddPlantDialog();
        fetchPlants(); 
      } catch (error) {
        toast.error("Falha ao adicionar planta.", { id: toastId });
        console.error("Falha ao adicionar planta:", error);
      }
    }
  };

  const handleDeletePlant = async (plantId: string) => {
    if (window.confirm("Tem certeza que deseja remover esta planta?")) {
      const toastId = toast.loading("Removendo planta...");
      try {
        await plantService.deletePlant(plantId);
        toast.success("Planta removida.", { id: toastId });
        fetchPlants();
      } catch (error) {
        toast.error("Falha ao remover planta.", { id: toastId });
        console.error("Falha ao remover planta:", error);
      }
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
          flexWrap: 'wrap', 
          gap: 2 
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "text.primary" }}>
          Suas Plantas
        </Typography>
        <Button
          variant="contained"
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleOpenAddPlantDialog}
          sx={{ py: 1, px: 2 }} 
        >
          Nova Planta
        </Button>
      </Box>

      <Dialog 
        open={openAddPlantDialog} 
        onClose={handleCloseAddPlantDialog} 
        PaperProps={{ component: 'form', onSubmit: handleAddPlant }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Adicionar Nova Planta</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
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
        <DialogActions sx={{ pb: 2, pr: 2, pt:0 }}>
          <Button onClick={handleCloseAddPlantDialog} variant="outlined" color="secondary">Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>

      {plants.length > 0 ? (
        <Stack
          direction="row"
          spacing={3} // Este spacing é 24px por padrão (3 * 8px)
          useFlexGap // Para melhor comportamento do spacing com flexWrap
          sx={{ flexWrap: "wrap", alignItems: "stretch" }}
        >
          {plants.map((plant) => (
            <Box
              key={plant.id}
              sx={(theme) => ({ // Adicionado theme para acesso a theme.spacing
                // Ajustes para responsividade com base no spacing={3} (24px)
                // xs: 100%
                // sm: 2 colunas -> 50% - (spacing / 2)
                // md: 3 colunas -> 33.33% - (spacing * 2 / 3)
                // lg: 4 colunas -> 25% - (spacing * 3 / 4)
                flexGrow: 1, // Permite que os itens cresçam
                flexShrink: 1, // Permite que encolham
                flexBasis: {
                  xs: "100%",
                  sm: `calc(50% - ${theme.spacing(1.5)})`, // 12px
                  md: `calc(33.333% - ${theme.spacing(2)})`, // 16px
                  lg: `calc(25% - ${theme.spacing(2.25)})` // 18px
                },
                minWidth: {sm: '280px'}, // Evitar que os cards fiquem muito espremidos
                display: "flex", 
                flexWrap: "wrap",
              })}
            >
              <PlantCard
                plant={plant}
                onDelete={handleDeletePlant}
              />
            </Box>
          ))}
        </Stack>
      ) : (
        <Paper 
          variant="outlined" 
          sx={(theme) => ({ 
            mt: 5, 
            p: 3, 
            textAlign: "center", 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: theme.spacing(1),
            borderColor: theme.palette.divider,
            borderRadius: theme.shape.borderRadius
          })}
        >
          <InfoOutlinedIcon color="action" sx={{ fontSize: 40 }}/>
          <Typography variant="h6" color="text.secondary">
            Nenhuma planta cadastrada
          </Typography>
          <Typography color="text.secondary">
            Clique em "Nova Planta" para começar a monitorar.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default DashboardPage;
