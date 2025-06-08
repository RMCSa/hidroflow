// src/services/plantService.ts
import { Plant } from "../types";

// Mock DB de plantas
let plants: Plant[] = [
  {
    id: "plant_1",
    userId: "user_1",
    name: "Samambaia",
    location: "Sala de Estar",
    mqttTopicId: "samambaia_01",
  },
  {
    id: "plant_2",
    userId: "user_1",
    name: "Orquídea",
    location: "Varanda",
    mqttTopicId: "orquidea_05",
  },
];

export const plantService = {
  getPlantsByUserId: (userId: string): Promise<Plant[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(plants.filter((p) => p.userId === userId));
      }, 300);
    });
  },

  getPlantById: (plantId: string): Promise<Plant | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const plant = plants.find((p) => p.id === plantId);
        resolve(plant);
      }, 300);
    });
  },

  addPlant: (
    userId: string,
    name: string,
    location: string
  ): Promise<Plant> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPlant: Plant = {
          id: `plant_${Date.now()}`,
          userId,
          name,
          location,
          mqttTopicId: `${name.toLowerCase().replace(" ", "_")}_${Math.floor(
            Math.random() * 100
          )}`,
        };
        plants.push(newPlant);
        resolve(newPlant);
      }, 300);
    });
  },

  deletePlant: (plantId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        plants = plants.filter((p) => p.id !== plantId);
        resolve();
      }, 300);
    });
  },
};
